import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { isLoggedIn, signIn } from "../../index.js";
import * as utility from "../../constants/pattern.js";
import { redirectToPreviousLoginUrl, redirectToSignUp, redirectToUI } from "../../utilities/redirect";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const LoginForm = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loginException, setLoginException] = useState("");
  const [passwordException, setPasswordException] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
        setLoginException("Invalid login");
      }
      if (!password) {
        setPasswordException("Invalid password");
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
            <h1>CRM Assistant System</h1>
            <h3>Welcome!</h3>
            <Form.Label style={{ fontSize: "1.3em" }}>Login</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your login"
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
          <Button variant="primary" type="button" className="m-3" onClick={() => handleSignIn()}>
            Login
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

export default LoginForm;
