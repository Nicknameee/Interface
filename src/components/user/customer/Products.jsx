import React from 'react';
import defaultImage from "../../../resources/imageNotFoundResource.png";
import {redirectToProductPage} from "../../../constants/redirect";
import {CustomerProduct} from "../../../schemas/CustomerProduct.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faShoppingCart} from "@fortawesome/free-solid-svg-icons";

const Products = ({products}) => {
    const list = (products: CustomerProduct[]) => {
        if (products.length > 0) {
            return (
                products.map((product) => (
                    <div key={product.productId} about={product.name} className="mb-3" style={{maxWidth: '15%', width: '15%', minWidth: '15%'}}>
                        <div className="card h-100">
                            {product.pictureUrl ? (
                                    <img
                                        src={product.pictureUrl}
                                        className="card-img-top"
                                        alt={product.name}
                                        style={{minHeight: '50%', height: '50%', maxHeight: '50%'}}
                                    />
                                ) :
                                (
                                    <img
                                        src={defaultImage}
                                        className="card-img-top"
                                        alt={product.name}
                                        style={{maxHeight: '50%'}}
                                    />
                                )}
                            <div className="card-body" style={{maxHeight: '50%'}}>
                                <h5 className="card-title">{product.name}</h5>
                                <h5 className="card-title">{product.cost} {product.currency}</h5>
                                {!product.blocked ?
                                    <div>
                                        <button className="btn btn-success" style={{marginRight: '10px'}} onClick={() => redirectToProductPage(product.productId)}>Check It Up</button>
                                        <button className="btn btn-primary" onClick={() => redirectToProductPage(product.productId)}><FontAwesomeIcon icon={faShoppingCart}/></button>
                                    </div>
                                    :
                                    <button className="btn btn-dark" disabled={true}>Not Available</button>
                                }
                            </div>
                        </div>
                    </div>
                ))
            );
        } else {
            return null;
        }
    }
    return (
        <div className="w-100 py-0">
            <div className="row justify-content-center w-100 py-0">
                {list(products)}
            </div>
        </div>
    );
};

export default Products;
