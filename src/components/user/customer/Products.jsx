import React from 'react';
import defaultImage from "../../../resources/imageNotFoundResource.png";
import {redirectToProductPage} from "../../../utilities/redirect";
import {Product} from "../../../schemas/responses/models/Product.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFeather} from "@fortawesome/free-solid-svg-icons";
import {addToWaitingList} from "../../../index";
import {WaitingListProduct} from "../../../schemas/data/WaitingListProduct.ts";
import {Button} from "react-bootstrap";

const Products = ({products, productPage, setProductPage, categoriesPresent}) => {
    const list = (products: Product[]) => {
        if (products.length > 0) {
            return (
                products.map((product) => (
                    <div key={product.productId} about={product.name} className="mb-3" style={{maxWidth: '15%', width: '15%', minWidth: '15%'}}>
                        <div className="card h-100">
                            {product.introductionPictureUrl ? (
                                    <img
                                        src={product.introductionPictureUrl}
                                        className="card-img-top"
                                        alt={product.name}
                                        style={{minHeight: '50%', height: '60%', maxHeight: '70%', width: 'auto'}}
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
                                {product.blocked || product.itemsLeft === 0 ?
                                    <button className="btn btn-dark" disabled={true}>Not Available</button>
                                    :
                                    <div>
                                        <button className="btn btn-success" style={{marginRight: '10px'}} onClick={() => redirectToProductPage(product.productId)} title={'Check Up Product Page'}>Check It Up</button>
                                        <button className="btn btn-primary" onClick={() => addToWaitingList(WaitingListProduct.getOfProduct(product))} title={'Add Product To Waiting List'}><FontAwesomeIcon icon={faFeather}/></button>
                                    </div>
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
                {
                    products.length < 1 && categoriesPresent &&
                    <h4 className="w-100 text-center">No products were found....</h4>
                }
                {
                    categoriesPresent &&
                    <div className="w-100 d-flex justify-content-center">
                        <Button className="mx-3" style={{width: '100px'}} onClick={() => {
                            if (productPage > 1) {
                                setProductPage(productPage - 1)
                            }
                        }}>Prev</Button>
                        <Button className="mx-3" style={{width: '100px'}} onClick={() => {
                            if (products.length > 0) {
                                setProductPage(productPage + 1)
                            }
                        }}>Next</Button>
                    </div>
                }
            </div>
        </div>
    );
};

export default Products;
