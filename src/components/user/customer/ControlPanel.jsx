import {Col, Nav} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {redirectToOrderHistory, redirectToWaitingList} from "../../../utilities/redirect";
import {useLanguage} from "../../../contexts/language/language-context";

const ControlPanel = ({ showSidebar }) => {
  const [show, setShow] = useState(false);
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    setShow(showSidebar);
  }, [show, showSidebar]);

  return (
    <Col
      className="bg-gradient"
      style={{
        background: "#185886",
        height: "100vh",
        width: "200px",
        position: "fixed",
        left: show ? 0 : "-200px",
        zIndex: 3,
        padding: 0,
        transition: "left 0.3s ease",
      }}
      id="sidebar"
    >
      <Nav className="flex-column w-100">
        <Nav.Link
          className="navLink"
          style={{ fontSize: "30px", color: "#e2e6f1", width: "100%", textAlign: "center" }}
          onClick={() => redirectToOrderHistory()}
        >
            {
                language === 'EN' ? 'My Orders' : 'Замовлення'
            }
        </Nav.Link>
        <Nav.Link
          className="navLink"
          style={{ fontSize: "30px", color: "#e2e6f1", width: "100%", textAlign: "center" }}
          onClick={() => redirectToWaitingList()}
        >
            {
                language === 'EN' ? 'Waiting List' : 'Лист очікування'
            }
        </Nav.Link>
      </Nav>
    </Col>
  );
};

export default ControlPanel;
