import {useEffect, useState} from "react";
import {getCookie} from "../index.js";
import CustomerDashboard from "./user/customer/CustomerDashboard";
import {redirectToPersonal} from "../utilities/redirect";
import NotFound from "./components/NotFound";

const UI = () => {
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    if (getCookie("userInfo")) {
      setUserInfo(JSON.parse(getCookie("userInfo")));
    } else {
      console.log("Unsigned view logic");
    }
  }, []);

  const component = () => {
    if (userInfo !== undefined && userInfo != null) {
      switch (userInfo.role) {
        case "ROLE_MANAGER":
          return redirectToPersonal();
        case "ROLE_SUPPORT":
          return <NotFound />;
        case "ROLE_VENDOR":
          return <NotFound />;
        case "ROLE_OPERATOR":
          return <NotFound />;
        case "ROLE_CUSTOMER":
          return <CustomerDashboard />;
        default:
          return <CustomerDashboard />;
      }
    } else {
      return <CustomerDashboard />;
    }
  };

  return <div className="page">{component()}</div>;
};

export default UI;
