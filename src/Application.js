import './styles/App.css';
import LoginForm from "./components/auth/LoginForm";
import UI from "./components/UI";
import SignUpForm from "./components/auth/SignUpForm";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import NotFound from "./components/components/NotFound";
import ProductComponent from "./components/user/customer/ProductComponent";
import CheckoutOrder from "./components/user/customer/CheckoutOrder";
import CustomerPersonalCabinet from "./components/user/customer/CustomerPersonalCabinet";
import {isLoggedIn} from "./index";
import Unauthorized from "./components/components/Unauthorized";

function Application() {
    return (
        <Router>
            <Routes>
                <Route exact path="/home" element={<UI />} />
                <Route exact path="/" element={<UI />} />
                <Route exact path="/sign/up" element={isLoggedIn() ? <UI /> : <SignUpForm />} />
                <Route exact path="/sign/in" element={isLoggedIn() ? <UI /> : <LoginForm />} />
                <Route exact path="/product" element={<ProductComponent />} />
                <Route exact path="/purchase" element={<CheckoutOrder />} />
                <Route exact path="/customer/personal" element={isLoggedIn() ? <CustomerPersonalCabinet /> : <Unauthorized />} />
                <Route exact path="/manager/personal" element={isLoggedIn() ? <CustomerPersonalCabinet /> : <Unauthorized />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    )
}

export default Application;
