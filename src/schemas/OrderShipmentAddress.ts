import {ADDRESS_PARTS} from '../constants/constants'

export class OrderShipmentAddress {
    address: any;

    static build(address: Map<string, string>): OrderShipmentAddress {
        let orderShipmentAddress: OrderShipmentAddress = new OrderShipmentAddress();
        orderShipmentAddress.address = new Map();

        address.forEach((value: string, key: string): void => {
            if (!ADDRESS_PARTS.includes(key)) {
                console.log('Unknown address part passed ' + key.toString())
            }

            orderShipmentAddress.address[key] = value ? value : null;
        });

        return orderShipmentAddress;
    }
}