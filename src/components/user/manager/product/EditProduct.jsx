import { Button, Col, Form, FormCheck } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAsterisk } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { getProduct, getQueryParam, setProductPicture, setProductPictures, updateProduct } from "../../../../index";
import { Product } from "../../../../schemas/responses/models/Product.ts";
import { useLocation } from "react-router-dom";
import { notifyError, notifySuccess } from "../../../../utilities/notify";
import ManagerControlPanel from "../ManagerControlPanel";
import OutsideClickHandler from "../../../handlers/OutsideClickHandler";

const EditProduct = () => {
  const [productId, setProductId] = useState(null);
  const location = useLocation();
  const [productName: string, setProductName] = useState("");
  const [productNameException: string, setProductNameException] = useState("");
  const [showPanel: boolean, setShowPanel] = useState(false);

  const [itemsLeft: number, setItemsLeft] = useState(0);
  const [itemsLeftException: string, setItemsLeftException] = useState("");

  const [parameters, setParameters] = useState([]);

  const [picture, setPicture] = useState();
  const [pictures, setPictures] = useState();

  const handleProductNameChange = (value) => {
    setProductName(value);
    if (value === "") {
      setProductNameException("");
      return;
    }

    if (!/^[a-zA-Z0-9]{5,33}$/.test(value) && value) {
      setProductNameException("Invalid product name");
    } else {
      setProductNameException("");
    }
  };

  const [productBrand: string, setProductBrand] = useState("");
  const [productBrandException: string, setProductBrandException] = useState("");

  const handleProductBrandChange = (value) => {
    setProductBrand(value);
    if (value === "") {
      setProductBrandException("");
      return;
    }

    if (!/^[a-zA-Z0-9]{5,33}$/.test(value) && value) {
      setProductBrandException("Invalid product name");
    } else {
      setProductBrandException("");
    }
  };

  const [description: string, setDescription] = useState("");
  const [descriptionException: string, setDescriptionException] = useState("");

  const handleDescriptionChange = (value) => {
    setDescription(value);
    if (value === "") {
      setDescriptionException("");
      return;
    }

    if (value && String(value).length > 300) {
      setDescriptionException("Invalid description, text must be not longer than 300 symbols");
    } else {
      setDescriptionException("");
    }
  };

  const [cost: string, setCost] = useState("");
  const [costException: string, setCostException] = useState("");

  const handleCostChange = (value) => {
    setCost(value);
    if (value === "") {
      setCostException("");
      return;
    }

    if (!value || Number(value) < 1) {
      setCostException("Invalid cost, cant be 0");
    } else {
      setCostException("");
    }
  };

  const [currency: string, setCurrency] = useState("");

  const [blocked: boolean, setBlocked] = useState(false);

  const [marginRate: number, setMarginRate] = useState(0);
  const [marginRateException: string, setMarginRateException] = useState("");

  const handleMarginRateChange = (value) => {
    if (value && value >= 1) {
      setMarginRate(value);
    }

    if (!value || Number(value) < 1 || value === "") {
      setMarginRateException("Invalid margin rate, can not be less than 1");
    }
  };

  const infoValid = () => {
    return (
      productNameException === "" &&
      productBrandException === "" &&
      descriptionException === "" &&
      costException === "" &&
      marginRateException === "" &&
      itemsLeftException === ""
    );
  };

  const handleItemsLeftUpdate = (value) => {
    setItemsLeft(value);

    if ((value && value < 0) || value === "") {
      setItemsLeftException("Invalid remaining items number");
    } else {
      setItemsLeftException("");
    }
  };

  const editProductHook = async () => {
    const result: boolean = await updateProduct({
      productId: productId,
      name: productName,
      brand: productBrand,
      description: description,
      parameters: parameters,
      cost: cost,
      currency: currency,
      itemsLeft: itemsLeft,
      blocked: blocked,
      marginRate: marginRate,
    });

    if (result) {
      if (picture) {
        await setProductPicture(result.data.productId, picture);
      }
      if (pictures) {
        await setProductPictures(result.data.productId, Array.from(pictures));
      }

      notifySuccess("Product updated");

      window.location.reload();
    }
  };

  useEffect(() => {
    const init = async () => {
      const productId = getQueryParam("productId", location);
      const product: Product = await getProduct(productId);

      setProductName(product.name);
      setProductBrand(product.brand);
      setDescription(product.description);
      setCost(product.cost);
      setCurrency(product.currency);
      setBlocked(product.blocked);
      setMarginRate(product.marginRate);
      setProductId(product.productId);
      setItemsLeft(product.itemsLeft);
      setParameters(product.parameters);

      return product;
    };

    init().then();
  }, []);

  const [uwu, setUwu] = useState("");
  const handleNewParamName = (uwu) => {
    setUwu(uwu);
  };
  const handleChangeOfKey = (oldKey, newKey) => {
    setParameters((prevParameters) => {
      const updatedParameters = { ...prevParameters };
      const value = updatedParameters[oldKey];
      delete updatedParameters[oldKey];
      updatedParameters[newKey] = value;
      return updatedParameters;
    });
  };

  const handleChangeOfParam = (key, e) => {
    setParameters((prevParameters) => ({
      ...prevParameters,
      [key]: e.target.value,
    }));
  };

  const handleAddParam = () => {
    if (uwu === "") {
      notifyError("Can not add param with empty name");
    } else {
      if (Object.keys(parameters).includes(uwu)) {
        notifyError("Duplicate key, can not allow same param name");
      } else {
        setParameters((prevParameters) => ({
          ...prevParameters,
          [uwu]: "Value",
        }));
        setUwu("");
      }
    }
  };

  const handleRemoveParam = (key) => {
    const { [key]: _, ...rest } = parameters;
    setParameters(rest);
  };

  return (
    <div
      className="page"
      style={{ background: "#cea4a4", color: "#fff", height: "100vh", overflow: "scroll", width: "100vw" }}
    >
      <OutsideClickHandler
        outsideClickCallbacks={[
          {
            callback: () => setShowPanel(false),
            containers: [document.getElementById("header"), document.getElementById("manbar")],
          },
        ]}
      >
        <Header
          showSidebar={showPanel}
          showCart={false}
          setShowCart={() => {}}
          setShowSidebar={setShowPanel}
          displaySearchBar={false}
          displayLoginButton={false}
          displaySidebarButton={true}
          displaySignUpButton={false}
          displayCartButton={false}
        />
        <Col style={{ overflowY: "scroll", height: "100vh", paddingBottom: "13vh" }}>
          <ManagerControlPanel showSidebar={showPanel} />
          <div className="d-flex">
            <Form className="custom-form py-3 my-1 w-25" style={{ marginBottom: "13vh", height: "fit-content" }}>
              <Form.Group controlId="formUsername" className="m-3">
                <Form.Label>Name</Form.Label>
                <div className="input-container">
                  <Form.Control
                    type="text"
                    placeholder="Enter product name"
                    style={{ paddingLeft: "30px" }}
                    value={productName}
                    onChange={(e) => handleProductNameChange(e.target.value)}
                  />
                  <FontAwesomeIcon icon={faAsterisk} className="required-field" title="This field is required" />
                </div>
                <p
                  style={{ wordBreak: "break-word", marginTop: "1em", color: "white", fontSize: "1.1em" }}
                  hidden={productNameException === ""}
                >
                  {productNameException}
                </p>
              </Form.Group>
              <Form.Group controlId="formEmail" className="m-3">
                <Form.Label>Brand</Form.Label>
                <div className="input-container">
                  <Form.Control
                    type="text"
                    placeholder="Enter product brand"
                    style={{ paddingLeft: "30px" }}
                    value={productBrand}
                    onChange={(e) => handleProductBrandChange(e.target.value)}
                  />
                  <FontAwesomeIcon
                    icon={faAsterisk}
                    className="required-field"
                    title="This field is required if telegram is not specified"
                  />
                </div>
                <p
                  style={{ wordBreak: "break-word", marginTop: "1em", color: "white", fontSize: "1.1em" }}
                  hidden={productBrandException === ""}
                >
                  {productBrandException}
                </p>
              </Form.Group>

              <Form.Group controlId="formPassword" className="m-3">
                <Form.Label>Description</Form.Label>
                <div className="input-container">
                  <textarea
                    placeholder="Enter product brand"
                    style={{
                      paddingLeft: "30px",
                      height: "100px",
                      width: "100%",
                      whiteSpace: "normal",
                      wordWrap: "break-word",
                    }}
                    value={description}
                    onChange={(e) => handleDescriptionChange(e.target.value)}
                  />
                  <FontAwesomeIcon icon={faAsterisk} className="required-field" title="This field is required" />
                </div>
                <p
                  style={{ wordBreak: "break-word", marginTop: "1em", color: "white", fontSize: "1.1em" }}
                  hidden={descriptionException === ""}
                >
                  {descriptionException}
                </p>
              </Form.Group>

              <Form.Group controlId="formConfirmationPassword" className="m-3">
                <Form.Label>Cost</Form.Label>
                <div className="input-container">
                  <Form.Control
                    type="number"
                    min={1}
                    placeholder="Enter products cost"
                    style={{ paddingLeft: "30px" }}
                    value={cost}
                    readOnly={costException !== ""}
                    onChange={(e) => handleCostChange(e.target.value)}
                  />
                  <FontAwesomeIcon icon={faAsterisk} className="required-field" title="This field is required" />
                </div>
                <p
                  style={{ wordBreak: "break-word", marginTop: "1em", color: "white", fontSize: "1.1em" }}
                  hidden={costException === ""}
                >
                  {costException}
                </p>
              </Form.Group>

              <Form.Group controlId="formTelegram" className="m-3">
                <div className="input-container">
                  <Form.Label>Currency</Form.Label>
                  <div className="input-container">
                    <span>Status:</span>
                    <div className="d-flex">
                      <FormCheck
                        className="w-25"
                        key={crypto.randomUUID()}
                        id={"USD"}
                        label={"USD"}
                        value={"USD"}
                        checked={currency === "USD"}
                        onChange={() => setCurrency("USD")}
                      />
                      <FormCheck
                        className="w-25"
                        key={crypto.randomUUID()}
                        id={"UAH"}
                        label={"UAH"}
                        value={"UAH"}
                        checked={currency === "UAH"}
                        onChange={() => setCurrency("UAH")}
                      />
                    </div>
                  </div>
                </div>
              </Form.Group>

              <Form.Group controlId="formTelegram" className="m-3">
                <div className="input-container">
                  <Form.Label>Blocked</Form.Label>
                  <div className="d-flex">
                    <FormCheck
                      className="w-25"
                      key={crypto.randomUUID()}
                      id={"TRUE"}
                      label={"TRUE"}
                      value={"TRUE"}
                      checked={blocked === true}
                      onChange={() => setBlocked(true)}
                    />
                    <FormCheck
                      className="w-25"
                      key={crypto.randomUUID()}
                      id={"FALSE"}
                      label={"FALSE"}
                      value={"FALSE"}
                      checked={blocked === false}
                      onChange={() => setBlocked(false)}
                    />
                  </div>
                </div>
              </Form.Group>

              <Form.Group controlId="formTelegram" className="m-3">
                <div className="input-container">
                  <Form.Label>Margin Rate</Form.Label>
                  <div className="input-container">
                    <Form.Control
                      type="number"
                      placeholder="Enter product margin rate"
                      min={1}
                      style={{ paddingLeft: "30px" }}
                      value={marginRate}
                      onChange={(e) => handleMarginRateChange(e.target.value)}
                    />
                  </div>
                </div>
                <p
                  style={{ wordBreak: "break-word", marginTop: "1em", color: "white", fontSize: "1.1em" }}
                  hidden={marginRateException === ""}
                >
                  {marginRateException}
                </p>
              </Form.Group>

              <Form.Group controlId="formTelegram" className="m-3">
                <div className="input-container">
                  <Form.Label>Items Left</Form.Label>
                  <div className="input-container">
                    <Form.Control
                      type="number"
                      min={0}
                      placeholder="Enter number of remaining items"
                      style={{ paddingLeft: "30px" }}
                      value={itemsLeft}
                      onChange={(e) => handleItemsLeftUpdate(e.target.value)}
                    />
                  </div>
                </div>
                <p
                  style={{ wordBreak: "break-word", marginTop: "1em", color: "white", fontSize: "1.1em" }}
                  hidden={itemsLeftException === ""}
                >
                  {itemsLeftException}
                </p>
              </Form.Group>

              <Form.Group className="m-3" controlId="formBasicEmail">
                <Form.Label style={{ fontSize: 16 }}>Main picture</Form.Label>
                <Form.Control onChange={(e) => setPicture(e.target.files[0])} size="lg" type="file" />
              </Form.Group>

              <Form.Group className="m-3" controlId="formBasicEmail">
                <Form.Label style={{ fontSize: 16 }}>Pictures</Form.Label>
                <Form.Control onChange={(e) => setPictures(e.target.files)} multiple size="lg" type="file" />
              </Form.Group>

              <Button
                variant={infoValid() ? "primary" : "secondary"}
                type="button"
                className="m-3"
                disabled={!infoValid()}
                onClick={() => editProductHook()}
              >
                Edit Product
              </Button>
            </Form>
            <Form
              className="custom-form py-3 my-1 d-flex flex-wrap w-50"
              style={{ marginBottom: "13vh", height: "fit-content" }}
            >
              {parameters &&
                Object.entries(parameters).map(([key, value]) => (
                  <div key={key} className="w-25 mx-1">
                    <Form.Group controlId={`paramKey${key}`}>
                      <Form.Control
                        type="text"
                        value={key}
                        readOnly={true}
                        onChange={(e) => handleChangeOfKey(key, e.target.value)}
                      />
                      <Form.Control
                        type="text"
                        name="key"
                        value={value}
                        onChange={(e) => handleChangeOfParam(key, e)}
                      />
                    </Form.Group>
                    <Button variant="danger" onClick={() => handleRemoveParam(key)}>
                      Remove
                    </Button>
                    <hr />
                  </div>
                ))}
              <Form.Control type="text" name="key" value={uwu} onChange={(e) => handleNewParamName(e.target.value)} />
              <Button variant="primary" onClick={handleAddParam} className="btn btn-primary w-100 h-25">
                Add Param
              </Button>
            </Form>
          </div>
        </Col>
        <Footer />
      </OutsideClickHandler>
    </div>
  );
};

export default EditProduct;
