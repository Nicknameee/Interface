import { Button, Form, FormControl, ListGroup, ListGroupItem } from "react-bootstrap";
import logo from "../../resources/logo.png";
import {
  redirectToPersonal,
  redirectToProductPage,
  redirectToSignIn,
  redirectToSignUp,
  redirectToUI,
} from "../../utilities/redirect";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfo, faShoppingCart, faSignOutAlt, faUser } from "@fortawesome/free-solid-svg-icons";
import { isLoggedIn, logout, searchForProducts } from "../../index";
import React, { useEffect, useState } from "react";
import { ProductLink } from "../../schemas/responses/models/ProductLink.ts";
import OutsideClickHandler from "../handlers/OutsideClickHandler";
import { useMediaQuery } from "@mui/material";
import { Select } from "antd";
import { FlagImage } from "react-international-phone";
import { useLanguage } from "../../contexts/language/language-context.jsx";

const Header = ({
  setShowSidebar,
  showSidebar,
  setShowCart,
  showCart,
  displaySearchBar,
  displayLoginButton,
  displaySignUpButton,
  displayCartButton,
  displaySidebarButton,
}) => {
  const [searchBarValue: string, setSearchValue] = useState("");
  const [productLinks: ProductLink[], setProductLinks] = useState([]);
  const [productLinkPage: number, setProductLinkPage] = useState(0);

  const isMobile = useMediaQuery("(max-width:1000px)");

  const { language, setLanguage } = useLanguage();

  const searchForProduct = async (page: number) => {
    if (page < 0) {
      page = 0;
    }

    setProductLinks([]);

    let links: ProductLink[] = await searchForProducts(searchBarValue, page);

    setProductLinks(links);
    setProductLinkPage(page);
  };

  useEffect(() => {}, []);

  return (
    <header
      className="bg-dark"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 20,
        position: "sticky",
        top: 0,
        padding: "10px 20px",
        color: "#fff",
        zIndex: 1000,
      }}
      id="header"
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <img
          src={logo}
          alt="Logo"
          style={{ width: 40, height: "auto", cursor: "pointer" }}
          title={"Home"}
          onClick={redirectToUI}
        />
        {!isMobile && <h1 style={{ fontSize: 30, marginBottom: 0 }}>{language === "EN" ? 'CRM Assistant' : 'CRM Асистент'}</h1>}
      </div>
      {displaySearchBar !== undefined && displaySearchBar !== null && displaySearchBar === true && (
        <Form inline style={{ display: "flex", flexGrow: 1, maxWidth: "600px" }}>
          <FormControl
            type="text"
            placeholder={language === "EN" ? "Search..." : "Пошук..."}
            value={searchBarValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <Button onClick={() => searchForProduct(productLinkPage)}>
              {
                  language === "EN" ? 'Search' : 'Знайти'
              }
          </Button>
          <OutsideClickHandler
            outsideClickCallbacks={[
              {
                callback: () => {
                  setProductLinks([]);
                  setProductLinkPage(0);
                },
                containers: [document.getElementById("productLinks")],
              },
            ]}
          >
            <div
              className="position-absolute top-100"
              style={{ width: "50%" }}
              hidden={!productLinks || productLinks.length <= 0}
              id={"productLinks"}
            >
              <ListGroup className="w-100" style={{ maxHeight: "190px", overflowY: "auto" }}>
                {productLinks &&
                  productLinks.map((link, index) => (
                    <ListGroup.Item
                      key={index}
                      className="font-monospace p-1 d-flex justify-content-center align-items-center text-center"
                      style={{ cursor: "pointer", backgroundColor: "#144569", fontSize: "1.1em", color: "white" }}
                      onClick={() => redirectToProductPage(link.productId)}
                    >
                      <span>
                        {link.productName} at <strong>{link.categoryName}</strong>
                      </span>
                    </ListGroup.Item>
                  ))}
                {productLinks && (
                  <ListGroupItem
                    hidden={crypto.randomUUID()}
                    key={productLinkPage}
                    className="font-monospace p-1 d-flex justify-content-center align-items-center text-center"
                    style={{ cursor: "pointer", backgroundColor: "#144569", fontSize: "1.1em", color: "white" }}
                    onClick={async () => {
                      await searchForProduct(productLinkPage - 1);
                    }}
                  >
                    Previous results...
                  </ListGroupItem>
                )}
                {productLinks && productLinks.length >= 1 && (
                  <ListGroupItem
                    key={crypto.randomUUID()}
                    className="font-monospace p-1 d-flex justify-content-center align-items-center text-center"
                    style={{ cursor: "pointer", backgroundColor: "#144569", fontSize: "1.1em", color: "white" }}
                    onClick={async () => {
                      await searchForProduct(productLinkPage + 1);
                    }}
                  >
                    {
                      language === "EN" ? 'Extra results...' : 'Наступна сторінка'
                    }
                  </ListGroupItem>
                )}
              </ListGroup>
            </div>
          </OutsideClickHandler>
        </Form>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {displaySidebarButton !== undefined && displaySidebarButton !== null && displaySidebarButton === true && (
          <FontAwesomeIcon
            icon={faInfo}
            className="icon"
            title={language === "EN" ? "Show Menu" : "Меню"}
            onClick={() => setShowSidebar(!showSidebar)}
          />
        )}
        {displayCartButton !== undefined && displayCartButton !== null && displayCartButton === true ? (
          <FontAwesomeIcon
            icon={faShoppingCart}
            className="icon"
            title={language === "EN" ? "Check On Your Shopping Cart" : "Глянути Кошик"}
            onClick={() => setShowCart(!showCart)}
          />
        ) : null}
        {isLoggedIn() && (
          <FontAwesomeIcon
            icon={faUser}
            className="icon"
            title={language === "EN" ? "Your Personal Account" : "Особистий кабінет"}
            onClick={redirectToPersonal}
          />
        )}
        {isLoggedIn() && <FontAwesomeIcon icon={faSignOutAlt} className="icon" title={language === "EN" ? "Log Out" : 'Вийти'} onClick={logout} />}
        {!isLoggedIn() &&
          displayLoginButton !== undefined &&
          displayLoginButton !== null &&
          displayLoginButton === true && (
            <Button size="sm" variant="outline-light" style={{ width: 95 }} onClick={redirectToSignIn}>
                {
                    language === "EN" ? 'Login' : 'Авторизація'
                }
            </Button>
          )}
        {!isLoggedIn() &&
          displaySignUpButton !== undefined &&
          displaySignUpButton !== null &&
          displaySignUpButton === true && (
            <Button size="sm" variant="outline-light" style={{ width: 90 }} onClick={redirectToSignUp}>
                {
                    language === "EN" ? 'Register' : 'Реєстрація'
                }
            </Button>
          )}
        <Select
          value={language}
          onChange={(value) => {
            localStorage.setItem("language", value);
            setLanguage(value);
          }}
          suffixIcon={null}
        >
          <Select.Option value="UA">
            <div style={{ display: "flex", padding: "4px", justifyContent: "center", alignItems: "center" }}>
              <FlagImage size={20} iso2="ua" />
            </div>
          </Select.Option>
          <Select.Option value="EN">
            <div style={{ display: "flex", padding: "4px", justifyContent: "center", alignItems: "center" }}>
              <FlagImage size={20} iso2="gb" />
            </div>
          </Select.Option>
        </Select>
      </div>
    </header>
  );
};

export default Header;
