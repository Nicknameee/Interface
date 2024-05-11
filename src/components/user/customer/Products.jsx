import React from "react";
import defaultImage from "../../../resources/imageNotFoundResource.png";
import { redirectToProductPage } from "../../../utilities/redirect";
import { Product } from "../../../schemas/responses/models/Product.ts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFeather } from "@fortawesome/free-solid-svg-icons";
import {addToWaitingList, isLoggedIn} from "../../../index";
import { WaitingListProduct } from "../../../schemas/data/WaitingListProduct.ts";
import { Button } from "react-bootstrap";
import {useLanguage} from "../../../contexts/language/language-context";

const Products = ({ products, productPage, setProductPage, categoriesPresent, managerMode }) => {
  const { language, setLanguage } = useLanguage();

  const list = (products: Product[]) => {
    if (products.length > 0) {
      return products.map((product) => (
        <div key={product.productId} about={product.name} className="mb-3" style={{ width: 250 }}>
          <div className="card h-100">
            {product.introductionPictureUrl ? (
              <img
                src={product.introductionPictureUrl}
                className="card-img-top"
                alt={product.name}
                style={{ minHeight: "50%", height: "60%", maxHeight: "70%", width: "auto" }}
              />
            ) : (
              <img src={defaultImage} className="card-img-top" alt={product.name} style={{ maxHeight: "50%" }} />
            )}
            <div className="card-body" style={{ maxHeight: "50%" }}>
              <h5 className="card-title">{product.name}</h5>
              <h5 className="card-title">
                {product.cost} {product.currency}
              </h5>
              {product.blocked || product.itemsLeft === 0 ? (
                <button className="btn btn-dark" style={{ marginRight: "10px" }} disabled={true}>
                  {
                    language === 'EN' ? 'Not Available' : 'Недоступно'
                  }
                </button>
              ) : (
                <div>
                  <button
                    className="btn btn-success"
                    style={{ marginRight: "10px" }}
                    onClick={() => redirectToProductPage(product.productId)}
                    title={"Check Up Product Page"}
                  >
                    {
                      language === 'EN' ? 'Check It Up' : 'ВІдкрити'
                    }
                  </button>
                </div>
              )}
              {
                isLoggedIn() &&
                    <button
                        className="btn btn-primary"
                        onClick={() => addToWaitingList(WaitingListProduct.getOfProduct(product))}
                        title={"Add Product To Waiting List"}
                    >
                      <FontAwesomeIcon icon={faFeather} />
                    </button>
              }
            </div>
          </div>
        </div>
      ));
    } else {
      return null;
    }
  };
  return (
    <div className="w-100 py-0">
      <div className="row justify-content-center w-100 py-0">
        {list(products)}
        {products.length < 1 && <h4 className="w-100 text-center">
          {
            language === 'EN' ? 'No products were found....' : 'Не знайдено жодного продукта'
          }
        </h4>}
        {
          // (categoriesPresent || products.length >= 1) &&
            (
          <div className="w-100 d-flex justify-content-center align-items-center">
            <Button
              className="mx-3"
              style={{ width: "100px" }}
              disabled={productPage <= 1}
              onClick={() => {
                if (productPage > 1) {
                  setProductPage(productPage - 1);
                }
              }}
            >
              Prev
            </Button>
            <h3 className="font-monospace">{productPage}</h3>
            <Button
              className="mx-3"
              style={{ width: "100px" }}
              onClick={() => {
                if (products.length > 0) {
                  setProductPage(productPage + 1);
                }
              }}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
