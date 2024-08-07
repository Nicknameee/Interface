import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Container, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { getQueryParam } from "../../../index";
import ManagerControlPanel from "./ManagerControlPanel";
import OutsideClickHandler from "../../handlers/OutsideClickHandler";
import ViewUsers from "./user/ViewUsers";
import AddUsers from "./user/AddUsers";
import NotFound from "../../components/NotFound";
import ViewOrders from "./orders/ViewOrders";
import ViewProducts from "./product/ViewProducts";
import ViewCategories from "./categories/ViewCategories.tsx";
import AddCategory from "./categories/AddCategory.tsx";
import ViewTransactions from "./transactions/ViewTransactions.tsx";
import AddTransaction from "./transactions/AddTransaction.tsx";
import ViewProfitStatistics from "./statistics/ViewProfitStatistics.tsx";
import ViewTopLeads from "./user/ViewTopLeads.tsx";
import UpdateCategory from "./categories/UpdateCategory.tsx";

const ManagerPersonalCabinet = () => {
  const location = useLocation();
  const [action, setAction] = useState("viewUser");
  const [showPanel: boolean, setShowPanel] = useState(false);

  useEffect(() => {
    const option: string = getQueryParam("option", location);

    if (!option || option === "") {
      setAction("viewUsers");
    } else {
      setAction(option);
    }
  }, []);

  const render = () => {
    switch (action) {
      case "viewUser": {
        return <ViewUsers />;
      }
      case "addUser": {
        return <AddUsers />;
      }
      case "viewOrder": {
        return <ViewOrders />;
      }
      case "viewProduct": {
        return <ViewProducts />;
      }
      case "viewCategory": {
        return <ViewCategories />;
      }
      case "addCategory": {
        return <AddCategory />;
      }
      case "updateCategory": {
        return <UpdateCategory />;
      }
      case "viewPayment": {
        return <ViewTransactions />;
      }
      case "addPayment": {
        return <AddTransaction />;
      }
      case "viewStatistic":
        return <ViewProfitStatistics />;
      case "viewTopLeads":
        return <ViewTopLeads />;
      default: {
        return <NotFound />;
      }
    }
  };

  return (
    <div className="page" style={{ background: "#cea4a4" }}>
      <OutsideClickHandler
        outsideClickCallbacks={[
          {
            callback: () => setShowPanel(false),
            containers: [document.getElementById("header"), document.getElementById("manbar")],
          },
        ]}
      >
        <Header
          showSidebar={showPanel}
          showCart={false}
          setShowCart={() => {}}
          setShowSidebar={setShowPanel}
          displaySearchBar={false}
          displayLoginButton={false}
          displaySidebarButton={true}
          displaySignUpButton={false}
          displayCartButton={false}
        />
        <Container fluid style={{ height: "fit-content", width: "100vw" }}>
          <Row style={{ height: "100%", overflow: "scroll", width: "100vw" }}>
            <ManagerControlPanel showSidebar={showPanel} />
            {render()}
          </Row>
        </Container>
        <Footer />
      </OutsideClickHandler>
    </div>
  );
};

export default ManagerPersonalCabinet;
