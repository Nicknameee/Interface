import React from 'react';
import {Col, Container, Row} from "react-bootstrap";
import logo from "../../resources/logo.png";
import {redirectToUI} from "../../utilities/redirect";
import Footer from "./Footer";

const NotFound = () => {
    return (
        <div className="tone w-100 h-100">
            {/*<header style={{borderBottom: '1px solid', borderColor: '#473850', position: 'sticky', top: 0, height: '6vh', background: '#3c0d70', color: '#fff', zIndex: 1000 }}>*/}
            {/*    <Container fluid className="h-100">*/}
            {/*        <Row className="align-items-center justify-content-between h-100" xs={12}>*/}
            {/*            <Col xs={1} className="d-flex align-items-center justify-content-center h-100">*/}
            {/*                <img src={logo} alt="Logo" className="logo" onClick={redirectToUI}/>*/}
            {/*            </Col>*/}
            {/*            <Col xs={10} className="d-flex align-items-center justify-content-center">*/}
            {/*                <h1 className="font-monospace">CRM - Unknown page response</h1>*/}
            {/*            </Col>*/}
            {/*            <Col xs={1} className="d-flex align-items-center justify-content-around">*/}
            {/*            </Col>*/}
            {/*        </Row>*/}
            {/*    </Container>*/}
            {/*</header>*/}
            <div className="d-flex flex-column w-100 justify-content-center text-center font-monospace align-items-center" style={{fontSize: '1.5em', height: '84vh'}}>
                <h2>404 Not Found</h2>
                <p>Sorry, the page you are looking for does not exist.</p>
                <a className="text-white link-with-borders" style={{cursor: 'pointer'}}  onClick={redirectToUI}>Go to Homepage</a>
            </div>
            <Footer />
        </div>
    );
}

export default NotFound;