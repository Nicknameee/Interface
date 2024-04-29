import React from 'react';
import {Col, Container, Row} from "react-bootstrap";
import logo from "../../resources/logo.png";
import {redirectToSignIn, redirectToUI} from "../../utilities/redirect";

const Unauthorized = () => {
    return (
        <div className="tone w-100 h-100">
            <header style={{borderBottom: '1px solid', borderColor: '#473850', position: 'sticky', top: 0, height: '6vh', background: '#3c0d70', color: '#fff', zIndex: 1000 }}>
                <Container fluid className="h-100">
                    <Row className="align-items-center justify-content-between h-100" xs={12}>
                        <Col xs={1} className="d-flex align-items-center justify-content-center h-100">
                            <img src={logo} alt="Logo" className="logo" onClick={redirectToUI}/>
                        </Col>
                        <Col xs={10} className="d-flex align-items-center justify-content-center">
                            <h1 className="font-monospace">CRM - Unauthorized view response</h1>
                        </Col>
                        <Col xs={1} className="d-flex align-items-center justify-content-around">
                        </Col>
                    </Row>
                </Container>
            </header>
            <div className="d-flex flex-column w-100 justify-content-center text-center font-monospace align-items-center" style={{fontSize: '1.5em', height: '84vh'}}>
                <h2>401 Unauthorized</h2>
                <p>Sorry, the page you are looking for does not available for you.</p>
                <a className="text-white link-with-borders my-1" style={{cursor: 'pointer'}} onClick={redirectToSignIn}>Sign In</a>
                <a className="text-white link-with-borders" style={{cursor: 'pointer'}}  onClick={redirectToUI}>Go to Homepage</a>
            </div>
            <footer className="bg-dark text-light p-3" style={{position: 'fixed', bottom: 0, zIndex: 1000, height: '10vh', width: '100vw'}}>
                <Container fluid className="w-100">
                    <Row className="d-flex flex-column justify-content-center align-items-center w-100" xs={12}>
                        <Col md={6} className="text-center">
                            <ul className="list-unstyled d-flex text-white w-100 justify-content-center">
                                <li className="mx-2">
                                    <a href="#" className="link-with-border text-white">Privacy Policy</a>
                                </li>
                                <li className="mx-2">
                                    <a href="#" className="link-with-border text-white">Terms of Service</a>
                                </li>
                                <li className="mx-2">
                                    <a href="mailto:mail@gmail.com" className="link-with-border text-white">Contact Us</a>
                                </li>
                            </ul>
                        </Col>
                        <Col md={6}>
                            <p className="w-100 text-center">&copy; {new Date().getFullYear()} Your CRM Assistant. All rights reserved.</p>
                        </Col>
                    </Row>
                </Container>
            </footer>
        </div>
    );
}

export default Unauthorized;