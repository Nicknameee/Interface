import Header from "../../components/Header";
import Footer from "../../components/Footer";

const ManagerPersonalCabinet = () => {
    return (
        <div>
            <Header
                showSidebar={false}
                showCart={false}
                displaySearchBar={true}
                displayLoginButton={true}
                displaySidebarButton={true}
                displaySignUpButton={true}
                displayCartButton={true} />
            <Footer />
        </div>
    )
}

export default ManagerPersonalCabinet;