import { Col, Container, Row } from "react-bootstrap";
import { getCategories, getProducts, getQueryParam } from "../../../index";
import React, { useEffect, useState } from "react";
import Categories from "./Categories";
import Products from "./Products";
import { useLocation } from "react-router-dom";
import { CategoryFilter } from "../../../schemas/requests/filters/CategoryFilter.ts";
import { ProductFilter } from "../../../schemas/requests/filters/ProductFilter.ts";
import nothingHereSeems from "../../../resources/oh.png";
import OutsideClickHandler from "../../handlers/OutsideClickHandler";
import ControlPanel from "./ControlPanel";
import ShoppingCart from "./ShoppingCart";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { redirectToUI } from "../../../utilities/redirect";

const CustomerDashboard = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showCart: boolean, setShowCart] = useState(false);
  const [categoriesPage: number, setCategoriesPage] = useState(1);
  const [productPage: number, setProductPage] = useState(1);
  const [isSubCategoryOpened: boolean, setIsSubCategoryOpened] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const categoryId: string = getQueryParam("categoryId", location);
    if (categoryId) {
      setIsSubCategoryOpened(true);
    }
    const fetchData = async () => {
      try {
        let categoriesData, productsData;
        if (categoryId) {
          [categoriesData, productsData] = await Promise.all([
            getCategories(CategoryFilter.build({ page: categoriesPage, parentCategoryId: categoryId.toString() })),
            getProducts(ProductFilter.build({ page: productPage, categoryId: categoryId.toString() })),
          ]);
        } else {
          [categoriesData] = await Promise.all([
            getCategories(CategoryFilter.build({ page: categoriesPage, parentCategoryId: null })),
          ]);
        }
        setCategories(categoriesData);
        if (productsData) {
          setProducts(productsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [location, categoriesPage]);

  useEffect(() => {
    const categoryId: string = getQueryParam("categoryId", location);
    if (categoryId) {
      setIsSubCategoryOpened(true);
    }
    const fetchData = async () => {
      try {
        let productsData;
        if (categoryId) {
          [productsData] = await Promise.all([
            getProducts(ProductFilter.build({ page: productPage, categoryId: categoryId.toString() })),
          ]);
        }
        if (productsData) {
          setProducts(productsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [productPage]);

  return (
    <div className="page" style={{ background: "#cea4a4" }}>
      <OutsideClickHandler
        outsideClickCallbacks={[
          {
            callback: () => setShowSidebar(false),
            containers: [
              document.getElementById("header"),
              document.getElementById("sidebar"),
              document.getElementById("cart"),
            ],
          },
          {
            callback: () => setShowCart(false),
            containers: [
              document.getElementById("header"),
              document.getElementById("cart"),
              document.getElementById("sidebar"),
            ],
          },
        ]}
      >
        <Header
          setShowSidebar={setShowSidebar}
          showSidebar={showSidebar}
          setShowCart={setShowCart}
          showCart={showCart}
          displaySearchBar={true}
          displayLoginButton={true}
          displaySidebarButton={true}
          displaySignUpButton={true}
          displayCartButton={true}
        />
        <Container fluid style={{ height: "fit-content", width: "100vw", paddingBottom: "1em" }}>
          <Row style={{ height: "100%", overflow: "scroll", width: "100vw" }}>
            <ControlPanel showSidebar={showSidebar} />
            {/* Main Area */}
            <Col
              style={{
                paddingTop: "2rem",
                paddingBottom: "10vh",
                transition: "margin-left 0.3s ease",
                justifyContent: "center",
              }}
            >
              <Container fluid style={{ width: "90%" }}>
                {categories.length <= 0 && products.length <= 0 ? (
                  <div className="w-100 h-100 d-flex justify-content-center align-items-center flex-wrap">
                    <img src={nothingHereSeems} className="w-auto mb-5" alt="Nothing Here" />
                    <h1 className="w-100 d-flex justify-content-center">No subcategories or products available...</h1>
                    <h3
                      onClick={() => redirectToUI()}
                      className="text-decoration-underline"
                      style={{ cursor: "pointer" }}
                    >
                      Go to main
                    </h3>
                  </div>
                ) : null}
                <Categories
                  categories={categories}
                  isSubCategoryOpened={isSubCategoryOpened}
                  categoriesPage={categoriesPage}
                  setCategoriesPage={setCategoriesPage}
                  productPresent={products.length > 0}
                />
                {products.length > 0 && <hr style={{ width: "100%", height: "5px" }} />}
                {products && isSubCategoryOpened && (
                  <Products
                    products={products}
                    productPage={productPage}
                    setProductPage={setProductPage}
                    categoriesPresent={categories.length > 0}
                  />
                )}
              </Container>
            </Col>
            <ShoppingCart showCartValue={showCart} />
          </Row>
        </Container>
        <Footer />
      </OutsideClickHandler>
    </div>
  );
};

export default CustomerDashboard;
