import Header from "../../components/Header";
import Footer from "../../components/Footer";

const ManagerPersonalCabinet = () => {
    return (
        <div>
            <Header
                showSidebar={false}
                showCart={false}
                setShowCart={() => {}}
                setShowSidebar={() => {}}
                displaySearchBar={false}
                displayLoginButton={true}
                displaySidebarButton={false}
                displaySignUpButton={true}
                displayCartButton={false} />
            <Footer />
        </div>
    )
}

export default ManagerPersonalCabinet;