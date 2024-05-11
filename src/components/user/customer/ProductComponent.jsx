import React, {useEffect, useRef, useState} from "react";
import {addToCart, addToWaitingList, getProducts, isLoggedIn} from "../../../index";
import {ProductFilter} from "../../../schemas/requests/filters/ProductFilter.ts";
import {Product} from "../../../schemas/responses/models/Product.ts";
import {Col, Container, Row} from "react-bootstrap";
import happyAssistant from "../../../resources/assistant.png";
import {redirectToNotFound} from "../../../utilities/redirect";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCartFlatbed, faPenNib} from "@fortawesome/free-solid-svg-icons";
import {Location, useLocation} from "react-router-dom";
import defaultImage from '../../../resources/imageNotFoundResource.png';
import ShoppingCart from "./ShoppingCart";
import {CartProduct} from "../../../schemas/data/CartProduct.ts";
import OutsideClickHandler from "../../handlers/OutsideClickHandler";
import ControlPanel from "./ControlPanel";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import {WaitingListProduct} from "../../../schemas/data/WaitingListProduct.ts";
import {ToastContainer} from "react-toastify";
import {useLanguage} from "../../../contexts/language/language-context";

const ProductComponent = () => {
    const [product: Product, setProduct] = useState(null);
    const [showSidebar: boolean, setShowSidebar] = useState(false);
    const [showCart: boolean, setShowCart] = useState(false);
    const location: Location = useLocation();
    const [indexOfMainPicture, setIndexOfMainPicture] = useState(0);
    const [mainPicture, setMainPicture] = useState(defaultImage);
    const imagesRef = useRef(null);
    const shoppingCart = useRef(null);
    const { language, setLanguage } = useLanguage();

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
        if (product) {
            if (product.pictureUrls) {
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
            } else {
                console.log('Product must have no pictures or they are not detected, urls ', product.pictureUrls);
            }
        } else {
            console.log('Product is invalid, ', JSON.stringify(product));
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
            <ToastContainer />
            <OutsideClickHandler
                outsideClickCallbacks={[{callback: ()=> setShowSidebar(false), containers: [document.getElementById('header'),
                        document.getElementById('sidebar'),
                        document.getElementById('cart')]},
                {callback: () => setShowCart(false), containers: [document.getElementById('header'),
                        document.getElementById('cart'),
                        document.getElementById('sidebar')]}]}>
                <Header
                    setShowSidebar={setShowSidebar}
                    showSidebar={showSidebar}
                    setShowCart={setShowCart}
                    showCart={showCart}
                    displaySidebarButton={true}
                    displayCartButton={true}/>
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
                                                <p className="mb-3" style={{maxWidth: '900px'}}>
                                                    <strong>
                                                        {
                                                            language === 'EN' ? 'Description:' : 'Опис:'
                                                        }
                                                    </strong>
                                                    {product.description || 'Unknown'}
                                                </p>
                                            </div>
                                            <div className="d-flex w-50 justify-content-between">
                                                {product.blocked === false && product.itemsLeft > 0 ?
                                                    <button className="btn btn-success" onClick={orderProduct}>
                                                        {
                                                            language === 'EN' ? 'Order' : 'Замовити'
                                                        }
                                                        <FontAwesomeIcon icon={faCartFlatbed}/></button>
                                                    :
                                                    <button className="btn btn-secondary" disabled={true}>
                                                        {
                                                            language === 'EN' ? 'Not Available' : 'Недоступний'
                                                        }
                                                    </button>
                                                }
                                                {
                                                    isLoggedIn() &&
                                                    <button className="btn btn-primary" onClick={() => addToWaitingList(WaitingListProduct.getOfProduct(product))}>
                                                        {
                                                            language === 'EN' ? 'Add To Waiting List' : 'Зберегти у список очікування'
                                                        }
                                                        <FontAwesomeIcon icon={faPenNib}/>
                                                    </button>
                                                }
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
            <Footer />
            </OutsideClickHandler>
        </div>
    )
};

export default ProductComponent;
