import {useLocation} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {addProduct, getQueryParam} from "../../../../index";
import {notifySuccess} from "../../../../utilities/notify";
import OutsideClickHandler from "../../../handlers/OutsideClickHandler";
import Header from "../../../components/Header";
import {Button, Col, Form, FormCheck} from "react-bootstrap";
import ManagerControlPanel from "../ManagerControlPanel";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAsterisk} from "@fortawesome/free-solid-svg-icons";
import Footer from "../../../components/Footer";

const AddProduct = () => {
    const [categoryId, setCategoryId] = useState('');
    const location = useLocation();
    const [productName: string, setProductName] = useState('');
    const [productNameException: string, setProductNameException] = useState('');
    const [showPanel: boolean, setShowPanel] = useState(false);

    const [itemsLeft: number, setItemsLeft] = useState(0)
    const [itemsLeftException: string, setItemsLeftException] = useState('');

    const [parameters, setParameters] = useState([]);
    let parametersException = []

    const handleProductNameChange = (value) => {
        setProductName(value)
        if (value === '') {
            setProductNameException('')
            return
        }

        if ((!(/^[a-zA-Z0-9\s]{3,33}$/).test(value)) && value) {
            setProductNameException('Invalid product name')
        } else {
            setProductNameException('')
        }
    }

    const [productBrand: string, setProductBrand] = useState('');
    const [productBrandException: string, setProductBrandException] = useState('');

    const handleProductBrandChange = (value) => {
        setProductBrand(value)
        if (value === '') {
            setProductBrandException('')
            return
        }

        if ((!(/^[a-zA-Z0-9\s]{5,33}$/).test(value)) && value) {
            setProductBrandException('Invalid product name')
        } else {
            setProductBrandException('')
        }
    }

    const [description: string, setDescription] = useState('');
    const [descriptionException: string, setDescriptionException] = useState('');

    const handleDescriptionChange = (value) => {
        setDescription(value)
        if (value === '') {
            setDescriptionException('')
            return
        }

        if (value && String(value).length > 300) {
            setDescriptionException('Invalid description, text must be not longer than 300 symbols')
        } else {
            setDescriptionException('')
        }
    }

    const [cost: string, setCost] = useState('');
    const [costException: string, setCostException] = useState('');

    const handleCostChange = (value) => {
        setCost(value)
        if (value === '') {
            setCostException('')
            return
        }

        if (!value || Number(value) < 1 ) {
            setCostException('Invalid cost, cant be 0')
        } else {
            setCostException('')
        }
    }

    const [currency: string, setCurrency] = useState('UAH');

    const [blocked: boolean, setBlocked] = useState(false);

    const [marginRate: number, setMarginRate] = useState(0);
    const [marginRateException: string, setMarginRateException] = useState('');

    const handleMarginRateChange = (value) => {
        if (value && Number(value) > 1) {
            setMarginRate(value)
            setMarginRateException('')
        }

        if (!value || Number(value) <= 1 || value === '') {
            setMarginRateException('Invalid margin rate, can not be less than or equal to 1')
            setMarginRate(1)
        }
    }

    const infoValid = () => {
        return productNameException === ''
            && productName !== ''
            && productBrand !== ''
            && description !== ''
            && cost !== ''
            && Number(cost) > 0
            && marginRate !== ''
            && Number(marginRate) > 0
            && itemsLeft >= 0
            && productBrandException === ''
            && descriptionException === ''
            && costException === ''
            && marginRateException === ''
            && itemsLeftException === ''
            && requiredParametersValid();
    }

    const requiredParametersValid = () => {
        let validity =  true

        parametersException = []
        if (validity) {
            if (parameters['height'] === undefined || parameters['height'] === null || parameters['height'] < 1) {
                parametersException.push('Parameter "height" is absent or invalid value')
                validity = false
            }
            if (parameters['width'] === undefined || parameters['width'] === null || parameters['width'] < 1) {
                parametersException.push('Parameter "width" is absent or invalid value')
                validity = false
            }
            if (parameters['length'] === undefined || parameters['length'] === null || parameters['length'] < 1) {
                parametersException.push('Parameter "length" is absent or invalid value')
                validity = false
            }
            if (parameters['weight'] === undefined || parameters['weight'] === null || parameters['weight'] < 1) {
                parametersException.push('Parameter "weight" is absent or invalid value')
                validity = false
            }
        }

        return validity;
    }

    useEffect(() => {
        setCategoryId(getQueryParam('categoryId', location))
        requiredParametersValid()
    }, [parameters]);

    const handleItemsLeftUpdate = (value) => {
        setItemsLeft(value)

        if ((value && value < 0) || value === '') {
            setItemsLeftException('Invalid remaining items number')
        } else {
            setItemsLeftException('')
        }
    }

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
            categoryId: categoryId
        })

        if (result) {
            notifySuccess('Product saved')

            window.location.reload()
        }
    }

    useEffect(() => {
        setParameters(prevParameters => ({
            ...prevParameters,
            ['height']: '1',
            ['weight']: '1',
            ['length']: '1',
            ['width']: '1'
        }));
    }, []);

    const handleChangeOfKey = (oldKey, newKey) => {
        setParameters(prevParameters => {
            const updatedParameters = { ...prevParameters };
            const value = updatedParameters[oldKey];
            delete updatedParameters[oldKey];
            updatedParameters[newKey] = value;
            return updatedParameters;
        });
    };

    const handleChangeOfParam = (key, e) => {
        setParameters(prevParameters => ({
            ...prevParameters,
            [key]: e.target.value
        }));
    };

    const handleAddParam = () => {
        setParameters(prevParameters => ({
            ...prevParameters,
            ['Param ' + Object.entries(parameters).length]: 'Value'
        }));
    };

    const handleRemoveParam = (key) => {
        const { [key]: _, ...rest } = parameters;
        setParameters(rest);
    };

    return (
        <div className="page" style={{background: '#cea4a4', height: '100vh', overflow: 'scroll', width: '100vw'}}>
            <OutsideClickHandler
                outsideClickCallbacks={[{callback: ()=> setShowPanel(false),
                    containers: [document.getElementById('header'),
                        document.getElementById('manbar')]}]}>
                <Header
                    showSidebar={showPanel}
                    showCart={false}
                    setShowCart={() => {}}
                    setShowSidebar={setShowPanel}
                    displaySearchBar={false}
                    displayLoginButton={false}
                    displaySidebarButton={true}
                    displaySignUpButton={false}
                    displayCartButton={false} />
                <Col style={{overflowY: 'scroll', height: '100vh', paddingBottom: '13vh'}}>
                    <ManagerControlPanel showSidebar={showPanel} />
                    <div className="d-flex">

                        <Form className="custom-form py-3 my-1 w-25" style={{marginBottom: '13vh', height: 'fit-content'}}>
                            <Form.Group controlId="formUsername" className="m-3">
                                <Form.Label>Name</Form.Label>
                                <div className="input-container">
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter product name"
                                        style={{paddingLeft: '30px'}}
                                        value={productName}
                                        onChange={(e) => handleProductNameChange(e.target.value) } />
                                    <FontAwesomeIcon icon={faAsterisk} className="required-field" title='This field is required'/>
                                </div>
                                <p style={{wordBreak: 'break-word', marginTop: '1em', color: 'white', fontSize: '1.1em'}} hidden={productNameException === ''}>{productNameException}</p>
                            </Form.Group>
                            <Form.Group controlId="formEmail" className="m-3">
                                <Form.Label>Brand</Form.Label>
                                <div className="input-container">
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter product brand"
                                        style={{paddingLeft: '30px'}}
                                        value={productBrand}
                                        onChange={(e) => handleProductBrandChange(e.target.value)} />
                                    <FontAwesomeIcon icon={faAsterisk} className="required-field" title='This field is required if telegram is not specified'/>
                                </div>
                                <p style={{wordBreak: 'break-word', marginTop: '1em', color: 'white', fontSize: '1.1em'}} hidden={productBrandException === ''}>{productBrandException}</p>
                            </Form.Group>

                            <Form.Group controlId="formPassword" className="m-3">
                                <Form.Label>Description</Form.Label>
                                <div className="input-container">
                                    <textarea
                                        placeholder="Enter product description"
                                        style={{ paddingLeft: '30px', height: '100px', width: '100%', whiteSpace: 'normal', wordWrap: 'break-word' }}
                                        value={description}
                                        onChange={(e) => handleDescriptionChange(e.target.value)} />
                                    <FontAwesomeIcon icon={faAsterisk} className="required-field" title='This field is required'/>
                                </div>
                                <p style={{wordBreak: 'break-word', marginTop: '1em', color: 'white', fontSize: '1.1em'}} hidden={descriptionException === ''}>{descriptionException}</p>
                            </Form.Group>

                            <Form.Group controlId="formConfirmationPassword" className="m-3">
                                <Form.Label>Cost</Form.Label>
                                <div className="input-container">
                                    <Form.Control
                                        type="number"
                                        min={1}
                                        placeholder="Enter products cost"
                                        style={{paddingLeft: '30px'}}
                                        value={cost}
                                        readOnly={costException !== ''}
                                        onChange={(e) => handleCostChange(e.target.value)} />
                                    <FontAwesomeIcon icon={faAsterisk} className="required-field" title='This field is required'/>
                                </div>
                                <p style={{wordBreak: 'break-word', marginTop: '1em', color: 'white', fontSize: '1.1em'}} hidden={costException === ''}>{costException}</p>
                            </Form.Group>

                            <Form.Group controlId="formTelegram" className="m-3">
                                <div className="input-container">
                                    <Form.Label>Currency</Form.Label>
                                    <div className="input-container">
                                        <span>Status:</span>
                                        <div className="d-flex">
                                            <FormCheck className="w-25"
                                                       key={crypto.randomUUID()}
                                                       id={'USD'}
                                                       label={'USD'}
                                                       value={'USD'}
                                                       checked={currency === 'USD'}
                                                       onChange={() => setCurrency('USD')}/>
                                            <FormCheck className="w-25"
                                                       key={crypto.randomUUID()}
                                                       id={'UAH'}
                                                       label={'UAH'}
                                                       value={'UAH'}
                                                       checked={currency === 'UAH'}
                                                       onChange={() => setCurrency('UAH')}/>
                                        </div>
                                    </div>
                                </div>
                            </Form.Group>

                            <Form.Group controlId="formTelegram" className="m-3">
                                <div className="input-container">
                                    <Form.Label>Blocked</Form.Label>
                                    <div className="d-flex">
                                        <FormCheck className="w-25"
                                                   key={crypto.randomUUID()}
                                                   id={'TRUE'}
                                                   label={'TRUE'}
                                                   value={'TRUE'}
                                                   checked={blocked === true}
                                                   onChange={() => setBlocked(true)}/>
                                        <FormCheck className="w-25"
                                                   key={crypto.randomUUID()}
                                                   id={'FALSE'}
                                                   label={'FALSE'}
                                                   value={'FALSE'}
                                                   checked={blocked === false}
                                                   onChange={() => setBlocked(false)}/>
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
                                            style={{paddingLeft: '30px'}}
                                            value={marginRate}
                                            onChange={(e) => handleMarginRateChange(e.target.value)} />
                                    </div>
                                </div>
                                <p style={{wordBreak: 'break-word', marginTop: '1em', color: 'white', fontSize: '1.1em'}} hidden={marginRateException === ''}>{marginRateException}</p>
                            </Form.Group>

                            <Form.Group controlId="formTelegram" className="m-3">
                                <div className="input-container">
                                    <Form.Label>Items Left</Form.Label>
                                    <div className="input-container">
                                        <Form.Control
                                            type="number"
                                            min={0}
                                            placeholder="Enter number of remaining items"
                                            style={{paddingLeft: '30px'}}
                                            value={itemsLeft}
                                            onChange={(e) => handleItemsLeftUpdate(e.target.value)} />
                                    </div>
                                </div>
                                <p style={{wordBreak: 'break-word', marginTop: '1em', color: 'white', fontSize: '1.1em'}} hidden={itemsLeftException === ''}>{itemsLeftException}</p>
                            </Form.Group>

                            <Button variant={infoValid() ? 'primary' : 'secondary'} type="button" className="m-3" disabled={!infoValid()} onClick={() => addProductHook()}>
                                Add Product
                            </Button>
                        </Form>
                        <Form className="custom-form py-3 my-1 d-flex flex-wrap w-50" style={{marginBottom: '13vh', height: 'fit-content'}}>
                            {
                                parameters && Object.entries(parameters).map(([key, value]) => (
                                    <div key={key} className="w-25 mx-1">
                                        <Form.Group controlId={`paramKey${key}`}>
                                            <Form.Control
                                                type="text"
                                                value={key}
                                                onChange={(e) => handleChangeOfKey(key, e.target.value)}
                                            />
                                            <Form.Control
                                                type="text"
                                                name="key"
                                                value={value}
                                                onChange={(e) => handleChangeOfParam(key, e)} />
                                        </Form.Group>
                                        <Button variant="danger" onClick={() => handleRemoveParam(key)}>Remove</Button>
                                        <hr />
                                    </div>
                                ))}
                            <Button variant="primary" onClick={handleAddParam} className="btn btn-primary w-100 h-25">Add Param</Button>
                            {
                                parametersException.map(ex => (
                                    <p style={{wordBreak: 'break-word', marginTop: '1em', color: 'white', fontSize: '1.1em', width: '75%'}} hidden={ex === ''}>{ex}</p>
                                ))
                            }
                        </Form>
                    </div>
                </Col>
                <Footer />
            </OutsideClickHandler>
        </div>
    )
}

export default AddProduct;