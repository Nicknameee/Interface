import {Col, Container, Nav, Row} from "react-bootstrap";

const Operator = ({userInfo}) => {
    return (
        <div className="h-100">
            <Container fluid>
                <Row>
                    {/* Sidebar */}
                    <Col sm={3} className="bg-light sidebar">
                        <Nav className="flex-column">
                            <Nav.Link href="#orders">Orders</Nav.Link>
                            <Nav.Link href="#account">Account</Nav.Link>
                            {/* Add more menu items as needed */}
                        </Nav>
                    </Col>

                    {/* Content Area */}
                    <Col sm={9} className="main-content">
                        {/* Display content based on selected menu item */}
                        {/* You can use React Router to handle different views */}
                        {/* For simplicity, I'm using placeholder text */}
                        <div id="orders">Orders Content</div>
                        <div id="account">Account Content</div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Operator;