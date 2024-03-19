import {Col, Nav} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircle} from "@fortawesome/free-solid-svg-icons";
import React, {useEffect, useState} from "react";

const ControlPanel = ({showSidebar}) => {
    const [show, setShow] = useState(false);
    const [incomingNotification, setIN] = useState(false);
    const [incomingSupportMessage, setISM] = useState(false);
    
    useEffect(() => {
        setShow(showSidebar)    
    }, [show, showSidebar]);

    return (
        <Col className="bg-gradient" style={{
            background: '#185886',
            height: '100vh',
            width: '13vw',
            position: 'fixed',
            top: '6vh',
            left: show ? 0 : '-13vw',
            zIndex: 1,
            padding: 0,
            transition: 'left 0.3s ease'
        }} id="sidebar">
            <Nav className="flex-column w-100">
                <Nav.Link className="navLink" style={{ fontSize: '30px', color: '#e2e6f1', width: '100%', textAlign: 'center' }}>
                    My Orders
                </Nav.Link>
                <Nav.Link className="navLink" style={{ fontSize: '30px', color: '#e2e6f1', width: '100%', textAlign: 'center' }}>
                    Waiting List
                </Nav.Link>
                <Nav.Link className="navLink" style={{ fontSize: '30px', color: '#e2e6f1', width: '100%', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    Notification
                    {incomingNotification && <FontAwesomeIcon icon={faCircle} color="white" className="notification-dot"/>}
                </Nav.Link>
                <Nav.Link className="navLink" style={{ fontSize: '30px', color: '#e2e6f1', width: '100%', textAlign: 'center' }}>
                    Support
                    {incomingSupportMessage && <FontAwesomeIcon icon={faCircle} color="white" className="notification-dot"/>}
                </Nav.Link>
            </Nav>
        </Col>
    );
}

export default ControlPanel;