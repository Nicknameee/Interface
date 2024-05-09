import { Col, Container, Row, ListGroup, ListGroupItem, Button, FormCheck } from "react-bootstrap";
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

  const [name, setName] = useState("");
  const [priceFrom, setPriceFrom] = useState();
  const [priceTo, setPriceTo] = useState();
  const [isBlocked, setIsBlocked] = useState(false);
  const [isPresent, setIsPresent] = useState(false);

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
    <div className="page" style={{ background: "#cea4a4", paddingBottom: 50 }}>
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
                <Categories
                  categories={categories}
                  isSubCategoryOpened={isSubCategoryOpened}
                  categoriesPage={categoriesPage}
                  setCategoriesPage={setCategoriesPage}
                  productPresent={products.length > 0}
                />
                {products.length > 0 && <hr style={{ width: "100%", height: "5px" }} />}
                <div
                  style={{
                    flexWrap: "wrap",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "#fff",
                    padding: 20,
                    marginTop: 20,
                    gap: 10,
                    borderRadius: 8,
                    marginBottom: 20,
                  }}
                >
                  <div>
                    <div style={{ whiteSpace: "nowrap", marginRight: 5 }}>Name:</div>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div>
                    <div style={{ whiteSpace: "nowrap", marginRight: 5 }}>Price from:</div>
                    <input
                      type="number"
                      name="priceFrom"
                      className="form-control"
                      value={priceFrom}
                      onChange={(e) => setPriceFrom(e.target.value)}
                    />
                  </div>
                  <div>
                    <div style={{ whiteSpace: "nowrap", marginRight: 5 }}>Price to:</div>
                    <input
                      type="number"
                      name="priceTo"
                      className="form-control"
                      value={priceTo}
                      onChange={(e) => setPriceTo(e.target.value)}
                    />
                  </div>
                  <div style={{ display: "flex" }}>
                    <div style={{ whiteSpace: "nowrap", marginRight: 5 }}>Is blocked:</div>
                    <div className="d-flex">
                      <FormCheck
                        className="w-25"
                        key={crypto.randomUUID()}
                        checked={isBlocked}
                        onChange={(e) => setIsBlocked(e.target.checked)}
                      />
                    </div>
                  </div>
                  <div style={{ display: "flex" }}>
                    <div style={{ whiteSpace: "nowrap", marginRight: 5 }}>Is present:</div>
                    <div className="d-flex">
                      <FormCheck
                        className="w-25"
                        key={crypto.randomUUID()}
                        checked={isPresent}
                        onChange={(e) => setIsPresent(e.target.checked)}
                      />
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <Button
                      color="primary"
                      onClick={() => {
                        const initProducts = async () => {
                          const productsData = await getProducts(
                            ProductFilter.build({
                              name,
                              priceFrom,
                              priceTo,
                              isBlocked,
                              isPresent,
                              page: productPage,
                              categoryId: getQueryParam("categoryId", location),
                            })
                          );

                          setProducts(productsData);
                        };

                        initProducts().then(() => {});
                      }}
                    >
                      Filter
                    </Button>
                    <Button
                      color="primary"
                      onClick={() => {
                        setIsBlocked(false);
                        setIsPresent(false);
                        setName("");
                        setPriceFrom(undefined);
                        setPriceTo(undefined);

                        const initProducts = async () => {
                          const productsData = await getProducts(
                            ProductFilter.build({
                              page: productPage,
                              categoryId: getQueryParam("categoryId", location),
                            })
                          );

                          setProducts(productsData);
                        };

                        initProducts().then(() => {});
                      }}
                    >
                      Drop Filters
                    </Button>
                  </div>
                </div>
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
