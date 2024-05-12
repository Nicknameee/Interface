import React, {useEffect, useState} from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import {getOrdersCompleteData, getQueryParam, getUserInfo} from "../../../index";
import {User} from "../../../schemas/responses/models/User.ts";
import {OrderFilter} from "../../../schemas/requests/filters/OrderFilter.ts";
import {CustomerOrder} from "../../../schemas/responses/models/CustomerOrder.ts";
import {Col, Container, Row} from "react-bootstrap";
import ControlPanel from "./ControlPanel";
import ShoppingCart from "./ShoppingCart";
import Orders from "./Orders";
import {useLocation} from "react-router-dom";
import WaitingList from "./WaitingList";

const CustomerPersonalCabinet = () => {
    const [page, setPage] = useState(1);
    const [customer: User, setCustomer] = useState(null);
    const [orders: CustomerOrder[], setOrders] = useState([]);
    const [showSidebar, setShowSidebar] = useState(false);
    const [showCart: boolean, setShowCart] = useState(false);
    const [mode: string, setMode] = useState('orders');
    const location = useLocation();

    useEffect(() => {
        let mode: string = getQueryParam('mode', location);

        if (!mode) {
            mode = 'orders'
            setMode()
        }

        setMode(mode);


        const user: User = getUserInfo();
        setCustomer(user);

        const initOrders = async (user) => {
            const orderFilter: OrderFilter = new OrderFilter();
            orderFilter.customerId = user.id;
            orderFilter.direction = 'DESC'
            const orders: CustomerOrder[] = await getOrdersCompleteData(orderFilter);

            setOrders(orders)
        };

        if (mode === 'orders') {
            initOrders(user).then(() => {});
        }
    }, [location]);

    const renderActivePage = () => {
        switch (mode) {
            case 'orders': {
                return (
                    <Orders orders={orders} setPage={setPage} page={page}/>
                )
            }
            case 'waitingList': {
                return (
                    <WaitingList />
                )
            }
            default: {
                return null;
            }
        }
    }
    return (
        <div className="page" style={{background: '#cea4a4'}}>
            <Header
                setShowSidebar={setShowSidebar}
                showSidebar={showSidebar}
                setShowCart={setShowCart}
                showCart={showCart}
                displaySidebarButton={true}
                displayCartButton={true}/>
            <Container fluid style={{height: "fit-content", width: '100vw'}}>
                <Row style={{height: '100%', overflow: 'scroll', width: '100vw'}}>
                    <ControlPanel showSidebar={showSidebar} />
                    {/* Main Area */}
                    <Col style={{
                        paddingTop: '2rem',
                        paddingBottom: '10vh',
                        transition: 'margin-left 0.3s ease',
                        justifyContent: 'center'}}>
                        <Container fluid style={{width: '90%'}}>
                            {
                                renderActivePage()
                            }
                        </Container>
                    </Col>
                    <ShoppingCart showCartValue={showCart}/>
                </Row>
            </Container>
            <Footer />
        </div>
    )
};

export default CustomerPersonalCabinet;