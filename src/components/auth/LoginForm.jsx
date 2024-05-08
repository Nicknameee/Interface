import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { isLoggedIn, signIn } from "../../index.js";
import * as utility from "../../constants/pattern.js";
import {
  redirectToPasswordChangeRoute,
  redirectToPreviousLoginUrl,
  redirectToSignUp,
  redirectToUI
} from "../../utilities/redirect";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import {useLanguage} from "../../contexts/language/language-context";

const LoginForm = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loginException, setLoginException] = useState("");
  const [passwordException, setPasswordException] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      if (language === "EN") {
        setLoginException("Invalid login, can not be used as email or telegram username or system username");
      } else {
        setLoginException("Авторизаційний логін некоректий")
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
      if (language === 'EN') {
        setPasswordException("Password can contain only [a-zA-Z0-9@] and be in length range from 8 to 33");
      } else {
        setPasswordException("Авторизаційний пароль некоректний, може містити лише [a-zA-Z0-9@] і бути довжиною від 8 до 33")
      }
    } else {
      setPasswordException("");
    }
  };

  const handleSignIn = () => {
    if (login && password) {
      signIn(login, password).then((isSuccessful) => {
        if (isSuccessful) {
          console.log("LoginForm: redirect to previous page");
          redirectToPreviousLoginUrl();
        }
      });
    } else {
      if (!login) {
        if (language === "EN") {
          setLoginException("Invalid login");
        } else {
          setLoginException("Логін некоректний")
        }
      }
      if (!password) {
        if (language === "EN") {
          setPasswordException("Invalid password");
        } else {
          setPasswordException("Ваш пароль некоректний")
        }
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (isLoggedIn()) {
      redirectToUI();
    }
  }, []);
  return (
    <div className="tone">
      <Header />
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
                language === "EN" ? 'Login' : 'Логін'
              }
            </Form.Label>
            <Form.Control
              type="text"
              placeholder={language === "EN" ? "Enter your login" : "Заповніть логін"}
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
          <Button variant="primary" type="button" className="m-3" onClick={() => redirectToPasswordChangeRoute()}>
            {
              language === 'EN' ? 'Forgot password?' : 'Забули пароль?'
            }
          </Button>
          <Button variant="primary" type="button" className="m-3" onClick={() => handleSignIn()}>
            {
              language === 'EN' ? 'Login' : 'Логін'
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

export default LoginForm;
