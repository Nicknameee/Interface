import {Col, Nav} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {
  redirectToAddingCategory,
  redirectToAddingUser,
  redirectToAddPayment,
  redirectToViewCategory,
  redirectToViewingOrders,
  redirectToViewingUsers,
  redirectToViewPayments,
  redirectToViewProducts,
  redirectToViewStatistic,
} from "../../../utilities/redirect";
import {useLanguage} from "../../../contexts/language/language-context";

const ManagerControlPanel = ({ showSidebar }) => {
  const [show: boolean, setShow] = useState(false);
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
        width: "20vw",
        position: "fixed",
        top: "6vh",
        left: show ? 0 : "-20vw",
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
          {
            language === 'EN' ? 'View Users' : 'Список користувачів'
          }
        </Nav.Link>
        <Nav.Link
          className="navLink"
          style={{ fontSize: "30px", color: "#e2e6f1", width: "100%", textAlign: "center" }}
          onClick={() => redirectToAddingUser()}
        >
          {
            language === 'EN' ? 'Add User' : 'Додати користувача'
          }
        </Nav.Link>
        <Nav.Link
          className="navLink"
          style={{ fontSize: "30px", color: "#e2e6f1", width: "100%", textAlign: "center" }}
          onClick={() => redirectToViewingOrders()}
        >
          {
            language === 'EN' ? 'View Orders' : 'Список замовлень'
          }
        </Nav.Link>
        <Nav.Link
          className="navLink"
          style={{ fontSize: "30px", color: "#e2e6f1", width: "100%", textAlign: "center" }}
          onClick={() => redirectToViewProducts()}
        >
          {
            language === 'EN' ? 'View Products' : 'Список продуктів'
          }
        </Nav.Link>
        <Nav.Link
          className="navLink"
          style={{ fontSize: "30px", color: "#e2e6f1", width: "100%", textAlign: "center" }}
          onClick={() => redirectToViewCategory()}
        >
          {
            language === 'EN' ? 'View Categories' : 'Список категорій'
          }
        </Nav.Link>
        <Nav.Link
          className="navLink"
          style={{ fontSize: "30px", color: "#e2e6f1", width: "100%", textAlign: "center" }}
          onClick={() => redirectToAddingCategory()}
        >
          {
            language === 'EN' ? 'Add Category' : 'Додати категорію'
          }
        </Nav.Link>
        <Nav.Link
          className="navLink"
          style={{ fontSize: "30px", color: "#e2e6f1", width: "100%", textAlign: "center" }}
          onClick={() => redirectToViewPayments()}
        >
          {
            language === 'EN' ? 'View Payments' : 'Список транзакцій'
          }
        </Nav.Link>
        <Nav.Link
          className="navLink"
          style={{ fontSize: "30px", color: "#e2e6f1", width: "100%", textAlign: "center" }}
          onClick={() => redirectToAddPayment()}
        >
          {
            language === 'EN' ? 'Add Payment' : 'Зареєструвати транзакцію'
          }
        </Nav.Link>
        <Nav.Link
          className="navLink"
          style={{ fontSize: "30px", color: "#e2e6f1", width: "100%", textAlign: "center" }}
          onClick={() => redirectToViewStatistic()}
        >
          {
            language === 'EN' ? 'View Profit Statistic' : 'Статистика виручки'
          }
        </Nav.Link>
        <Nav.Link
          className="navLink"
          style={{ fontSize: "30px", color: "#e2e6f1", width: "100%", textAlign: "center" }}
          onClick={() => (window.location.href = "/manager/personal?option=viewTopLeads")}
        >
          {
            language === 'EN' ? 'Top Leads' : 'Список прибуткових користувачів'
          }
        </Nav.Link>
      </Nav>
    </Col>
  );
};

export default ManagerControlPanel;
