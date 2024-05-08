import React, {useEffect, useState} from "react";
import * as utility from "../../../../constants/pattern";
import {Button, Col, Form, FormCheck} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAsterisk} from "@fortawesome/free-solid-svg-icons";
import {redirectToSignIn} from "../../../../utilities/redirect";
import {addUser, initiateCredentialsAvailabilityChecking} from "../../../../index";

const AddUsers = () => {
    const [username: string, setUsername] = useState('');
    const [email: string, setEmail] = useState('');
    const [password: string, setPassword] = useState('');
    const [passwordConfirmation: string, setPasswordConfirmation] = useState('');
    const [telegramUsername: string, setTelegramUsername] = useState('');
    const [role: string, setRole] = useState('');
    const [status: string, setStatus] = useState('ENABLED');

    const [usernameException, setUsernameException] = useState('');
    const [emailException, setEmailException] = useState('');
    const [passwordException, setPasswordException] = useState('');
    const [passwordConfirmationException, setPasswordConfirmationException] = useState('');
    const [telegramUsernameException, setTelegramUsernameException] = useState('');
    const [roleException, setRoleException] = useState('');
    const [statusException, setStatusException] = useState('');

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
    }

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
    }

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

        if (value === passwordConfirmation) {
            setPasswordConfirmationException('')
        }
    }

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
            setRoleException('')
            return
        }

        if (!utility.TELEGRAM_USERNAME_PATTERN.test(value) && value) {
            setRoleException('Invalid telegram username, must be in format @Username 5 list of username at least')
        } else {
            setRoleException('')
        }
    }

    const infoValid = () => {
        return usernameException === ''
            && passwordException === ''
            && passwordConfirmationException === ''
            && emailException === ''
            && roleException === ''
            && username !== ''
            && password !== ''
            && passwordConfirmation === password
            && (email !== '' || telegramUsername !== '');
    }

    const addUserHook = async () => {
        if (await initiateCredentialsAvailabilityCheckingHook() && infoValid()) {
            const success: boolean = await addUser({
                username: username,
                email: email,
                telegramUsername: telegramUsername,
                role: role,
                status: status,
                password: password
            });

            if (success) {
                setTimeout(() => window.location.reload(), 3000);
            }
        }
    }

    const initiateCredentialsAvailabilityCheckingHook = async () => {
        return await initiateCredentialsAvailabilityChecking(username, email, telegramUsername, setUsernameException, setEmailException, setTelegramUsernameException)
    };

    useEffect(() => {

    }, []);

    return (
        <Col>
            <Form className="custom-form py-3 my-1">
                <Form.Group controlId="formUsername" className="m-3">
                    <Form.Label>Username</Form.Label>
                    <div className="input-container">
                        <Form.Control
                            type="text"
                            placeholder="Enter your username"
                            style={{paddingLeft: '30px'}}
                            value={username}
                            onChange={(e) => handleUsernameChange(e.target.value) } />
                        <FontAwesomeIcon icon={faAsterisk} className="required-field" title='This field is required'/>
                    </div>
                    <p style={{wordBreak: 'break-word', marginTop: '1em', color: 'white', fontSize: '1.1em'}} hidden={usernameException === ''}>{usernameException}</p>
                </Form.Group>
                <Form.Group controlId="formEmail" className="m-3">
                    <Form.Label>Email</Form.Label>
                    <div className="input-container">
                        <Form.Control
                            type="text"
                            placeholder="Enter your email"
                            style={{paddingLeft: '30px'}}
                            value={email}
                            onChange={(e) => handleEmailChange(e.target.value)} />
                        <FontAwesomeIcon icon={faAsterisk} className="required-field" title='This field is required if telegram is not specified'/>
                    </div>
                    <p style={{wordBreak: 'break-word', marginTop: '1em', color: 'white', fontSize: '1.1em'}} hidden={emailException === ''}>{emailException}</p>
                </Form.Group>

                <Form.Group controlId="formPassword" className="m-3">
                    <Form.Label>Password</Form.Label>
                    <div className="input-container">
                        <Form.Control
                            type={'text'}
                            placeholder="Enter user's password"
                            style={{paddingLeft: '30px'}}
                            value={password}
                            onChange={(e) => handlePasswordChange(e.target.value)} />
                        <FontAwesomeIcon icon={faAsterisk} className="required-field" title='This field is required'/>
                    </div>
                    <p style={{wordBreak: 'break-word', marginTop: '1em', color: 'white', fontSize: '1.1em'}} hidden={passwordException === ''}>{passwordException}</p>
                </Form.Group>

                <Form.Group controlId="formConfirmationPassword" className="m-3">
                    <Form.Label>Repeat Password</Form.Label>
                    <div className="input-container">
                        <Form.Control
                            type={'text'}
                            placeholder="Repeat user's password"
                            style={{paddingLeft: '30px'}}
                            value={passwordConfirmation}
                            readOnly={passwordException !== ''}
                            onChange={(e) => handlePasswordConfirmationChange(e.target.value)} />
                        <FontAwesomeIcon icon={faAsterisk} className="required-field" title='This field is required'/>
                    </div>
                    <p style={{wordBreak: 'break-word', marginTop: '1em', color: 'white', fontSize: '1.1em'}} hidden={passwordConfirmationException === ''}>{passwordConfirmationException}</p>
                </Form.Group>

                <Form.Group controlId="formTelegram" className="m-3">
                    <div className="input-container">
                        <Form.Label>Telegram</Form.Label>
                        <div className="input-container">
                            <Form.Control
                                type="text"
                                placeholder="Enter user's telegram username"
                                style={{paddingLeft: '30px'}}
                                value={telegramUsername}
                                onChange={(e) => handleTelegramNicknameChange(e.target.value)} />
                            <FontAwesomeIcon icon={faAsterisk} className="required-field" title='This field is required if email is not specified' />
                        </div>
                    </div>
                    <p style={{wordBreak: 'break-word', marginTop: '1em', color: 'white', fontSize: '1.1em'}} hidden={telegramUsernameException === ''}>{telegramUsernameException}</p>
                </Form.Group>

                <Form.Group controlId="formTelegram" className="m-3">
                    <div className="input-container">
                        <Form.Label>Status</Form.Label>
                        <div className="input-container">
                            <FormCheck className="w-100"
                                       key={crypto.randomUUID()}
                                       id={'ENABLED'}
                                       label={'ENABLED'}
                                       value={'ENABLED'}
                                       checked={status === 'ENABLED'}
                                       onChange={() => setStatus('ENABLED')}/>
                            <FormCheck className="w-100"
                                       key={crypto.randomUUID()}
                                       id={'DISABLED'}
                                       label={'DISABLED'}
                                       value={'DISABLED'}
                                       checked={status === 'DISABLED'}
                                       onChange={() => setStatus('DISABLED')}/>
                        </div>
                    </div>
                    <p style={{wordBreak: 'break-word', marginTop: '1em', color: 'white', fontSize: '1.1em'}} hidden={statusException === ''}>{statusException}</p>
                </Form.Group>

                <Form.Group controlId="formTelegram" className="m-3">
                    <div className="input-container">
                        <Form.Label>Role</Form.Label>
                        <div className="input-container">
                            {/*<FormCheck className="w-100"*/}
                            {/*           key={crypto.randomUUID()}*/}
                            {/*           id={'Operator'}*/}
                            {/*           label={'Operator'}*/}
                            {/*           value={'Operator'}*/}
                            {/*           checked={role === 'ROLE_OPERATOR'}*/}
                            {/*           onChange={() => setRole('ROLE_OPERATOR')}/>*/}
                            <FormCheck className="w-100"
                                       key={crypto.randomUUID()}
                                       id={'Manager'}
                                       label={'Manager'}
                                       value={'Manager'}
                                       checked={role === 'ROLE_MANAGER'}
                                       onChange={() => setRole('ROLE_MANAGER')}/>
                        </div>
                    </div>
                    <p style={{wordBreak: 'break-word', marginTop: '1em', color: 'white', fontSize: '1.1em'}} hidden={roleException === ''}>{roleException}</p>
                </Form.Group>

                <Button variant={infoValid() ? 'primary' : 'secondary'} type="button" className="m-3" disabled={!infoValid()} onClick={() => addUserHook()}>
                    Add User
                </Button>
            </Form>
        </Col>
    )
}

export default AddUsers;