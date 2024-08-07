import React, {useEffect, useState} from "react";
import {addToCart, getCart, removeFromCart} from "../../../index";
import {Button, ButtonGroup, Col, Container, FormGroup, Nav} from "react-bootstrap";
import {CartProduct} from "../../../schemas/data/CartProduct.ts";
import defaultImage from '../../../resources/imageNotFoundResource.png'
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import emptyCart from '../../../resources/emptyCart.png'
import {redirectToPurchase, redirectToUI} from "../../../utilities/redirect";
import {useLanguage} from "../../../contexts/language/language-context";

const ShoppingCart = React.forwardRef(({showCartValue}, ref) => {
    const [cart, setCart] = useState([]);
    const [showCart, setShowCart] = useState(false);
    const [cartUpdate, setCartUpdate] = useState(1);
    const { language, setLanguage } = useLanguage();

    useEffect(() => {
        let cartProducts: CartProduct[] = getCart();
        setCart(cartProducts);
        setShowCart(showCartValue);
    }, [cartUpdate, showCartValue]);

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

    const incrementUpdatesNumbers = () => {
        setCartUpdate(cartUpdate + 1)
    };

    React.useImperativeHandle(ref, () => ({
        incrementUpdatesNumbers
    }));

    return (
        <Col className="bg-gradient" style={{
            background: '#185886',
            height: '84vh',
            width: '13vw',
            position: 'fixed',
            top: '6vh',
            right: showCart ? 0 : '-13vw',
            zIndex: 1,
            padding: 0,
            transition: 'right 0.3s ease',
            WebkitOverflowScrolling: 'touch', overflowY: 'scroll'
        }} id="cart" onWheel={handleWheel}>
            <Nav className="flex-column w-100">
                <div style={{ width: '100%'}}>
                    <div className="cart-container" style={{ overflowY: 'scroll' }}>
                        <Container style={{overflowY: 'scroll'}}>
                            {cart.map((item: CartProduct, index: number) => (
                                <div key={index} className="cart-item py-1 d-flex justify-content-between flex-wrap position-relative">
                                    <FontAwesomeIcon icon={faTrash} className="position-absolute" style={{width: '19px', height: '19px', left: '89%', border: 'none', top: '3%', cursor: 'pointer'}} onClick={() => removeProductFromCart(item.productId)}/>
                                    <img src={item.introductionPictureUrl || defaultImage} alt={item.name} className="cart-item-image" style={{maxWidth: '150px', borderRadius: '15%'}} />
                                    <div className="cart-item-details w-100">
                                        <p className="font-monospace" style={{fontWeight: "bold"}}>{item.name}</p>
                                        <p className="font-monospace" style={{fontWeight: "bold"}}>
                                            {
                                                language === 'EN' ? 'Cost:' : 'Ціна:'
                                            }
                                            {item.cost} {item.currency}
                                        </p>
                                        <p className="font-monospace" style={{fontWeight: "bold"}}>
                                            {
                                                language === 'EN' ? 'Items:' : 'К-сть:'
                                            }
                                            {item.itemsBooked}</p>
                                        <button className="btn btn-success w-25 m-1" onClick={() => handleChangeQuantity(item.productId, '+')}>+</button>
                                        <button className="btn btn-danger w-25 m-1" onClick={() => handleChangeQuantity(item.productId, '-')} disabled={item.itemsBooked === 0}>-</button>
                                    </div>
                                </div>
                            ))}
                        </Container>
                    </div>
                </div>
            </Nav>
            {cart.length > 0
                ?
                <FormGroup>
                    <ButtonGroup>
                        <Button className="btn btn-success m-3" onClick={() => redirectToPurchase()}>
                            {
                                language === 'EN' ? 'Checkout' : 'Замовити'
                            }
                        </Button>
                    </ButtonGroup>
                </FormGroup>
                :
                <div className="w-100 d-flex justify-content-center flex-wrap py-3">
                    <img src={emptyCart} style={{maxWidth: '11vw', height: 'auto', marginBottom: '1em'}} alt="Empty"/>
                    <p className="w-100 font-monospace px-3" style={{fontStyle: 'italic', fontSize: '19px' }}>
                        {
                            language === 'EN' ? 'Cart is empty, but it\'s never too late to' : 'Кошик пустий, але завжди можна'
                        }
                        <span title={'Go to products'} style={{cursor: 'pointer', textDecoration: 'underline'}} onClick={() => redirectToUI()}>
                            {
                                language === 'EN' ? ' fill it up' : ' заповнити його'
                            }
                        </span>
                    </p>
                </div>
            }
        </Col>
    );
}, null);

export default ShoppingCart;
