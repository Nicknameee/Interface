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
import {useLanguage} from "../../../../contexts/language/language-context";

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

  const {language} = useLanguage();

  const handleProductNameChange = (value) => {
    setProductName(value);
    if (value === "") {
      setProductNameException("");
      return;
    }

    if (!/^[a-zA-Z0-9]{5,33}$/.test(value) && value) {
      if (language === 'EN') {
        setProductNameException("Invalid product name");
      } else {
        setProductNameException("Невалідна назва продукту");
      }
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
      if (language === 'EN'     ) {
        setProductBrandException("Invalid product brand");
      } else {
        setProductBrandException("Невалідна бренд продукту");
      }
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
      if (language === 'EN') {
        setDescriptionException("Invalid description, text must be not longer than 300 symbols");
      } else {
        setDescriptionException("Невалідний опис так як текст не може бути довше за 300 символів");
      }
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
      if (language === 'EN') {
        setCostException("Invalid cost, cant be less than 1");
      } else {
        setCostException("Ціна невалідна, не може бути менше за 1");
      }
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
      if (language === 'EN') {
        setMarginRateException("Invalid margin rate, can not be less than 1");
      } else {
        setMarginRateException("Невалідна ставка виручки, не може бути меншою за 1");
      }
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
      if (language === 'EN' ) {
        setItemsLeftException("Invalid remaining items number");
      } else {
        setItemsLeftException("Невалідна кількість залишку товару");
      }
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

      if (language === 'EN') {
        notifySuccess("Product updated");
      } else {
        notifySuccess("Ви оновили продукт");
      }

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
      if (language === 'EN') {
        notifyError("Can not add param with empty name");
      } else {
        notifyError("Заборонено додавати параметр з пустим іменем");
      }
    } else {
      if (Object.keys(parameters).includes(uwu)) {
        if (language === 'EN') {
          notifyError("Duplicate key, can not allow same param name");
        } else {
          notifyError("Заборонено додати параметр, це ім я вже зайняте");
        }
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
                <Form.Label>
                  {
                    language === 'EN' ? 'Name' : 'Ім\'я'
                  }
                </Form.Label>
                <div className="input-container">
                  <Form.Control
                    type="text"
                    placeholder={ language === 'EN' ? "Enter product name" : 'Уведіть Ім\'я продукту'}
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
                <Form.Label>
                  {
                    language === 'EN' ? 'Brand' : 'Бренд'
                  }
                </Form.Label>
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
                    title="This field is required"
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
                <Form.Label>
                  {
                    language === 'EN' ? 'Description' : 'Опис'
                  }
                 </Form.Label>
                <div className="input-container">
                  <textarea
                    placeholder={ language === 'EN' ? "Enter product brand" : 'Уведіть бренд продукту'}
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
                <Form.Label>
                  {
                    language === 'EN' ? 'Cost' : 'Ціна'
                  }
                </Form.Label>
                <div className="input-container">
                  <Form.Control
                    type="number"
                    min={1}
                    placeholder={ language === 'EN' ? "Enter products cost" : 'Уведіть ціну продукту'}
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
                  <Form.Label>
                    {
                      language === 'EN' ? 'Currency' : 'Тип валюти'
                    }
                  </Form.Label>
                  <div className="input-container">
                    <span>
                      {
                        language === 'EN' ? 'Status: ' : 'Статус: '
                      }
                    </span>
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
                  <Form.Label>
                    {
                      language === 'EN' ? 'Blocked' : 'Заблоковано'
                    }
                  </Form.Label>
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
                  <Form.Label>
                    {
                      language === 'EN' ? 'Margin Rate' : 'Відношення виручки'
                    }
                  </Form.Label>
                  <div className="input-container">
                    <Form.Control
                      type="number"
                      placeholder={ language === 'EN' ? "Enter product margin rate" : 'Уведіть відношення виручки продукту'}
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
                  <Form.Label>
                    {
                      language === 'EN' ? 'Items Left' : 'Залишилося товару'
                    }
                  </Form.Label>
                  <div className="input-container">
                    <Form.Control
                      type="number"
                      min={0}
                      placeholder={ language === 'EN' ? "Enter number of remaining items" : 'Уведіть к-сть залишку продукції' }
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
                <Form.Label style={{ fontSize: 16 }}>
                  {
                    language === 'EN' ? 'Main picture' : 'Фото'
                  }
                </Form.Label>
                <Form.Control onChange={(e) => setPicture(e.target.files[0])} size="lg" type="file" />
              </Form.Group>

              <Form.Group className="m-3" controlId="formBasicEmail">
                <Form.Label style={{ fontSize: 16 }}>
                  {
                    language === 'EN' ? 'Pictures' : 'Додаткові фото'
                  }
                </Form.Label>
                <Form.Control onChange={(e) => setPictures(e.target.files)} multiple size="lg" type="file" />
              </Form.Group>

              <Button
                variant={infoValid() ? "primary" : "secondary"}
                type="button"
                className="m-3"
                disabled={!infoValid()}
                onClick={() => editProductHook()}
              >
                {
                  language === 'EN' ? 'Edit Product' : 'Редагувати продукцію'
                }
              </Button>
            </Form>
            <Form
              className="custom-form py-3 my-1 d-flex flex-wrap w-50"
              style={{ marginBottom: "13vh", height: "fit-content" }}
            >
              <h5 className="w-100">
                {
                  language === 'EN' ? 'Metrics, size measurement in SM, weight measured in KG' : 'Одиниці виміру, розміри у СМ, вага у КГ'
                }
              </h5>
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
                      {
                        language === 'EN' ? 'Remove' : 'Прибрати'
                      }
                    </Button>
                    <hr />
                  </div>
                ))}
              <Form.Control type="text" name="key" value={uwu} onChange={(e) => handleNewParamName(e.target.value)} />
              <Button variant="primary" onClick={handleAddParam} className="btn btn-primary w-100 h-25">
                {
                  language === 'EN' ? 'Add Param' : 'Новий параметр'
                }
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
