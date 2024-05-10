import React, {useState} from "react";
import {getNovaPostCities, getNovaPostWarehouses} from "../../../index";
import {FormCheck, FormGroup, ListGroup, ListGroupItem} from "react-bootstrap";
import {DELIVERY_SERVICE_TYPE} from "../../../constants/constants";
import {useLanguage} from "../../../contexts/language/language-context";

const DeliveryAddress = ({country, deliveryData, setDeliveryTypeExt}) => {
    const [deliveryDetails, setDeliveryDetails] = useState('');
    const [novaPostCities, setNovaPostCities] = useState([]);
    const [novaPostDepartments, setNovaPostDepartments] = useState([]);
    const [searchCityString, setSearchCityString] = useState('')
    const [deliveryType, setDeliveryType] = useState('NONE');
    const [cityInputFocused: boolean, setCityInputIsFocused] = useState(false);
    const [warehouseInputFocused: boolean, setWarehouseInputIsFocused] = useState(false);

    const { language, setLanguage } = useLanguage();

    const handleCitySearchStringChange = (e) => {
        setSearchCityString(e.target.value)
        console.log('City change hook')
        setNovaPostCities([])
        setNovaPostCities(getNovaPostCities(e.target.value))
    }

    const handleCityChange = async (city) => {
        deliveryData.cityRecipient = city.Description;
        deliveryData.regionRecipient = city.AreaDescription;
        setSearchCityString(city.Description)
        setNovaPostDepartments(await getNovaPostWarehouses(city.Description))
        setCityInputIsFocused(false)
    };

    const handleDeliveryPointChangeNova = (deliveryPoint) => {
        setDeliveryDetails(deliveryPoint.Description)
        deliveryData.postDepartmentNumberRecipient = deliveryPoint.Number;
        deliveryData.postDepartmentTypeRecipient = deliveryPoint.CategoryOfWarehouse;
        deliveryData.postDepartmentIdRecipient = deliveryPoint.TypeOfWarehouse;
        let address = deliveryPoint.ShortAddress.split(',');
        deliveryData.streetRecipient = address[1].trim();
        deliveryData.buildingRecipient = address[address.length - 1].trim();
        setWarehouseInputIsFocused(false)
    };

    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;
        if (checked) {
            setDeliveryTypeExt(value);
            setDeliveryType(value);
        }
    };
    const renderDeliveryForm = () => {
        switch (deliveryType) {
            case 'NOVA_POST': {
                return  (
                    <div className="w-100 d-flex justify-content-center flex-wrap">
                        <div className="position-relative w-75 d-flex flex-wrap justify-content-center">
                            <input className="w-100 search-input"
                                   type="text"
                                   id="novaPostCitySearch"
                                   placeholder={ language === 'EN' ? "Search for cities..." : 'Знайти місто...'}
                                   value={searchCityString}
                                   onClick={() => {}}
                                   onChange={handleCitySearchStringChange}
                                   onFocus={() => setCityInputIsFocused(true)}/>
                                <ListGroup style={{ maxHeight: '190px', overflowY: 'auto' }} className="w-100" hidden={!cityInputFocused} id="novaPostCityList">
                                    {novaPostCities.map((city) => (
                                        <ListGroupItem
                                            style={{cursor: 'pointer', width: '100%'}}
                                            key={crypto.randomUUID()}
                                            onClick={() => handleCityChange(city)}>
                                            {city.Description}
                                        </ListGroupItem>
                                    ))}
                                </ListGroup>
                        </div>

                        {novaPostDepartments.length > 0 && (
                            <div className="w-75 my-1 d-flex flex-wrap justify-content-center">
                                <input className="w-100 search-input"
                                       type="text"
                                       placeholder={ language === 'EN' ? "Search for warehouses..." : 'Знайти місце доставки...'}
                                       value={deliveryDetails}
                                       readOnly={true}
                                       onFocus={() => setWarehouseInputIsFocused(true)}/>
                                <ListGroup style={{ maxHeight: '190px', overflowY: 'auto' }} className="w-100" hidden={!warehouseInputFocused}>
                                    {novaPostDepartments.map((department) => (
                                        <ListGroupItem
                                            style={{cursor: 'pointer', width: '100%'}}
                                            key={crypto.randomUUID()}
                                            onClick={() => handleDeliveryPointChangeNova(department)}>
                                            {department.Description}
                                        </ListGroupItem>
                                    ))}
                                </ListGroup>
                            </div>
                        )}
                    </div>
                );
            }
            default: {
                return (
                    <div className="w-100 d-flex justify-content-center flex-wrap">
                        <h5>
                            {
                                language === 'EN' ? 'No delivery, order must be taken at pickup point' : 'Доставка необрана, замовлення можна забрати у пункті видачі лише'
                            }
                        </h5>
                    </div>
                )
            }
        }
    };

    return (
      <div>
        <FormGroup className="w-100 d-flex flex-wrap justify-content-center align-items-center">
            {DELIVERY_SERVICE_TYPE.map((option: string) => (
                <FormCheck
                    className="w-50"
                    key={option}
                    id={option}
                    label={option}
                    value={option}
                    checked={deliveryType === option}
                    onChange={handleCheckboxChange}
                />
            ))}
        </FormGroup>
          {
              renderDeliveryForm()
          }
      </div>
    );
}

export default DeliveryAddress;