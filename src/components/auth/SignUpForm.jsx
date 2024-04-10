import {useEffect, useState} from 'react';
import {Button, Col, Container, Form, Row} from 'react-bootstrap';
import {getDefaultHeaders, signIn} from '../../index.js'
import '@fortawesome/fontawesome-free/css/all.css'
import {certificationEndpoint, checkCredentialsAvailabilityEndpoint, signUpEndpoint} from "../../constants/endpoints";
import {Client} from '@stomp/stompjs';
import {redirectToPreviousLoginUrl, redirectToSignIn, redirectToUI} from "../../utilities/redirect";
import logo from "../../resources/logo.png";

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

    const handleUsernameChange = (value) => {
        setUsername(value)
        if (value === '') {
            setUsernameException('')
            return
        }

        if ((!(/^[a-zA-Z0-9]{5,33}$/).test(value)) && value) {
            setUsernameException('Invalid username')
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
            setEmailException('Invalid email')
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
            setPasswordException('Invalid password')
        } else {
            setPasswordException('')
        }
    };

    const handlePasswordConfirmationChange = (value) => {
        setPasswordConfirmation(value)
        if (value === '') {
            setPasswordConfirmationException('')
            return
        }

        if (value !== password && value) {
            setPasswordConfirmationException('Passwords not match')
        } else {
            setPasswordConfirmationException('')
        }
    }

    const handleTelegramNicknameChange = (value) => {
        setTelegramUsername(value)
        if (value === '') {
            setTelegramUsernameException('')
            return
        }

        if (!(/^[A-Za-z0-9_]{5,}$/).test(value) && value) {
            setTelegramUsernameException('Invalid telegram username')
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
            setCodeException('Invalid code')
        } else {
            setCodeException('')
        }
    };

    const initiateCredentialsAvailabilityChecking = async () => {
        const requestData = {
            username: username,
            email: email === '' ? null : email,
            telegramUsername: telegramUsername === '' ? null : telegramUsername
        };

        const requestOptions = {
            method: 'POST',
            headers: getDefaultHeaders() ,
            body: JSON.stringify(requestData),
        };

        let result = true

        await fetch(`${checkCredentialsAvailabilityEndpoint}`, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                return response.json();
            })
            .then(json => {
                if (json.data.email === false && email !== '') {
                    setEmailException('User with this email already exists')
                    result = false
                }
                if (json.data.username === false) {
                    setUsernameException('User with this username already exists')
                    result = false
                }
                if (json.data.telegramUsername === false && telegramUsername !== '') {
                    setTelegramUsernameException('User with this telegram already exists')
                    result = false
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });

        return result;
    }

    const handleSignUp = async () => {
        if (await initiateCredentialsAvailabilityChecking() && infoValid()) {
            await initiateSigningUp()
        } else {
            if (!username) {
                setUsernameException('Invalid username')
            }
            if (!email && !showTelegramInput) {
                setEmailException('Invalid email')
            }
            if (!password) {
                setPasswordException('Invalid password')
            }
            if (!passwordConfirmation) {
                setPasswordConfirmationException('Passwords not match')
            }
            if (!telegramUsername && showTelegramInput) {
                setTelegramUsernameException('Invalid telegram username')
            }
        }
    };

    const initiateSigningUp = async () => {
        const requestData = {
            username: username,
            email: email === '' ? null : email,
            password: password,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            telegramUsername: telegramUsername === '' ? null : telegramUsername
        };

        const requestOptions = {
            method: 'POST',
            headers: getDefaultHeaders() ,
            body: JSON.stringify(requestData),
        };

        await fetch(`${signUpEndpoint}`, requestOptions)
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
        const requestData = {
            identifier: telegramUsername,
            code: code
        };

        const requestOptions = {
            method: 'POST',
            headers: getDefaultHeaders() ,
            body: JSON.stringify(requestData),
        };

        await fetch(`${certificationEndpoint}`, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                } else {
                    signIn(username, password)
                        .then(() => {
                            console.log('Sign in invocation is done');
                            redirectToPreviousLoginUrl();
                        })
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    const infoValid = () => {
        return usernameException === '' && passwordException === '' && passwordConfirmationException === '' && emailException === '' && telegramUsernameException === ''
            && username !== '' && password !== '' && passwordConfirmation === password && (email !== '' || telegramUsername !== '');
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    const toggleTelegramCheckbox = () => {
        setShowTelegramInput(!showTelegramInput);
        setEmail('')
        setTelegramUsername('')
        setEmailException('')
        setTelegramUsernameException('')
    };

    useEffect(() => {
        // WebSocket endpoint URL
        const websocketUrl = 'ws://localhost:9005/ws';

        // Create a WebSocket client instance
        const client = new Client({
            brokerURL: websocketUrl,
            debug: function (str) {
                console.log(str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        // Connect to the WebSocket server
        client.activate();

        // Handle connection open event
        client.onConnect = () => {
            console.log('Connected to WebSocket server');

            // Subscribe to a destination
            client.subscribe('/topic/telegram/subscription/Nick1nameee', (message) => {
                console.log('Received message:', message.body);
                // Handle received message
            });

            // Send a message
            client.publish({
                destination: '/socket/example',
                body: 'Hello from React!',
            });
        };

        // Handle connection error
        client.onStompError = (frame) => {
            console.log('WebSocket error:', frame.headers.message);
            // Handle error
        };

    }, [])

    const render = () => {
         if (!telegramSigningUp && !emailSigningUp) {
             return (
                 <Form style={{ width: '30vw', margin: 'auto' }} className="custom-form">
                     <Form.Group controlId="formUsername" className="m-3">
                         <Form.Label>Username</Form.Label>
                         <Form.Control
                             type="text"
                             placeholder="Enter your username"
                             value={username}
                             onChange={(e) => handleUsernameChange(e.target.value) }
                         />
                         {
                             usernameException === '' ? null :
                                 <Form.Control
                                     type="text"
                                     readOnly={true}
                                     value={usernameException}/>
                         }
                     </Form.Group>

                     {!showTelegramInput ?
                         <Form.Group controlId="formEmail" className="m-3">
                             <Form.Label>Email</Form.Label>
                             <Form.Control
                                 type="text"
                                 placeholder="Enter your email"
                                 value={email}
                                 onChange={(e) => handleEmailChange(e.target.value)}
                             />
                             {
                                 emailException === '' ? null :
                                     <Form.Control
                                         type="text"
                                         readOnly={true}
                                         value={emailException}/>
                             }
                         </Form.Group>
                         : null}

                     <Form.Group controlId="formPassword" className="m-3">
                         <Form.Label>Password</Form.Label>
                         <div className="password-input-container">
                             <Form.Control
                                 type={showPassword ? 'text' : 'password'}
                                 placeholder="Enter your password"
                                 value={password}
                                 onChange={(e) => handlePasswordChange(e.target.value)}
                             />
                             <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} password-toggle-icon`} onClick={togglePasswordVisibility}></i>
                         </div>
                         {
                             passwordException === '' ? null :
                                 <Form.Control
                                     type="text"
                                     readOnly={true}
                                     value={passwordException}/>
                         }
                     </Form.Group>

                     <Form.Group controlId="formConfirmationPassword" className="m-3">
                         <Form.Label>Repeat Password</Form.Label>
                         <Form.Control
                             type={showPassword ? 'text' : 'password'}
                             placeholder="Repeat your password"
                             value={passwordConfirmation}
                             readOnly={passwordException !== ''}
                             onChange={(e) => handlePasswordConfirmationChange(e.target.value)}
                         />
                         {
                             passwordConfirmationException === '' ? null :
                                 <Form.Control
                                     type="text"
                                     readOnly={true}
                                     value={passwordConfirmationException}/>
                         }
                     </Form.Group>

                     <Form.Group controlId="formTelegram" className="m-3">
                         <Form.Check
                             type="checkbox"
                             label="Do you want to verify your account by Telegram?"
                             onChange={toggleTelegramCheckbox}
                             className="mb-3"
                         />
                         {showTelegramInput &&
                             <Form.Control
                                 type="text"
                                 placeholder="Enter your Telegram nickname => TELEGRAM"
                                 value={telegramUsername}
                                 onChange={(e) => handleTelegramNicknameChange(e.target.value)}
                             />
                         }
                         {
                             telegramUsernameException === '' ? null :
                                 <Form.Control
                                     type="text"
                                     readOnly={true}
                                     value={telegramUsernameException}/>
                         }
                     </Form.Group>

                     <Button variant={infoValid() ? 'primary' : 'secondary'} type="button" className="m-3" onClick={() => handleSignUp()}>
                         Sign Up
                     </Button>
                     <Button variant="secondary" type="button" className="m-3" onClick={() => redirectToSignIn()}>
                         Login
                     </Button>
                 </Form>
             );
         } else if (telegramSigningUp && !emailSigningUp) {
             return (
                 <Form style={{ width: '30vw', margin: 'auto' }} className="custom-form">

                     <Form.Group controlId="formCode" className="m-3">
                         <Form.Label>Verification Code</Form.Label>
                         <Form.Control
                             type="text"
                             placeholder="Enter your code here   ..."
                             value={code}
                             onChange={(e) => handleCodeChange(e.target.value) }
                         />
                         {
                             codeException === '' ? null :
                                 <Form.Control
                                     type="text"
                                     readOnly={true}
                                     value={codeException}/>
                         }
                     </Form.Group>

                     <Button variant={codeException === '' ? 'primary' : 'secondary'} type="button" className="m-3" onClick={() => initiateVerification()}>
                         Confirm
                     </Button>
                 </Form>
             );
         } else if (!telegramSigningUp && emailSigningUp) {
             return (
                 <Form style={{ width: '30vw', margin: 'auto' }} className="custom-form">
                     <Form.Group>
                         <Form.Label>
                             Verification email was sent to {email}, check your mails and follow instructions in it
                         </Form.Label>
                     </Form.Group>
                     <Button variant="secondary" type="button" className="m-3" onClick={() => redirectToSignIn()}>
                         Login
                     </Button>
                 </Form>
             )
         }
     }
    return (
        <div>
            <header style={{ position: 'sticky', top: 0, height: '6vh', background: '#333', color: '#fff', zIndex: 1000 }}>
                <Container fluid>
                    <Row className="align-items-center justify-content-between" xs={12}>
                        <Col xs={1} className="d-flex align-items-center justify-content-center">
                            <img src={logo} alt="Logo" style={{ maxWidth: '30%', height: 'auto' }} onClick={redirectToUI}/>
                        </Col>
                        <Col xs={10} className="d-flex align-items-center justify-content-center">
                            <h1>CRM</h1>
                        </Col>
                        <Col xs={1}></Col>
                    </Row>
                </Container>
            </header>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
            {
                render()
            }
            </div>
        </div>
    );
};

export default SignUpForm;
