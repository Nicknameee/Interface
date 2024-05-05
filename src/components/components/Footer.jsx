import { Col, Container, Row } from "react-bootstrap";
import React from "react";

/**
 *
 * @param footerData - must contain links and e-mail for setting into footer links prompts
 * @returns {Element} - footer page
 * @constructor - consumes footer data
 */
const Footer = ({ footerData }) => {
  return (
    <div style={{ height: "12vh" }}>
      <footer
        className="bg-dark text-light p-3"
        style={{ position: "fixed", bottom: 0, zIndex: 1000, height: "10vh", width: "100vw" }}
      >
        <Container fluid className="w-100">
          <Row className="d-flex flex-column justify-content-center align-items-center w-100" xs={12}>
            <Col md={6} className="text-center">
              <ul className="list-unstyled d-flex text-white w-100 justify-content-center">
                <li className="mx-2">
                  <a href="#" className="link-with-border text-white">
                    Privacy Policy
                  </a>
                </li>
                <li className="mx-2">
                  <a href="#" className="link-with-border text-white">
                    Terms of Service
                  </a>
                </li>
                <li className="mx-2">
                  <a href="mailto:mail@gmail.com" className="link-with-border text-white">
                    Contact Us
                  </a>
                </li>
              </ul>
            </Col>
            <Col md={6}>
              <p className="w-100 text-center">
                &copy; {new Date().getFullYear()} Your CRM Assistant. All rights reserved.
              </p>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};

export default Footer;
