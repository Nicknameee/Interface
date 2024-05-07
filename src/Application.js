import "./styles/App.css";
import LoginForm from "./components/auth/LoginForm";
import UI from "./components/UI";
import SignUpForm from "./components/auth/SignUpForm";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NotFound from "./components/components/NotFound";
import ProductComponent from "./components/user/customer/ProductComponent";
import CheckoutOrder from "./components/user/customer/CheckoutOrder";
import CustomerPersonalCabinet from "./components/user/customer/CustomerPersonalCabinet";
import { isCustomerLoggedIn, isLoggedIn, isManagerLoggedIn } from "./index";
import Unauthorized from "./components/components/Unauthorized";
import ManagerPersonalCabinet from "./components/user/manager/ManagerPersonalCabinet";
import EditProductWrapper from "./components/user/manager/product/EditProductWrapper";
import AddProduct from "./components/user/manager/product/AddProduct";
import { LanguageProvider } from "./contexts/language/language-context";

function Application() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route exact path="/home" element={<UI />} />
          <Route exact path="/" element={<UI />} />
          <Route exact path="/sign/up" element={isLoggedIn() ? <UI /> : <SignUpForm />} />
          <Route exact path="/sign/in" element={isLoggedIn() ? <UI /> : <LoginForm />} />
          <Route exact path="/product" element={<ProductComponent />} />
          <Route exact path="/purchase" element={<CheckoutOrder />} />
          <Route
            exact
            path="/customer/personal"
            element={isCustomerLoggedIn() ? <CustomerPersonalCabinet /> : <Unauthorized />}
          />
          <Route
            exact
            path="/manager/personal"
            element={isManagerLoggedIn() ? <ManagerPersonalCabinet /> : <Unauthorized />}
          />
          <Route exact path="/product/edit" element={isManagerLoggedIn() ? <EditProductWrapper /> : <Unauthorized />} />
          <Route exact path="/product/new" element={isManagerLoggedIn() ? <AddProduct /> : <Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default Application;
