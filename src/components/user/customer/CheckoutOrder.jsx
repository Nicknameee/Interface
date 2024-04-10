import React, {useEffect, useState} from "react";
import {Button, Col, Container, Form, FormCheck, FormControl, FormGroup, Nav, Row} from "react-bootstrap";
import GooglePayButton from "@google-pay/button-react";
import {CartProduct} from "../../../schemas/CartProduct.ts";
import {
    addToCart,
    createOrder,
    getCart,
    getCookie,
    isLoggedIn,
    logout,
    processPayment,
    removeFromCart
} from "../../../index";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSignOutAlt, faTrash, faUser} from "@fortawesome/free-solid-svg-icons";
import defaultImage from "../../../resources/imageNotFoundResource.png";
import logo from "../../../resources/logo.png";
import {redirectToPersonal, redirectToSignIn, redirectToSignUp, redirectToUI} from "../../../utilities/redirect";
import {User} from "../../../schemas/User.ts";
import CountrySearch from "../CountrySearch";
import DeliveryAddress from "./DeliveryAddress";
import nothingHereSeems from "../../../resources/oh.png";
import {PAYMENT_TYPE} from "../../../constants/constants";
import {CreateOrder} from "../../../schemas/CreateOrder.ts";
import {OrderedProduct} from "../../../schemas/OrderedProduct.ts";
import {DeliveryData} from "../../../schemas/DeliveryData.ts";
import {OrderShipmentAddress} from "../../../schemas/OrderShipmentAddress.ts";
import {TransactionState} from "../../../schemas/TransactionState.ts";
import {Client} from "@stomp/stompjs";

const CheckoutOrder = () => {
    const [user: User, setUser] = useState({});
    const [paymentType: string, setPaymentType] = useState('COD');
    const [paid: boolean, setPaid] = useState(false);
    const [cart: CartProduct[], setCart] = useState([]);
    const [cartUpdate, setCartUpdate] = useState(1);
    const [userCountry, setUserCountry] = useState(null);
    const [currency, setCurrency] = useState('UAH');
    const [deliveryData: DeliveryData] = useState(new DeliveryData());
    const [deliveryType: string, setDeliveryType] = useState('NONE');
    const [transactionStatusMessage, setTransactionStatusMessage] = useState(null);

    const handleWheel = (e) => {
        document.getElementById('cart').scrollTop += e.deltaY;
    };

    const handleChangeQuantity = (productId: string, sign: string) => {
        let cartItem: CartProduct = cart.find((item: CartProduct) => item.productId === productId, CartProduct);

        if (cartItem) {
            switch (sign) {
                case '+': {
                    cartItem.itemsBooked += 1;

                    addToCart(cartItem);
                    setCartUpdate(cartUpdate + 1);
                    break;
                }
                case '-': {
                    if (cartItem.itemsBooked > 0) {
                        cartItem.itemsBooked -= 1;

                        addToCart(cartItem);
                        setCartUpdate(cartUpdate + 1);
                    }

                    if (cartItem.itemsBooked === 0) {
                        removeFromCart(cartItem)
                        setCartUpdate(cartUpdate + 1);
                    }

                    break;
                }
                default: {
                    console.log('Default case for changing invoked')
                }
            }
        }
    };

    const removeProductFromCart = (productId: string) => {
        let cartItem: CartProduct = cart.find((item: CartProduct) => item.productId === productId, CartProduct);
        if (cartItem) {
            removeFromCart(cartItem)
            setCartUpdate(cartUpdate + 1);
        }
    };

    const getTotalCost = () => {
        let totalCost = 0;

        cart.forEach((cartItem: CartProduct) => {
            totalCost += cartItem.cost * cartItem.itemsBooked;
        });

        return totalCost;
    };

    const updateCountry = (country) => {
        setUserCountry(country)
    };

    const getDisplayItem = () => {
        const displayItems = [];
        cart.forEach(item => {
            displayItems.push(
                {
                    label: String(item.name) + ' * ' + item.itemsBooked,
                    type: 'SUBTOTAL',
                    price: String(item.cost * item.itemsBooked)
                }
            )
        });

        return displayItems;
    }

    const getTransactionInfo = () => {
        console.log({
            totalPriceStatus: 'NOT_CURRENTLY_KNOWN',
            totalPriceLabel: 'Total',
            currencyCode: currency,
            displayItems: getDisplayItem()
        });

        return {
            totalPriceStatus: 'FINAL',
            totalPriceLabel: 'Total',
            totalPrice: String(getTotalCost()),
            currencyCode: currency,
            displayItems: getDisplayItem()
        };
    };

    const initiateOrderCreation = () => {
        let createOrderModel: CreateOrder = new CreateOrder();
        createOrderModel.customerId = user.id;
        createOrderModel.paymentType = paymentType;
        createOrderModel.paid = paid;
        createOrderModel.orderedProducts = cart.map((cartProduct: CartProduct): OrderedProduct => {
          return new OrderedProduct(cartProduct.productId, cartProduct.itemsBooked)
        });

        createOrderModel.deliveryServiceType = deliveryType;

        if (deliveryType !== 'NONE') {
            createOrderModel.orderShipmentAddress = OrderShipmentAddress.build(deliveryData.serialize());
        } else {
            createOrderModel.orderShipmentAddress = null;
        }

        createOrder(createOrderModel);
    };

    const canCheckout = () => {
        return (paymentType === 'COD' || (paymentType === 'PREPAYMENT')) && isLoggedIn();
    };

    const changePaymentType = (paymentType) => {
        setPaymentType(paymentType);
    };

    useEffect(() => {
        let cartProducts: CartProduct[] = getCart();
        setCart(cartProducts);

        let userData: User = User.ReadUser(getCookie('userInfo'));
        setUser(userData);

        if (cartProducts.length > 0) {
            setCurrency(cartProducts[0].currency)
        }

        setUserCountry(getCookie('country'));

        const client = new Client({
            brokerURL: process.env.REACT_APP_ORDER_SERVICE_WEB_SOCKET_ADDRESS,
            debug: function (str) {
                console.debug(str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 1000,
            heartbeatOutgoing: 1000,
        });

        client.activate();

        client.onConnect = () => {
            client.subscribe('/topic/transaction/state/' + user.id, (message) => {
                console.log(`Socket message /topic/transaction/state/${user.id} ${message.body}`);
                let transactionState: TransactionState = JSON.parse(message.body).data;

                if (transactionState.authorized && transactionState.settled) {
                    setTransactionStatusMessage('Transaction settle process is completed, payment is processed');
                    setPaid(true);
                } else {
                    setTransactionStatusMessage('Transaction settle process has not succeeded, payment is not processed');
                    console.log('Transaction status ', transactionState.status);
                    setPaid(false);
                }
            });
        };
    }, [cartUpdate, user.id]);

    useEffect(() => {
        if (paid) {
            initiateOrderCreation();
        }
    }, [paid]);

    return (
        <div className="page" style={{background: '#cea4a4'}}>
        <header className="bg-dark" style={{position: 'sticky', top: 0, height: '6vh', color: '#fff', zIndex: 1000 }} id="header">
            <Container fluid className="h-100">
                <Row className="align-items-center justify-content-between" xs={12}>
                    <Col xs={1} className="d-flex align-items-center justify-content-center">
                        <img src={logo} alt="Logo" title={'Home'} style={{ maxWidth: '30%', height: 'auto', cursor: 'pointer' }} onClick={redirectToUI}  />
                    </Col>
                    <Col xs={2} className="d-flex align-items-center justify-content-center">
                        <h1>CRM Assistant</h1>
                    </Col>
                    <Col xs={8} className="d-flex align-items-center justify-content-center">
                        <Form inline className="w-100 d-inline-flex justify-content-around">
                            {/*<FormControl type="text" placeholder="Search" className="mr-sm-2 w-75" />*/}
                        </Form>
                    </Col>
                    <Col xs={1} className="d-flex align-items-center justify-content-around">
                        {!isLoggedIn() ?
                            <div>
                                <Button variant="outline-light" className="mr-2 w-25" title={'Login'} onClick={redirectToSignIn}>Login</Button>
                                <Button variant="outline-light" className="mr-2 w-25" title={'Sign Up'} onClick={redirectToSignUp}>Register</Button>
                            </div>
                            :
                            null
                        }
                        {isLoggedIn() ?
                            <div className="d-flex justify-content-around w-100">
                                <FontAwesomeIcon icon={faUser} className="icon" title={'Personal'} onClick={redirectToPersonal}/>
                                {/*<FontAwesomeIcon icon={faShoppingCart} className="icon" />*/}
                                <FontAwesomeIcon icon={faSignOutAlt} className="icon" title={'Logout'} onClick={logout}/>
                            </div>
                            :
                            null
                        }
                    </Col>
                </Row>
            </Container>
        </header>
        {
            cart.length === 0 ?
                <div style={{width: '100vw', height: '84vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap'}}>
                    <img src={nothingHereSeems} className="w-auto mb-5" alt="Nothing Here"/>
                    <h1 className="w-100 d-flex justify-content-center">No products ordered...</h1>
                </div>
                :
        <Container style={{width: '100vw', height: '84vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Col style={{
                height: '100%',
                width: '100%',
                transition: 'right 0.3s ease',
                WebkitOverflowScrolling: 'touch',
                overflowY: 'scroll',}} id="cart" onWheel={handleWheel}>
                <Nav className="flex-column w-100 py-3 h-100">
                    <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center'}}>
                        <div className="cart-container h-100" style={{ overflowY: 'scroll' }}>
                            <Container style={{overflowY: 'scroll', width: '100%', height: '100%', borderRight: '3px solid black'}} className="py-1">
                                {cart.map((item: CartProduct, index: number) => (
                                    <div key={index} className="cart-item py-5 px-5 d-flex justify-content-between position-relative w-100" style={{borderBottom: '1px dashed gray'}}>
                                        <FontAwesomeIcon icon={faTrash} className="position-absolute"
                                                         style={{width: '19px', height: '19px', left: '89%', border: 'none', top: '3%', cursor: 'pointer'}} onClick={() => {removeProductFromCart(item.productId)}} />
                                        <img src={item.introductionPictureUrl || defaultImage} alt={item.name} className="cart-item-image" style={{maxWidth: '150px', maxHeight: '150px', borderRadius: '15%', marginRight: '1em'}} />
                                        <div className="cart-item-details w-100">
                                            <p className="font-monospace" style={{fontWeight: "bold"}}>{item.name}</p>
                                            <p className="font-monospace" style={{fontWeight: "bold"}}>  Cost: {item.cost} {item.currency}</p>
                                            <p className="font-monospace" style={{fontWeight: "bold"}}>Items: {item.itemsBooked}</p>
                                            <button className="btn btn-success w-50 m-1" onClick={() => handleChangeQuantity(item.productId, '+')} disabled={paid}>+</button>
                                            <button className="btn btn-danger w-50 m-1" onClick={() => handleChangeQuantity(item.productId, '-')} disabled={item.itemsBooked === 0 || paid}>-</button>
                                        </div>
                                    </div>
                                ))}
                            </Container>
                        </div>
                    </div>
                </Nav>
            </Col>
            <div className="w-50 d-flex flex-wrap flex-column px-5">
                <div style={{ width: '100%', height: '90%', display: 'flex', justifyContent: 'space-around', flexDirection: 'column'}} id="delivery">
                    <h1>Delivery</h1>
                    <FormGroup>
                        {userCountry &&
                            <p>Your country was determined as: <b>{userCountry}</b>, if it's incorrect, please look for it here</p>
                        }
                        <CountrySearch setCountry={updateCountry} country={userCountry} />
                        <DeliveryAddress country={userCountry} deliveryData={deliveryData} setDeliveryTypeExt={setDeliveryType}/>
                    </FormGroup>
                </div>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center', flexDirection: 'column'}} id="payment">
                    <h1>Payment</h1>
                    <h3 className="font-monospace w-50">Total Cost: {getTotalCost()} {currency}</h3>
                    <FormGroup className="w-100 d-flex flex-wrap justify-content-center align-items-center">
                        {PAYMENT_TYPE.map((option: string) => (
                            <FormCheck
                                className="w-50"
                                key={option}
                                id={option}
                                label={option}
                                value={option}
                                checked={paymentType === option}
                                onChange={() => changePaymentType(option)}
                            />
                        ))}
                    </FormGroup>
                    {
                        paymentType === 'PREPAYMENT' &&
                        <GooglePayButton
                            onReadyToPayChange={(result) => {
                                if (!result.isReadyToPay) {
                                    alert('Seems like your browser does not support Google Pay options, try to change settings/browser client or use Cash-on-Delivery type of payment')
                                }
                            }}
                            environment="TEST"
                            paymentRequest={{
                                apiVersion: 2,
                                apiVersionMinor: 0,
                                allowedPaymentMethods: [
                                    {
                                        type: "CARD",
                                        parameters: {
                                            allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
                                            allowedCardNetworks: ["MASTERCARD", "VISA"],
                                        },
                                        tokenizationSpecification: {
                                            type: "PAYMENT_GATEWAY",
                                            parameters: {
                                                gateway: "datatrans",
                                                gatewayMerchantId: "CRMAssistant",
                                            },
                                        },
                                    },
                                ],
                                merchantInfo: {
                                    merchantId: "CRM",
                                    merchantName: "Google Pay Purchase",
                                },
                                transactionInfo: getTransactionInfo(),
                                callbackIntents: ["PAYMENT_AUTHORIZATION"],
                            }}
                            onPaymentAuthorized={async paymentData => {
                                await processPayment(paymentData.paymentMethodData.tokenizationData.token, getTotalCost(), currency, user.id)

                                return {transactionState: 'SUCCESS'};
                            }}
                            existingPaymentMethodRequired='true'
                            buttonColor="black"
                            buttonType="buy"
                            buttonSizeMode="fill" />
                    }
                    {
                        paymentType === 'PREPAYMENT' &&
                        <p className="w-100 text-center font-monospace">{transactionStatusMessage}</p>
                    }
                </div>
                <Button className="my-3 btn btn-success" disabled={!canCheckout()} onClick={initiateOrderCreation}>Checkout</Button>
                {!isLoggedIn()
                    &&
                    <Button className="my-3 btn btn-secondary" onClick={redirectToSignIn}>You need to authorize first!</Button>
                }
            </div>
        </Container>
        }
        </div>
    );
}
export default CheckoutOrder;
