import {useLocation} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {addProduct, getQueryParam, setProductPicture, setProductPictures} from "../../../../index";
import {notifyError, notifySuccess} from "../../../../utilities/notify";
import OutsideClickHandler from "../../../handlers/OutsideClickHandler";
import Header from "../../../components/Header";
import {Button, Col, Form, FormCheck} from "react-bootstrap";
import ManagerControlPanel from "../ManagerControlPanel";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAsterisk} from "@fortawesome/free-solid-svg-icons";
import Footer from "../../../components/Footer";
import {useLanguage} from "../../../../contexts/language/language-context";

const AddProduct = () => {
  const [categoryId, setCategoryId] = useState("");
  const location = useLocation();
  const [productName: string, setProductName] = useState("");
  const [productNameException: string, setProductNameException] = useState("");
  const [showPanel: boolean, setShowPanel] = useState(false);

  const [itemsLeft: number, setItemsLeft] = useState(0);
  const [itemsLeftException: string, setItemsLeftException] = useState("");

  const [picture, setPicture] = useState();
  const [pictures, setPictures] = useState();

  const [parameters, setParameters] = useState([]);

  const {language} = useLanguage();

  let parametersException = [];

  const handleProductNameChange = (value) => {
    setProductName(value);
    if (value === "") {
      setProductNameException("");
      return;
    }

    if (!value || String(value).length > 64) {
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

    if (!value || String(value).length > 64) {
      if (language === 'EN'     ) {
        setProductBrandException("Invalid product brand");
      } else {
        setProductBrandException("Невалідний бренд продукту");
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

    if (value && String(value).length > 400) {
      if (language === 'EN') {
        setDescriptionException("Invalid description, text must be not longer than 400 symbols");
      } else {
        setDescriptionException("Невалідний опис так як текст не може бути довше за 400 символів");
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

  const [currency: string, setCurrency] = useState("UAH");

  const [blocked: boolean, setBlocked] = useState(false);

  const [marginRate: number, setMarginRate] = useState(1.1);
  const [marginRateException: string, setMarginRateException] = useState("");

  const handleMarginRateChange = (value) => {
    if (value && Number(value) >= 1) {
      setMarginRate(value);
      setMarginRateException("");
    }

    if (!value || Number(value) < 1) {
      if (language === 'EN') {
        setMarginRateException("Invalid margin rate, can not be less than 1");
      } else {
        setMarginRateException("Невалідна ставка виручки, не може бути меншою за 1");
      }
      setMarginRate(1);
    }
  };

  const [uwu, setUwu] = useState("");
  const handleNewParamName = (uwu) => {
    setUwu(uwu);
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
          notifyError("Заборонено додати параметр, це ім\'я вже зайняте");
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
  const infoValid = () => {
    return (
      productNameException === "" &&
      productName !== "" &&
      productBrand !== "" &&
      description !== "" &&
      cost !== "" &&
      Number(cost) > 0 &&
      marginRate !== "" &&
      Number(marginRate) > 0 &&
      itemsLeft >= 0 &&
      productBrandException === "" &&
      descriptionException === "" &&
      costException === "" &&
      marginRateException === "" &&
      itemsLeftException === "" &&
      requiredParametersValid()
    );
  };

  const requiredParametersValid = () => {
    let validity = true;

    parametersException = [];
    if (validity) {
      if (parameters["height"] === undefined || parameters["height"] === null || parameters["height"] < 1) {
        if (language === 'EN') {
          parametersException.push('Parameter "height" is absent or invalid value');
        } else {
          parametersException.push('Обов\'язковий параметр "height" відсутній або має значення менше 1');
        }
        validity = false;
      }
      if (parameters["width"] === undefined || parameters["width"] === null || parameters["width"] < 1) {
        if (language === 'EN') {
          parametersException.push('Parameter "width" is absent or invalid value');
        } else {
          parametersException.push('Обов\'язковий параметр "width" відсутній або має значення менше 1');
        }
        validity = false;
      }
      if (parameters["length"] === undefined || parameters["length"] === null || parameters["length"] < 1) {
        if (language === 'EN') {
          parametersException.push('Parameter "length" is absent or invalid value');
        } else {
          parametersException.push('Обов\'язковий параметр "length" відсутній або має значення менше 1');
        }
        validity = false;
      }
      if (parameters["weight"] === undefined || parameters["weight"] === null || parameters["weight"] < 0.3) {
        if (language === 'EN') {
          parametersException.push('Parameter "weight" is absent or invalid value lower than 300 grams');
        } else {
          parametersException.push('Обов\'язковий параметр "weight" відсутній або має значення менше 300 грам');
        }
        validity = false;
      }
    }

    return validity;
  };

  useEffect(() => {
    setCategoryId(getQueryParam("categoryId", location));
    requiredParametersValid();
  }, [parameters]);

  const handleItemsLeftUpdate = (value) => {
    setItemsLeft(value);

    if ((value && value < 0) || value === "") {
      if (language === 'EN') {
        setItemsLeftException("Invalid remaining items number");
      } else {
        setItemsLeftException('Невалідна кількість залишку товару')
      }
    } else {
      setItemsLeftException("");
    }
  };

  const addProductHook = async () => {
    const result: boolean = await addProduct({
      name: productName,
      brand: productBrand,
      description: description,
      parameters: parameters,
      cost: cost,
      currency: currency,
      itemsLeft: itemsLeft,
      blocked: blocked,
      marginRate: marginRate,
      categoryId: categoryId,
    });

    if (result) {
      if (picture) {
        await setProductPicture(result.data.productId, picture).then();
        notifySuccess('Introduction picture saved successfully')
      }

      if (pictures) {
        await setProductPictures(result.data.productId, Array.from(pictures));
        notifySuccess('Extra pictures saved successfully')
      }

      if (language === 'EN') {
        notifySuccess("Product saved");
      } else {
        notifySuccess("Успішно збережено продукт, очікуйте...");
      }

      window.location.reload();
    }
  };

  useEffect(() => {
    setParameters((prevParameters) => ({
      ...prevParameters,
      ["height"]: "1",
      ["weight"]: "1",
      ["length"]: "1",
      ["width"]: "1",
    }));
  }, []);

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

  const handleRemoveParam = (key) => {
    if (['height', 'weight', 'width', 'length'].includes(key)) {
      if (language === 'EN') {
        notifyError('You can not remove required param, only edit')
      } else {
        notifyError('Ви не можете прибрати обов язкові параметри, лише змінити значення')
      }
      return;
    }
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
                    placeholder={ language === 'EN' ? "Enter product name" : 'Уведіть назву продукту'}
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
                    placeholder={ language === 'EN' ? "Enter product brand" : 'Уведіть продуктовий бренд'}
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
                    placeholder={ language === 'EN' ? "Enter product description" : 'Уведіть опис продукту'}
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
                  <Form.Label>
                    {
                      language === 'EN' ? 'Currency' : 'Оберіть валюту'
                    }
                  </Form.Label>
                  <div className="input-container">
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
                      placeholder={ language === 'EN' ? "Enter product margin rate" : 'Уведіть відношення виручки'}
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
                      placeholder={ language === 'EN' ? "Enter number of remaining items" : 'Уведіть к-сть товарів'}
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
                onClick={() => addProductHook()}
              >
                {
                  language === 'EN' ? 'Add Product' : 'Додати продукт'
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
              {parametersException.map((ex) => (
                <p
                  style={{ wordBreak: "break-word", marginTop: "1em", color: "white", fontSize: "1.1em", width: "75%" }}
                  hidden={ex === ""}
                >
                  {ex}
                </p>
              ))}
            </Form>
          </div>
        </Col>
        <Footer />
      </OutsideClickHandler>
    </div>
  );
};

export default AddProduct;
