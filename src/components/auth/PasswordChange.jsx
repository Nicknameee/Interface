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

const PasswordChange = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loginException, setLoginException] = useState("");
  const [passwordException, setPasswordException] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [code, setCode] = useState('');
  const [codeException, setCodeException] = useState('');
  const [codeRequested, setCodeRequested] = useState(false);

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
      setLoginException("Invalid login, can not be used as email or telegram username or system username");
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
      setPasswordException("Password can contain only [a-zA-Z0-9@] and be in length range from 8 to 33");
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
      setCodeException("Invaqlid ocnfirmation code");
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
            notifySuccess('Code requested, wait...')
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
            notifySuccess('Password updated successfully...')
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
            <h1>CRM Assistant System</h1>
            <h3>Welcome!</h3>
            <Form.Label style={{ fontSize: "1.3em" }}>Login</Form.Label>
            <Form.Control
              readOnly={codeRequested}
              type="text"
              placeholder="Enter your login(email, telegram or username)"
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
                <Form.Label style={{ fontSize: "1.3em" }}>Password</Form.Label>
                <div className="input-container">
                  <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
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
                <Form.Label style={{ fontSize: "1.3em" }}>Code</Form.Label>
                <div className="input-container">
                  <Form.Control
                      type={"text"}
                      placeholder="Enter your code"
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
              Confirm Change
            </Button>
          }
          {
              !codeRequested &&
              <Button variant="primary" type="button" className="m-3" onClick={() => requestCode()}>
                Request Code
              </Button>
          }
          <Button variant="secondary" className="m-3" onClick={() => redirectToSignIn()}>
            Switch To Sign In
          </Button>
          <Button variant="secondary" className="m-3" onClick={() => redirectToSignUp()}>
            Switch To Sign Up
          </Button>
        </Form>
      </div>
      <Footer />
    </div>
  );
};

export default PasswordChange;
