import {OrderedProduct} from "./OrderedProduct";
import {OrderShipmentAddress} from "./OrderShipmentAddress";

export class CreateOrder {
    customerId: number;
    paymentType: string;
    paid: boolean;
    deliveryServiceType: string;
    orderedProducts: OrderedProduct[];
    orderShipmentAddress: OrderShipmentAddress;
    transactionId: string;
}