import {useEffect, useState} from 'react';
import {Button, Form} from 'react-bootstrap';
import {
    checkTelegramUsernameExists,
    getDefaultHeaders,
    initiateCredentialsAvailabilityChecking,
    isLoggedIn,
    requestAdditionalApprovalCode,
    signIn
} from '../../index.js'
import '@fortawesome/fontawesome-free/css/all.css'
import * as endpoints from "../../constants/endpoints";
import {Client} from '@stomp/stompjs';
import {redirectToPreviousLoginUrl, redirectToSignIn, redirectToUI} from "../../utilities/redirect";
import Header from "../components/Header";
import Footer from "../components/Footer";
import * as utility from '../../constants/pattern.js'
import {notifyError, notifySuccess} from "../../utilities/notify";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAsterisk, faEye, faEyeSlash} from "@fortawesome/free-solid-svg-icons";
import {useLanguage} from "../../contexts/language/language-context";

const SignUpForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [telegramUsername, setTelegramUsername] = useState('');
    const [code, setCode] = useState('');

    const [usernameException, setUsernameException] = useState('');
    const [emailException, setEmailException] = useState('');
    const [passwordException, setPasswordException] = useState('');
    const [passwordConfirmationException, setPasswordConfirmationException] = useState('');
    const [telegramUsernameException, setTelegramUsernameException] = useState('');
    const [codeException, setCodeException] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [showTelegramInput, setShowTelegramInput] = useState(false);
    const [telegramSigningUp, setTelegramSigningUp] = useState(false);
    const [emailSigningUp, setEmailSigningUp] = useState(false);

    const [lastTimePoint: number, setLastTimePoint] = useState(new Date(0).getTime());

    const { language, setLanguage } = useLanguage();

    let webSocketClient;

    const handleUsernameChange = (value) => {
        setUsername(value)
        if (value === '') {
            setUsernameException('')
            return
        }

        if ((!(/^[a-zA-Z0-9]{5,33}$/).test(value)) && value) {
            if (language === 'EN') {
                setUsernameException('Invalid username')
            } else {
                setUsernameException('Ім я користувача невалідне')
            }
        } else {
            setUsernameException('')
        }
    };

    const handleEmailChange = (value) => {
        setEmail(value)
        if (value === '') {
            setEmailException('')
            return
        }

        if (!(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).test(value) && value) {
            if (language === 'EN') {
                setEmailException('Invalid email')
            } else {
                setEmailException('Електронна пошта невалідна')
            }
        } else {
            setEmailException('')
        }
    };

    const handlePasswordChange = (value) => {
        setPassword(value)
        if (value === '') {
            setPasswordException('')
            return
        }

        if (!(/^[a-zA-Z0-9]{8,33}$/).test(value) && value) {
            if (language === 'EN') {
                setPasswordException('Invalid password')
            } else {
                setPasswordException('Невалідний пароль')
            }
        } else {
            setPasswordException('')
        }

        if (value === passwordConfirmation) {
            setPasswordConfirmationException('')
        }
    };

    const handlePasswordConfirmationChange = (value) => {
        setPasswordConfirmation(value)
        if (value === '') {
            setPasswordConfirmationException('')
            return
        }

        if (value !== password && value) {
            if (language === 'EN') {
                setPasswordConfirmationException('Passwords not match')
            } else {
                setPasswordConfirmationException('Паролі не збігаються')
            }
        } else {
            setPasswordConfirmationException('')
        }
    };

    const handleTelegramNicknameChange = (value) => {
        setTelegramUsername(value)
        if (value === '') {
            setTelegramUsernameException('')
            return
        }

        if (!utility.TELEGRAM_USERNAME_PATTERN.test(value) && value) {
            if (language === 'EN') {
                setTelegramUsernameException('Invalid telegram username, must be in format @Username 5 list of username at least')
            } else {
                setTelegramUsernameException('Невалідний телеграм нікнейм, повинен зберігати формат @Юзернейм і не менше 5 символів')
            }
        } else {
            setTelegramUsernameException('')
        }
    };

    const handleCodeChange = (value) => {
        setCode(value)
        if (value === '') {
            setCodeException('')
            return
        }

        if (!(/^[0-9\-A-Z]{4,}$/).test(value) && value) {
            if (language === 'EN') {
                setCodeException('Invalid code')
            } else {
                setCodeException('Невалідний код')
            }
        } else {
            setCodeException('')
        }
    };

    const initiateCredentialsAvailabilityCheckingHook = async () => {
        return await initiateCredentialsAvailabilityChecking(username, email, telegramUsername, setUsernameException, setEmailException, setTelegramUsernameException)
    };

    const handleSignUp = async () => {
        if (await initiateCredentialsAvailabilityCheckingHook() && infoValid()) {
            if (language === 'EN') {
                notifySuccess('Initiating verification process...')
            } else {
                notifySuccess('Ініціація процесу верифікації...')
            }
            if (telegramUsername !== '') {
                if (await checkTelegramUsernameExists(telegramUsername)) {
                    await initiateSigningUp()
                }
            } else {
                await initiateSigningUp()
            }
        } else {
            if (!username) {
                if (language === 'EN') {
                    setUsernameException('Invalid username')
                } else {
                    setUsernameException('Ім я користувача невалідне')
                }
            }
            if (!email && !showTelegramInput) {
                if (language === 'EN') {
                    setEmailException('Invalid email')
                } else {
                    setEmailException('Невалідна поштова адреса')
                }
            }
            if (!password) {
                if (language === 'EN') {
                    setPasswordException('Invalid password')
                } else {
                    setPasswordException('Невалідний пароль')
                }
            }
            if (!passwordConfirmation) {
                if (language === 'EN') {
                    setPasswordConfirmationException('Passwords not match')
                } else {
                    setPasswordConfirmationException('Не збігаються паролі')
                }
            }
            if (!telegramUsername && showTelegramInput) {
                if (language === 'EN' ) {
                    setTelegramUsernameException('Invalid telegram username')
                } else {
                    setTelegramUsernameException('Телеграм ідентифікатор невалідний')
                }
            }
        }
    };

    const initiateSigningUp = async () => {
        const requestData = {
            username: username,
            email: email === '' ? null : email,
            password: password,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            telegramUsername: telegramUsername === '' ? null : telegramUsername.replace('@', '')
        };

        const requestOptions = {
            method: 'POST',
            headers: getDefaultHeaders() ,
            body: JSON.stringify(requestData),
        };

        await fetch(`${endpoints.signUpEndpoint}`, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                if (showTelegramInput) {
                    setTelegramSigningUp(true)
                } else {
                    setEmailSigningUp(true)
                }

                return response.json();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    const initiateVerification = async () => {
        if (code === '') {
            if (language === 'EN') {
                notifyError('Code for verification is not set');
            } else {
                notifyError('Код для верифікації не вказано')
            }
            return;
        }

        const requestData = {
            identifier: telegramUsername.replace('@', ''),
            code: code
        };

        const requestOptions = {
            method: 'POST',
            headers: getDefaultHeaders() ,
            body: JSON.stringify(requestData),
        };

        await fetch(`${endpoints.certificationEndpoint}`, requestOptions)
            .then(async response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                return response.json();
            })
            .then(data => {
                if (data && data.status === 'OK') {
                    const success: boolean = signIn(username, password);

                    if (success) {
                        redirectToPreviousLoginUrl();
                    }
                } else {
                    notifyError(data['exception']['exception'])
                }
            })
            .catch(error => {
                console.error('Error:', error);
                notifyError(error)
            });
    };

    const infoValid = () => {
        return usernameException === '' && passwordException === '' && passwordConfirmationException === '' && emailException === '' && telegramUsernameException === ''
            && username !== '' && password !== '' && passwordConfirmation === password && (email !== '' || telegramUsername !== '');
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    };

    const toggleTelegramCheckbox = () => {
        if (!showTelegramInput) {
            if (language === 'EN') {
                notifySuccess('Subscribe to telegram BOT(send message)')
            } else {
                notifySuccess('Напишіть повідомлення телеграм боту для підписки')
            }
        }

        setShowTelegramInput(!showTelegramInput);
        setEmail('')
        setTelegramUsername('')
        setEmailException('')
        setTelegramUsernameException('')
    };

    const requestAdditionalApprovalCodeHook = () => {
        const delay: number = Math.abs(lastTimePoint - new Date().getTime());
        if (delay < 60) {
            if (language === 'EN') {
                notifyError(`Too often invocation, wait another ${(60 - delay)} seconds`)
            } else {
                notifyError(`Забагато запитів, зачекайте ${(60 - delay)} секунд`)
            }
        } else {
            if (telegramUsername !== '') {
                requestAdditionalApprovalCode(telegramUsername.replace('@', ''))
            } else if (email !== '') {
                requestAdditionalApprovalCode(email)
            }
        }
    }

    useEffect(() => {
        if (isLoggedIn()) {
            redirectToUI()
        }

        webSocketClient = new Client({
            brokerURL: process.env.REACT_APP_MESSAGE_SERVICE_WEB_SOCKET_ADDRESS,
            debug: function (str) {
                console.log(str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 1000,
            heartbeatOutgoing: 1000,
        });

        webSocketClient.onConnect = () => {
            console.log('Connected to WebSocket server');
        };

        webSocketClient.onStompError = (frame) => {
            console.log('WebSocket error:', frame.headers.message);
        };

        webSocketClient.activate();
    }, [telegramUsername])

    const render = () => {
         if (!telegramSigningUp && !emailSigningUp) {
             return (
                 <Form style={{ width: '30vw', margin: 'auto' }} className="custom-form">
                     <Form.Group controlId="formUsername" className="m-3">
                         <Form.Label>
                             {
                                 language === 'EN' ? 'Username' : 'Ім\'я користувача...'
                             }
                         </Form.Label>
                         <div className="input-container">
                             <Form.Control
                                 type="text"
                                 placeholder={ language === 'EN' ? "Enter your username" : 'Введіть ім\'я користувача...'}
                                 style={{paddingLeft: '30px'}}
                                 value={username}
                                 onChange={(e) => handleUsernameChange(e.target.value) } />
                             <FontAwesomeIcon icon={faAsterisk} className="required-field" title='This field is required'/>
                         </div>
                         <p style={{wordBreak: 'break-word', marginTop: '1em', color: 'white', fontSize: '1.1em'}} hidden={usernameException === ''}>{usernameException}</p>
                     </Form.Group>

                     {!showTelegramInput ?
                         <Form.Group controlId="formEmail" className="m-3">
                             <Form.Label>
                                 {
                                     language === 'EN' ? 'Email' : 'Ваша поштова адреса'
                                 }
                             </Form.Label>
                             <div className="input-container">
                                 <Form.Control
                                     type="text"
                                     placeholder={ language === 'EN' ? "Enter your email" : 'Введіть вашу поштову адресу...'}
                                     style={{paddingLeft: '30px'}}
                                     value={email}
                                     onChange={(e) => handleEmailChange(e.target.value)} />
                                 <FontAwesomeIcon icon={faAsterisk} className="required-field" title='This field is required'/>
                             </div>
                             <p style={{wordBreak: 'break-word', marginTop: '1em', color: 'white', fontSize: '1.1em'}} hidden={emailException === ''}>{emailException}</p>
                         </Form.Group>
                         :
                         null
                     }

                     <Form.Group controlId="formPassword" className="m-3">
                         <Form.Label>
                             {
                                 language === 'EN' ? 'Password' : 'Ваш пароль'
                             }
                         </Form.Label>
                         <div className="input-container">
                             <Form.Control
                                 type={showPassword ? 'text' : 'password'}
                                 placeholder={ language === 'EN' ? "Enter your password" : 'Введіть ваш пароль...'}
                                 style={{paddingLeft: '30px'}}
                                 value={password}
                                 onChange={(e) => handlePasswordChange(e.target.value)} />
                             <FontAwesomeIcon icon={faAsterisk} className="required-field" title='This field is required'/>
                             <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye}  className="password-toggle-icon" onClick={togglePasswordVisibility}  title='Toggle password'/>
                         </div>
                         <p style={{wordBreak: 'break-word', marginTop: '1em', color: 'white', fontSize: '1.1em'}} hidden={passwordException === ''}>{passwordException}</p>
                     </Form.Group>

                     <Form.Group controlId="formConfirmationPassword" className="m-3">
                         <Form.Label>
                             {
                                 language === 'EN' ? 'Repeat Password' : 'Введіть пароль ще раз'
                             }
                         </Form.Label>
                         <div className="input-container">
                             <Form.Control
                                 type={showPassword ? 'text' : 'password'}
                                 placeholder={ language === 'EN' ? "Repeat your password" : 'Ще раз введіть пароль...'}
                                 style={{paddingLeft: '30px'}}
                                 value={passwordConfirmation}
                                 readOnly={passwordException !== ''}
                                 onChange={(e) => handlePasswordConfirmationChange(e.target.value)} />
                             <FontAwesomeIcon icon={faAsterisk} className="required-field" title='This field is required'/>
                         </div>
                         <p style={{wordBreak: 'break-word', marginTop: '1em', color: 'white', fontSize: '1.1em'}} hidden={passwordConfirmationException === ''}>{passwordConfirmationException}</p>
                     </Form.Group>

                     <Form.Group controlId="formTelegram" className="m-3">
                         <Form.Check
                             type="checkbox"
                             label={ language === 'EN' ? "Do you want to verify your account by Telegram?" : 'Бажаєте підтвердити вашу реєстрацію за допомогою Телеграм?'}
                             onChange={toggleTelegramCheckbox}
                             className="mb-3"
                         />
                         {showTelegramInput &&
                             <div className="input-container">

                                 <FontAwesomeIcon icon={faAsterisk} className="required-field" title='This field is required'/>
                                 <Form.Control
                                     type="text"
                                     placeholder={language === 'EN' ? "Enter your Telegram nickname => TELEGRAM" : 'Телеграм ім\'я користувача'}
                                     style={{paddingLeft: '30px'}}
                                     value={telegramUsername}
                                     onChange={(e) => handleTelegramNicknameChange(e.target.value)}
                                 />
                                 <FontAwesomeIcon icon={faAsterisk} className="required-field" />
                             </div>
                         }
                         {showTelegramInput &&
                             <Button type="button" className="mt-3" onClick={() => window.open(process.env.REACT_APP_TELEGRAM_BOT_ADDRESS, '_blank', 'noopener,noreferrer')}>
                                 {
                                     language === 'EN' ? 'Subscribe To Bot' : 'Телеграм Бот'
                                 }
                             </Button>
                         }
                         <p style={{wordBreak: 'break-word', marginTop: '1em', color: 'white', fontSize: '1.1em'}} hidden={telegramUsernameException === ''}>{telegramUsernameException}</p>
                     </Form.Group>

                     <Button variant={infoValid() ? 'primary' : 'secondary'} type="button" className="m-3" disabled={!infoValid()} onClick={() => handleSignUp()}>
                         {
                             language === 'EN' ? 'Sign Up' : 'Зареєструватися'
                         }
                     </Button>
                     <Button variant="secondary" type="button" className="m-3" onClick={() => redirectToSignIn()}>
                         {
                             language === 'EN' ? 'Switch To Sign In' : 'Логін'
                         }
                     </Button>
                 </Form>
             );
         } else if (telegramSigningUp && !emailSigningUp) {
             return (
                 <Form style={{ width: '30vw', margin: 'auto' }} className="custom-form">
                     <Form.Group controlId="formCode" className="m-3">
                         <Form.Label>
                             {
                                 language === 'EN' ? 'Verification Code' : 'Код Підтвердження'
                             }
                         </Form.Label>
                         <Form.Control
                             type="text"
                             placeholder={language === 'EN' ? "Enter your code here..." : 'Введіть ваш код...'}
                             value={code}
                             onChange={(e) => handleCodeChange(e.target.value) }
                         />
                         <p style={{wordBreak: 'break-word', marginTop: '1em', color: 'white', fontSize: '1.1em'}} hidden={codeException === ''}>{codeException}</p>
                     </Form.Group>

                     <Button variant={codeException === '' ? 'primary' : 'secondary'} type="button" className="m-3" disabled={codeException !== '' && code !== ''} onClick={() => initiateVerification()}>
                         {
                             language === 'EN' ? 'Confirm' : 'Підтвердити'
                         }
                     </Button>
                     <Button type={'button'} onClick={() => requestAdditionalApprovalCodeHook()}>
                         {
                             language === 'EN' ? 'Request Additional Code' : 'Ініціювати отримання нового коду'
                         }
                     </Button>
                 </Form>
             );
         } else if (!telegramSigningUp && emailSigningUp) {
             return (
                 <Form style={{ width: '30vw', margin: 'auto' }} className="custom-form">
                     <Form.Group>
                         <Form.Label>
                             {
                                 language === 'EN' ? `Verification email was sent to ${email}, check your mails and follow instructions in it`
                                     :
                                     `Лист на пошту ${email} надіслано, перевірте вашу пошту і слідуйте інструкціям у листі`
                             }
                         </Form.Label>
                     </Form.Group>
                     <Button variant="secondary" type="button" className="m-3" onClick={() => redirectToSignIn()}>
                         {
                             language === 'EN' ? 'Login' : 'Логін'
                         }
                     </Button>
                 </Form>
             )
         }
     }
    return (
        <div className="tone">
            <Header />
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '84vh', fontFamily: 'monospace', fontSize: '1.1em'}}>
            {
                render()
            }
            </div>
            <Footer />
        </div>
    );
};

export default SignUpForm;
