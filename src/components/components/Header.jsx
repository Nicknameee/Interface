import {Button, Col, Container, Form, FormControl, ListGroup, ListGroupItem, Row} from "react-bootstrap";
import logo from "../../resources/logo.png";
import {
    redirectToPersonal,
    redirectToProductPage,
    redirectToSignIn,
    redirectToSignUp,
    redirectToUI
} from "../../utilities/redirect";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faInfo, faShoppingCart, faSignOutAlt, faUser} from "@fortawesome/free-solid-svg-icons";
import {isLoggedIn, logout, searchForProducts} from "../../index";
import React, {useEffect, useState} from "react";
import {ProductLink} from "../../schemas/responses/models/ProductLink.ts";
import OutsideClickHandler from "../handlers/OutsideClickHandler";

const Header = ({setShowSidebar, showSidebar, setShowCart, showCart,
                    displaySearchBar, displayLoginButton, displaySignUpButton, displayCartButton, displaySidebarButton}) => {
    const [searchBarValue: string, setSearchValue] = useState('');
    const [productLinks: ProductLink[], setProductLinks] = useState([]);
    const [productLinkPage: number, setProductLinkPage] = useState(0);
    const searchForProduct = async (page: number) => {
        if (page < 0) {
            page = 0
        }

        setProductLinks([]);

        let links: ProductLink[] = await searchForProducts(searchBarValue, page);

        setProductLinks(links)
        setProductLinkPage(page);
    };

    useEffect(() => {

    }, []);

    return (
        <header className="bg-dark" style={{position: 'sticky', top: 0, height: '6vh', color: '#fff', zIndex: 1000 }} id="header">
            <Container fluid className="h-100">
                <Row className="align-items-center justify-content-between" xs={12}>
                    <Col xs={1} className="d-flex align-items-center justify-content-center">
                        <img src={logo} alt="Logo" style={{ maxWidth: '30%', height: 'auto', cursor: 'pointer' }} title={'Home'} onClick={redirectToUI}  />
                    </Col>
                    <Col xs={2} className="d-flex align-items-center justify-content-center">
                        <h1>CRM Assistant</h1>
                    </Col>
                    <Col xs={6} className="d-flex align-items-center justify-content-center">
                        {
                            displaySearchBar !== undefined && displaySearchBar !== null && displaySearchBar === true &&
                                <Form inline className="w-100 d-inline-flex justify-content-around">
                                    <FormControl type="text" placeholder="Search..." className="mr-sm-2 w-75" value={searchBarValue} onChange={(e) => setSearchValue(e.target.value)}/>
                                    <Button onClick={() => searchForProduct(productLinkPage)}>Search</Button>
                                    <OutsideClickHandler outsideClickCallbacks={[{callback: () => {
                                        setProductLinks([]);
                                        setProductLinkPage(0);
                                        },
                                        containers: [document.getElementById('productLinks')]}]}>
                                        <div className="position-absolute top-100" style={{width: '50%'}} hidden={!productLinks || productLinks.length <= 0} id={'productLinks'}>
                                            <ListGroup className="w-100" style={{ maxHeight: '190px', overflowY: 'auto' }}>
                                                {
                                                    productLinks && productLinks.map((link, index) => (
                                                    <ListGroup.Item
                                                        key={index}
                                                        className="font-monospace p-1 d-flex justify-content-center align-items-center text-center"
                                                        style={{ cursor: 'pointer', backgroundColor: '#144569', fontSize: '1.1em', color: 'white'}}
                                                        onClick={() => redirectToProductPage(link.productId)}>
                                                        <span>{link.productName} at <strong>{link.categoryName}</strong></span>
                                                    </ListGroup.Item>
                                                ))}
                                                {
                                                    productLinks &&
                                                    <ListGroupItem
                                                        hidden={crypto.randomUUID()}
                                                        key={productLinkPage}
                                                        className="font-monospace p-1 d-flex justify-content-center align-items-center text-center"
                                                        style={{ cursor: 'pointer', backgroundColor: '#144569', fontSize: '1.1em', color: 'white'}}
                                                        onClick={async () => {
                                                            await searchForProduct(productLinkPage - 1);
                                                        }}>
                                                        Previous results...
                                                    </ListGroupItem>
                                                }
                                                {
                                                    productLinks && productLinks.length >= 1 &&
                                                    <ListGroupItem
                                                        key={crypto.randomUUID()}
                                                        className="font-monospace p-1 d-flex justify-content-center align-items-center text-center"
                                                        style={{ cursor: 'pointer', backgroundColor: '#144569', fontSize: '1.1em', color: 'white'}}
                                                        onClick={async () => {
                                                            await searchForProduct(productLinkPage + 1);
                                                        }}>
                                                        Extra results...
                                                    </ListGroupItem>
                                                }
                                            </ListGroup>
                                        </div>
                                    </OutsideClickHandler>
                                </Form>
                        }
                    </Col>
                    <Col xs={3} className="d-flex align-items-center justify-content-around">
                        {!isLoggedIn() && displayLoginButton !== undefined && displayLoginButton !== null && displayLoginButton === true &&
                            <Button variant="outline-light" className="mr-2 w-25" onClick={redirectToSignIn}>Login</Button>
                        }
                        {!isLoggedIn() && displaySignUpButton !== undefined && displaySignUpButton !== null && displaySignUpButton === true &&
                            <Button variant="outline-light" className="mr-2 w-25" onClick={redirectToSignUp}>Register</Button>
                        }
                        {displaySidebarButton !== undefined && displaySidebarButton !== null && displaySidebarButton === true &&
                            <FontAwesomeIcon icon={faInfo} className="icon" title={'Show Menu'} onClick={() => setShowSidebar(!showSidebar)} />
                        }
                        {displayCartButton !== undefined && displayCartButton !== null && displayCartButton === true ?
                            <FontAwesomeIcon icon={faShoppingCart} className="icon" title={'Check On Your Shopping Cart'} onClick={() => setShowCart(!showCart)}/>
                            :
                            null
                        }
                        {isLoggedIn() &&
                            <FontAwesomeIcon icon={faUser} className="icon" title={'Your Personal Account'} onClick={redirectToPersonal}/>
                        }
                        {isLoggedIn() &&
                            <FontAwesomeIcon icon={faSignOutAlt} className="icon" title={'Log Out'} onClick={logout}/>
                        }
                    </Col>
                </Row>
            </Container>
        </header>
    )
};

export default Header;