import {useEffect, useState} from "react";
import {Col, Container, Nav, Navbar, Row} from "react-bootstrap";

const Orders = ({userInfo}) => {
    const [orders, setOrders] = useState([])

    useEffect(() => {

    }, []);

    const fetchOrders = () => {

    };

    return (
        <div>
            {orders.map((item, index) => (
                <div>

                </div>
            ))}
        </div>
    );
}

export default Orders;