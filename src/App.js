import './styles/App.css';
import LoginForm from "./components/auth/LoginForm";
import UI from "./components/UI";
import SignUpForm from "./components/auth/SignUpForm";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import NotFound from "./components/NotFound";
import ProductComponent from "./components/user/customer/ProductComponent";

function App() {
    return (
        <Router>
            <Routes>
                <Route exact path="/home" element={<UI />} />
                <Route exact path="/sign/up" element={<SignUpForm />} />
                <Route exact path="/sign/in" element={<LoginForm />} />
                <Route exact path="/product" element={<ProductComponent />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    )
}

export default App;
