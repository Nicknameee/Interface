import {AddressComponent} from "../../enums/AddressComponent.ts";

export class ShipmentAddress {
    id: number | null;
    orderId: number | null;
    customerId: number | null;
    address: any | null;

    static customerAllowedFields = [
        AddressComponent.COUNTRY_RECIPIENT,
        AddressComponent.REGION_RECIPIENT,
        AddressComponent.CITY_RECIPIENT,
        AddressComponent.POST_DEPARTMENT_NUMBER_RECIPIENT,
        AddressComponent.STREET_RECIPIENT,
        AddressComponent.BUILDING_RECIPIENT
    ];

    static build(shipmentAddressModel: any): ShipmentAddress {
        const shipmentAddress: ShipmentAddress = new ShipmentAddress();
        shipmentAddress.id = shipmentAddressModel.id;
        shipmentAddress.orderId = shipmentAddressModel.orderId;
        shipmentAddress.customerId = shipmentAddressModel.customerId;
        shipmentAddress.address = shipmentAddressModel.address;

        return shipmentAddress;
    }

    static getAddressLocaleByName(name: string) {
        for (const key in AddressComponent) {
            if (AddressComponent.hasOwnProperty(name) && key === name) {
                return AddressComponent[key];
            }
        }
    }

    static customerViewAllowed(name: string): boolean {
        return ShipmentAddress.customerAllowedFields.includes(AddressComponent[name])
    }
}