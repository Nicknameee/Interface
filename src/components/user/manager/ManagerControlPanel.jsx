import { Col, Nav } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import {
  redirectToAddingCategory,
  redirectToAddingProduct,
  redirectToAddPayment,
  redirectToAddingUser,
  redirectToViewCategory,
  redirectToViewingOrders,
  redirectToViewingUsers,
  redirectToViewPayments,
  redirectToViewProducts,
  redirectToViewStatistic,
} from "../../../utilities/redirect";

const ManagerControlPanel = ({ showSidebar }) => {
  const [show: boolean, setShow] = useState(false);

  useEffect(() => {
    setShow(showSidebar);
  }, [show, showSidebar]);

  return (
    <Col
      className="bg-gradient"
      style={{
        background: "#185886",
        height: "100vh",
        width: "13vw",
        position: "fixed",
        top: "6vh",
        left: show ? 0 : "-13vw",
        zIndex: 3,
        padding: 0,
        transition: "left 0.3s ease",
      }}
      id="manbar"
    >
      <Nav className="flex-column w-100">
        <Nav.Link
          className="navLink"
          style={{ fontSize: "30px", color: "#e2e6f1", width: "100%", textAlign: "center" }}
          onClick={() => redirectToViewingUsers()}
        >
          View Users
        </Nav.Link>
        <Nav.Link
          className="navLink"
          style={{ fontSize: "30px", color: "#e2e6f1", width: "100%", textAlign: "center" }}
          onClick={() => redirectToAddingUser()}
        >
          Add User
        </Nav.Link>
        <Nav.Link
          className="navLink"
          style={{ fontSize: "30px", color: "#e2e6f1", width: "100%", textAlign: "center" }}
          onClick={() => redirectToViewingOrders()}
        >
          View Orders
        </Nav.Link>
        <Nav.Link
          className="navLink"
          style={{ fontSize: "30px", color: "#e2e6f1", width: "100%", textAlign: "center" }}
          onClick={() => redirectToViewProducts()}
        >
          View Products
        </Nav.Link>
        {/*<Nav.Link className="navLink" style={{ fontSize: '30px', color: '#e2e6f1', width: '100%', textAlign: 'center' }} onClick={() => redirectToAddingProduct()}>*/}
        {/*    Add Product*/}
        {/*</Nav.Link>*/}
        <Nav.Link
          className="navLink"
          style={{ fontSize: "30px", color: "#e2e6f1", width: "100%", textAlign: "center" }}
          onClick={() => redirectToViewCategory()}
        >
          View Categories
        </Nav.Link>
        <Nav.Link
          className="navLink"
          style={{ fontSize: "30px", color: "#e2e6f1", width: "100%", textAlign: "center" }}
          onClick={() => redirectToAddingCategory()}
        >
          Add Category
        </Nav.Link>
        <Nav.Link
          className="navLink"
          style={{ fontSize: "30px", color: "#e2e6f1", width: "100%", textAlign: "center" }}
          onClick={() => redirectToViewPayments()}
        >
          View Payments
        </Nav.Link>
        <Nav.Link
          className="navLink"
          style={{ fontSize: "30px", color: "#e2e6f1", width: "100%", textAlign: "center" }}
          onClick={() => redirectToAddPayment()}
        >
          Add Payment
        </Nav.Link>
        <Nav.Link
          className="navLink"
          style={{ fontSize: "30px", color: "#e2e6f1", width: "100%", textAlign: "center" }}
          onClick={() => redirectToViewStatistic()}
        >
          View Statistic
        </Nav.Link>
        <Nav.Link
          className="navLink"
          style={{ fontSize: "30px", color: "#e2e6f1", width: "100%", textAlign: "center" }}
          onClick={() => (window.location.href = "/manager/personal?option=viewTopLeads")}
        >
          Top Leads
        </Nav.Link>
      </Nav>
    </Col>
  );
};

export default ManagerControlPanel;
