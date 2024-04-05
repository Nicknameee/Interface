import {ADDRESS_PARTS} from '../constants/constants'
export class OrderShipmentAddress {
    address: Map<string, string>;

    constructor(address: Map<string, string>) {
        address.forEach((value, key) => {
            if (!ADDRESS_PARTS.includes(key)) {
                throw new Error('Unknown address part passed ' + key.toString())
            }
        });

        this.address = address;
    }
}