import {useEffect, useState} from "react";
import {Button, Form} from "react-bootstrap";
import {isLoggedIn, updatePassword} from "../../index.js";
import * as utility from "../../constants/pattern.js";
import {redirectToSignIn, redirectToSignUp, redirectToUI} from "../../utilities/redirect";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faEyeSlash} from "@fortawesome/free-solid-svg-icons";
import {notifySuccess} from "../../utilities/notify"
import {useLanguage} from "../../contexts/language/language-context";

const PasswordChange = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loginException, setLoginException] = useState("");
  const [passwordException, setPasswordException] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [code, setCode] = useState('');
  const [codeException, setCodeException] = useState('');
  const [codeRequested, setCodeRequested] = useState(false);
  const { language, setLanguage } = useLanguage();

  const handleLoginChange = (value) => {
    setLogin(value);
    if (value === "") {
      setLoginException("");
      return;
    }

    if (
      !utility.TELEGRAM_USERNAME_PATTERN.test(value) &&
      !utility.EMAIL_PATTERN.test(value) &&
      !utility.USERNAME_PATTERN.test(value) &&
      value
    ) {
      if (language === 'EN' ) {
        setLoginException("Invalid login, can not be used as email or telegram username or system username");
      } else {
        setLoginException("Невалідний логін, не може бути поштовою адресою, телеграм або системним юзернеймом");
      }
    } else {
      setLoginException("");
    }
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    if (value === "") {
      setPasswordException("");
      return;
    }

    if (!utility.USER_PASSWORD_PATTERN.test(value) && value) {
      if ( language === 'EN' ) {
        setPasswordException("Password can contain only [a-zA-Z0-9@] and be in length range from 8 to 33");
      } else {
        setPasswordException("Авторизаційний пароль некоректний, може містити лише [a-zA-Z0-9@] і бути довжиною від 8 до 33")
      }
    } else {
      setPasswordException("");
    }
  };

  const handleCodeChange = (value) => {
    setCode(value);
    if (value === "") {
      setCodeException("");
      return;
    }

    if (!value || value === '') {
      if ( language === 'EN' ) {
        setCodeException("Invalid confirmation code");
      } else {
        setCodeException('Невалідний код підтвердження');
      }
    } else {
      setCodeException("");
    }
  };

  const requestCode = () => {
    updatePassword({
      login: login,
      password: null,
      code: null
    })
        .then(result => {
          if (result) {
            if ( language === 'EN' ) {
              notifySuccess('Code requested, wait...')
            } else {
              notifySuccess('Код очікується...')
            }
            setCodeRequested(true)
          }
        })
  };

  const confirmChange = () => {
    updatePassword({
      login: login,
      password: password,
      code: code
    })
        .then(result => {
          if (result) {
            if ( language === 'EN' ) {
              notifySuccess('Password updated successfully...')
            } else {
              notifySuccess('Ваш пароль Успішно оновлено ...')
            }
            setTimeout(() => redirectToSignIn(), 3000);
          }
        })
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (isLoggedIn()) {
      redirectToUI();
    }
  }, []);

  // @ts-ignore
  return (
    <div className="tone">
      <Header setShowSidebar={undefined} showSidebar={undefined} setShowCart={undefined} showCart={undefined} displaySearchBar={undefined} displayLoginButton={undefined} displaySignUpButton={undefined} displayCartButton={undefined} displaySidebarButton={undefined} />
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "84vh" }}>
        <Form
          style={{ width: "30vw", margin: "auto", fontFamily: "monospace", minHeight: "55vh", height: "auto" }}
          className="custom-form"
        >
          <Form.Group controlId="formLogin" className="m-3">
            <h1>
              {
                language === "EN" ? 'CRM Assistant System' : 'CRM Асистент Система'
              }
            </h1>
            <h3>
              {
                language === "EN" ? 'Welcome!' : 'Ласкаво просимо!'
              }
            </h3>
            <Form.Label style={{ fontSize: "1.3em" }}>
              {
                language === 'EN' ? 'Update password' : 'Оновити пароль'
              }
            </Form.Label>
            <Form.Control
              readOnly={codeRequested}
              type="text"
              placeholder={ language === 'EN' ? "Enter your login(email, telegram or username)" : 'Будь ласка введіть ваш логін(пошта, telegram , юзернейм)'}
              value={login}
              onChange={(e) => handleLoginChange(e.target.value)}
              style={{ fontSize: "1.1em" }}
            />
            <p
              style={{ wordBreak: "break-word", marginTop: "1em", color: "white", fontSize: "1.1em" }}
              hidden={loginException === ""}
            >
              {loginException}
            </p>
          </Form.Group>
          {
            codeRequested &&
              <Form.Group controlId="formPassword" className="m-3">
                <Form.Label style={{ fontSize: "1.3em" }}>
                  {
                    language === 'EN' ? 'Password' : 'Пароль'
                  }
                </Form.Label>
                <div className="input-container">
                  <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder={language === 'EN' ? "Enter your password" : "Заповніть пароль"}
                      value={password}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      style={{ fontSize: "1.1em", position: "relative" }}
                  />
                  <FontAwesomeIcon
                      icon={showPassword ? faEyeSlash : faEye}
                      className="password-toggle-icon"
                      onClick={togglePasswordVisibility}
                  />
                </div>
                <p
                    style={{ wordBreak: "break-word", marginTop: "1em", color: "white", fontSize: "1.1em" }}
                    hidden={passwordException === ""}
                >
                  {passwordException}
                </p>
              </Form.Group>
          }
          {
              codeRequested &&
              <Form.Group controlId="formCode" className="m-3">
                <Form.Label style={{ fontSize: "1.3em" }}>
                  {
                        language === 'EN' ? 'Code' : 'Код'
                  }
                </Form.Label>
                <div className="input-container">
                  <Form.Control
                      type={"text"}
                      placeholder={language === 'EN' ? "Enter your code here..." : 'Введіть ваш код...'}
                      value={code}
                      onChange={(e) => handleCodeChange(e.target.value)}
                      style={{ fontSize: "1.1em", position: "relative" }}
                  />
                </div>
                <p
                    style={{ wordBreak: "break-word", marginTop: "1em", color: "white", fontSize: "1.1em" }}
                    hidden={codeException === ""}
                >
                  {codeException}
                </p>
              </Form.Group>

          }
          {
            codeRequested &&
            <Button variant="primary" type="button" className="m-3" onClick={() => confirmChange()}>
              { language === 'EN' ? 'Confirm Change\'' : 'Змінити'}
            </Button>
          }
          {
              !codeRequested &&
              <Button variant="primary" type="button" className="m-3" onClick={() => requestCode()}>
                { language === 'EN' ? 'Request Code' : 'Отримати код'}
              </Button>
          }
          <Button variant="secondary" className="m-3" onClick={() => redirectToSignIn()}>
            {
              language === 'EN' ? 'Switch To Sign In' : 'Логін'
            }
          </Button>
          <Button variant="secondary" className="m-3" onClick={() => redirectToSignUp()}>
            {
              language === 'EN' ? 'Switch To Sign Up' : 'Сторінка реєстрації'
            }
          </Button>
        </Form>
      </div>
      <Footer />
    </div>
  );
};

export default PasswordChange;
