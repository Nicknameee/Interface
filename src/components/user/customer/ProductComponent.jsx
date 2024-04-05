import React, {useEffect, useRef, useState} from "react";
import {addToCart, getProducts, isLoggedIn, logout} from "../../../index";
import {ProductFilter} from "../../../schemas/ProductFilter.ts";
import {CustomerProduct} from "../../../schemas/CustomerProduct.ts";
import {Button, Col, Container, Form, FormControl, Row} from "react-bootstrap";
import logo from "../../../resources/logo.png";
import happyAssistant from "../../../resources/assistant.png";
import {
    redirectToNotFound,
    redirectToPersonal,
    redirectToSignIn,
    redirectToSignUp,
    redirectToUI
} from "../../../utilities/redirect";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCartFlatbed, faInfo, faPenNib, faShoppingCart, faSignOutAlt, faUser} from "@fortawesome/free-solid-svg-icons";
import {Location, useLocation} from "react-router-dom";
import defaultImage from '../../../resources/imageNotFoundResource.png';
import ShoppingCart from "./ShoppingCart";
import {CartProduct} from "../../../schemas/CartProduct.ts";
import OutsideClickHandler from "../../handlers/OutsideClickHandler";
import ControlPanel from "./ControlPanel";

const ProductComponent = () => {
    const [product: CustomerProduct, setProduct] = useState(null);
    const [showSidebar: boolean, setShowSidebar] = useState(false);
    const [showCart: boolean, setShowCart] = useState(false);
    const location: Location = useLocation();
    const [indexOfMainPicture, setIndexOfMainPicture] = useState(0);
    const [mainPicture, setMainPicture] = useState(defaultImage);
    const imagesRef = useRef(null);
    const shoppingCart = useRef(null);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const productId = searchParams.get('productId');

        if (productId === undefined || productId === null) {
            redirectToNotFound()
        }
        const fetchData = async () => {
            try {
                let [productData] = await Promise.all([getProducts(ProductFilter.build({productIds: [productId]}))])
                if (productData.length > 0) {
                    if (productData[0].introductionPictureUrl) {
                        if (productData[0].pictureUrls) {
                            productData[0].pictureUrls.unshift(productData[0].introductionPictureUrl)
                        }
                        setMainPicture(productData[0].introductionPictureUrl)
                    } else {
                        if (productData[0].pictureUrls && productData[0].pictureUrls.length > 0) {
                            productData[0].introductionPictureUrl = productData[0].pictureUrls[0]
                            setMainPicture(productData[0].introductionPictureUrl)
                        }
                    }

                    setProduct(productData[0])
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData().then(() => console.log('Data fetched successfully'));


    }, [location]);

    const handleImageClick = (imageUrl, index) => {
        setIndexOfMainPicture(index)
        setMainPicture(imageUrl);
    };

    const handleScroll = (direction) => {
        if (direction === 'left') {
            if (indexOfMainPicture >= 1) {
                setMainPicture(product.pictureUrls[indexOfMainPicture - 1])
                setIndexOfMainPicture(indexOfMainPicture - 1)
            }
        } else {
            if (indexOfMainPicture < product.pictureUrls.length - 1) {
                setMainPicture(product.pictureUrls[indexOfMainPicture + 1])
                setIndexOfMainPicture(indexOfMainPicture + 1)
            }
        }
    };

    const handleWheel = (e) => {
        const container = imagesRef.current;
        if (container) {
            container.scrollLeft += e.deltaY;
            e.preventDefault();
        }
    };

    const orderProduct = () => {
        addToCart(CartProduct.getOfProduct(product));
        shoppingCart.current.incrementUpdatesNumbers();
    }

    return (
        <div>
            <OutsideClickHandler
                outsideClickCallbacks={[{callback: ()=> setShowSidebar(false), containers: [document.getElementById('header'),
                        document.getElementById('sidebar'),
                        document.getElementById('cart')]},
                {callback: () => setShowCart(false), containers: [document.getElementById('header'),
                        document.getElementById('cart'),
                        document.getElementById('sidebar')]}]}>
            <header className="bg-dark" style={{position: 'sticky', top: 0, height: '6vh', color: '#fff', zIndex: 1000 }} id="header">
                <Container fluid className="h-100">
                    <Row className="align-items-center justify-content-between position-relative" xs={12}>
                        <Col xs={1} className="d-flex align-items-center justify-content-center">
                            <img src={logo} alt="Logo" style={{ maxWidth: '30%', height: 'auto', cursor: 'pointer' }} onClick={redirectToUI} />
                        </Col>
                        <Col xs={2} className="d-flex align-items-center justify-content-center">
                            <h1>CRM Assistant</h1>
                        </Col>
                        <Col xs={6} className="d-flex align-items-center justify-content-center">
                            <Form inline className="w-100 d-inline-flex justify-content-around">
                                <FormControl type="text" placeholder="Search" className="mr-sm-2 w-75" />
                            </Form>
                        </Col>
                        <Col xs={3} className="d-flex align-items-center justify-content-around">
                            <Button variant="outline-light" className="mr-2 w-25" onClick={redirectToSignIn}>Login</Button>
                            <Button variant="outline-light" className="mr-2 w-25" onClick={redirectToSignUp}>Register</Button>
                            <FontAwesomeIcon icon={faInfo} className="icon" onClick={() => setShowSidebar(!showSidebar)}/>
                            <FontAwesomeIcon icon={faShoppingCart} className="icon" onClick={() => setShowCart(!showCart)}/>
                            {isLoggedIn() && <FontAwesomeIcon icon={faUser} className="icon" onClick={redirectToPersonal}/> &&
                                <FontAwesomeIcon icon={faSignOutAlt} className="icon" onClick={logout}/>}
                        </Col>
                    </Row>
                </Container>
            </header>
            <Container fluid style={{height: "fit-content", width: '100vw'}}>
                <Row style={{height: '100%', overflow: 'scroll', width: '100vw'}}>
                    <ControlPanel showSidebar={showSidebar}/>
                    {/* Main Area */}
                    <Col style={{
                        paddingTop: '2rem',
                        paddingBottom: '10vh',
                        transition: 'margin-left 0.3s ease',
                        justifyContent: 'center'}}>
                        <Container fluid style={{ width: '100%', height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            {product && (
                                <div className="row w-100 h-100 d-flex justify-content-around">
                                    <div className="col-md-5" style={{ minHeight: '100%', maxHeight: '100%', maxWidth: '50%', display: 'flex', flexDirection: 'column', justifyContent: 'space-around'}}>
                                        <div style={{ height: '35%', overflow: 'hidden', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
                                            <img src={mainPicture} alt={product.name} className="img-fluid" style={{ height: '100%' }} />
                                            <div className="button-container w-100 d-flex justify-content-between" style={{ position: 'absolute', top: '50%', left: '0', right: '0', transform: 'translateY(-50%)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                <button className="scroll-button left" onClick={() => handleScroll('left')}>
                                                    L
                                                </button>
                                                <button className="scroll-button right" onClick={() => handleScroll('right')}>
                                                    R
                                                </button>
                                            </div>
                                        </div>
                                        <div style={{ maxHeight: '25%', display: 'flex', overflowX: 'auto', WebkitOverflowScrolling: 'touch', alignItems: 'center', justifyContent: 'space-between', marginTop: '3em' }} ref={imagesRef} onWheel={handleWheel}>
                                            {product.pictureUrls && product.pictureUrls.length > 0 && (
                                                product.pictureUrls.map((url, index) => (
                                                    <img
                                                        key={index}
                                                        src={url}
                                                        alt={`Product Image ${index + 1}`}
                                                        className="img-fluid mr-2"
                                                        style={{ cursor: 'pointer', height: '70%', margin: '0 15px 0 15px' }}
                                                        onClick={() => handleImageClick(url, index)}
                                                    />
                                                ))
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-md-6 rounded p-4 mt-1 mb-5 text-white d-flex flex-column justify-content-between position-relative" style={{ backgroundColor: '#252626', maxHeight: '80vh' }}>
                                        <div>
                                            <h2 className="mb-4">{product.name}</h2>
                                            <div className="p-3 rounded" style={{ backgroundColor: '#252626' }}>
                                                <p className="mb-3"><strong>Brand:</strong> {product.brand || 'Unknown'}</p>
                                                <p className="mb-3"><strong>Price:</strong> {product.cost} {product.currency}</p>
                                                {Object.entries(product.parameters).map(([key, value]) => (
                                                    <p key={key} className="mb-3"><strong>{key}:</strong> {value || 'Unknown'}</p>
                                                ))}
                                                <p className="mb-3" style={{maxWidth: '900px'}}><strong>Description:</strong> {product.description || 'Unknown'}</p>
                                            </div>
                                            <div className="d-flex w-50 justify-content-between">
                                                {product.blocked === false && product.itemsLeft > 0 ?
                                                    <button className="btn btn-success" onClick={orderProduct}>Order <FontAwesomeIcon icon={faCartFlatbed}/></button>
                                                    :
                                                    <button className="btn btn-secondary" disabled={true}>Not Available</button>
                                                }
                                                <button className="btn btn-primary">Add To Waiting List <FontAwesomeIcon icon={faPenNib}/></button>
                                            </div>
                                        </div>
                                        <img src={happyAssistant} style={{maxWidth: '30%', position: 'absolute', top: '10%', left: '50%'}} alt=""/>
                                    </div>
                                </div>
                            )}
                        </Container>
                    </Col>
                    <ShoppingCart showCartValue={showCart} ref={shoppingCart}/>
                </Row>
            </Container>
            <footer className="bg-dark text-light p-3" style={{position: 'fixed', bottom: 0, zIndex: 1000, height: '10vh', width: '100vw'}}>
                <Container fluid className="w-100">
                    <Row className="d-flex flex-column justify-content-center align-items-center w-100" xs={12}>
                        <Col md={6} className="text-center">
                            <ul className="list-unstyled d-flex text-white w-100 justify-content-center">
                                <li className="mx-2">
                                    <a href="#" className="link-with-border text-white">Privacy Policy</a>
                                </li>
                                <li className="mx-2">
                                    <a href="#" className="link-with-border text-white">Terms of Service</a>
                                </li>
                                <li className="mx-2">
                                    <a href="mailto:mail@gmail.com" className="link-with-border text-white">Contact Us</a>
                                </li>
                            </ul>
                        </Col>
                        <Col md={6}>
                            <p className="w-100 text-center">&copy; {new Date().getFullYear()} Your CRM Assistant. All rights reserved.</p>
                        </Col>
                    </Row>
                </Container>
            </footer>
            </OutsideClickHandler>
        </div>
    )
};

export default ProductComponent;
