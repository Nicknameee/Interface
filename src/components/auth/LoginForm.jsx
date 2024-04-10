import {useState} from 'react';
import {Button, Col, Container, Form, Row} from 'react-bootstrap';
import {signIn} from '../../index.js'
import * as utility from '../../constants/pattern.js'
import {redirectToPreviousLoginUrl, redirectToSignUp, redirectToUI} from "../../utilities/redirect";
import logo from "../../resources/logo.png";

const LoginForm = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [loginException, setLoginException] = useState('');
    const [passwordException, setPasswordException] = useState('');
    const [showPassword, setShowPassword] = useState(false);


    const handleLoginChange = (value) => {
        setLogin(value)
        if (value === '') {
            setLoginException ('')
            return
        }

        if ((!utility.TELEGRAM_USERNAME_PATTERN.test(value) && !utility.EMAIL_PATTERN.test(value)) && value) {
            setLoginException ('Invalid login')
        } else {
            setLoginException ('')
        }
    };

    const handlePasswordChange = (value) => {
        setPassword(value)
        if (value === '') {
            setPasswordException ('')
            return
        }

        if (!utility.USER_PASSWORD_PATTERN.test(value) && value) {
            setPasswordException ('Invalid password')
        } else {
            setPasswordException ('')
        }
    };

    const handleSignIn = () => {
        if (login && password) {
            signIn(login, password)
                .then(() => {
                    console.log('Sign in invocation is done');
                    redirectToPreviousLoginUrl()
                })
        } else {
            if (!login) {
                setLoginException('Invalid login')
            }
            if (!password) {
                setPasswordException('Invalid password')
            }
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    return (
        <div>
        <header style={{ position: 'sticky', top: 0, height: '6vh', background: '#333', color: '#fff', zIndex: 1000 }}>
            <Container fluid>
                <Row className="align-items-center justify-content-between">
                    <Col xs={1} className="d-flex align-items-center justify-content-center">
                        <img src={logo} alt="Logo" style={{ maxWidth: '30%', height: 'auto' }} onClick={redirectToUI}/>
                    </Col>
                    <Col xs={10} className="d-flex align-items-center justify-content-center">
                        <h1>CRM</h1>
                    </Col>
                    <Col xs={1} className="d-flex align-items-center justify-content-center">
                    </Col>
                </Row>
            </Container>
        </header>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
            <Form style={{ width: '30vw', margin: 'auto' }} className="custom-form">
                <Form.Group controlId="formLogin" className="m-3">
                    <Form.Label>Login</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter your login"
                        value={login}
                        onChange={(e) => {
                            handleLoginChange(e.target.value)
                        }
                    }
                    />
                    {
                        loginException === '' ? null :
                            <Form.Control
                                type="text"
                                readOnly={true}
                                value={loginException}/>
                    }
                </Form.Group>

                <Form.Group controlId="formPassword" className="m-3">
                    <Form.Label>Password</Form.Label>
                    <div className="password-input-container">
                        <Form.Control
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => {
                                handlePasswordChange(e.target.value)
                            }}
                        />
                        <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} password-toggle-icon`} onClick={togglePasswordVisibility}></i>
                        {
                            passwordException === '' ? null :
                                <Form.Control
                                    type="text"
                                    readOnly={true}
                                    value={passwordException}/>
                        }
                    </div>
                </Form.Group>
                <Button variant="primary" type="button" className="m-3" onClick={() => handleSignIn()}>
                    Login
                </Button>
                <Button variant="secondary" className="m-3" onClick={() => redirectToSignUp()}>
                    Sign Up
                </Button>
            </Form>
        </div>
        </div>
    );
};

export default LoginForm;
