import {Button, Col, Container, Form, FormControl, Row} from "react-bootstrap";
import {getCategories, getCookie, getProducts, getQueryParam, isLoggedIn, logout} from "../../index";
import logo from '../../resources/logo.png'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faInfo, faShoppingCart, faSignOutAlt, faUser} from '@fortawesome/free-solid-svg-icons';
import React, {useEffect, useState} from "react";
import {User} from '../../schemas/User.ts'
import {redirectToPersonal, redirectToSignIn, redirectToSignUp, redirectToUI} from "../../utilities/redirect";
import Categories from './customer/Categories';
import Products from "./customer/Products";
import {useLocation} from "react-router-dom";
import {CategoryFilter} from "../../schemas/CategoryFilter.ts";
import {ProductFilter} from "../../schemas/ProductFilter.ts";
import nothingHereSeems from '../../resources/oh.png'
import OutsideClickHandler from "../handlers/OutsideClickHandler";
import ControlPanel from "./customer/ControlPanel";
import ShoppingCart from "./customer/ShoppingCart";

const Customer = () => {
    const [user: User, setUser] = useState(null)
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [showSidebar, setShowSidebar] = useState(false);
    const [showCart: boolean, setShowCart] = useState(false);
    const location = useLocation();

    useEffect(() => {
        setUser(User.ReadUser(getCookie('userInfo')));
        const categoryId = getQueryParam('categoryId', location);
            const fetchData = async () => {
            try {
                let categoriesData, productsData;
                if (categoryId) {
                    [categoriesData, productsData] = await Promise.all([getCategories(CategoryFilter.build({parentCategoryId: categoryId.toString()})),
                        getProducts(ProductFilter.build({categoryId: categoryId.toString()}))]);
                } else {
                    [categoriesData] = await Promise.all([getCategories(CategoryFilter.build({parentCategoryId: null}))]);
                }
                setCategories(categoriesData);
                if (productsData) {
                    setProducts(productsData);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData().then(response => console.log('Data fetched successfully'));
    }, [location]);


    return (
        <div className="page" style={{background: '#cea4a4'}}>
            <OutsideClickHandler
                outsideClickCallbacks={[{callback: ()=> setShowSidebar(false), containers: [document.getElementById('header'),
                        document.getElementById('sidebar'),
                        document.getElementById('cart')]},
                    {callback: () => setShowCart(false), containers: [document.getElementById('header'),
                            document.getElementById('cart'),
                            document.getElementById('sidebar')]}]}>
                <header className="bg-dark" style={{position: 'sticky', top: 0, height: '6vh', color: '#fff', zIndex: 1000 }} id="header">
                    <Container fluid className="h-100">
                        <Row className="align-items-center justify-content-between" xs={12}>
                            <Col xs={1} className="d-flex align-items-center justify-content-center">
                                <img src={logo} alt="Logo" style={{ maxWidth: '30%', height: 'auto', cursor: 'pointer' }} onClick={redirectToUI}  />
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
                                <FontAwesomeIcon icon={faShoppingCart} className="icon" /> &&
                                    <FontAwesomeIcon icon={faSignOutAlt} className="icon" onClick={logout}/>}
                            </Col>
                        </Row>
                    </Container>
                </header>
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
                                <Categories categories={categories}/>
                                {products.length > 0 &&
                                    <hr style={{width: '100%', height: '5px'}}/>
                                }
                                {products
                                    &&
                                    <Products products={products}/>
                                }
                                {
                                    categories.length <= 0 && products.length <= 0 ?
                                        <div className="w-100 h-100 d-flex justify-content-center align-items-center flex-wrap">
                                            <img src={nothingHereSeems} className="w-auto mb-5" alt="Nothing Here"/>
                                            <h1 className="w-100 d-flex justify-content-center">No products available...</h1>
                                        </div>:
                                        null
                                }
                            </Container>
                        </Col>
                        <ShoppingCart showCartValue={showCart}/>
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
    );
}

export default Customer;