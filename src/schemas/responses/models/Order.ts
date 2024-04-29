import {ShipmentAddress} from "./ShipmentAddress.ts";
import {CustomerOrderedProduct} from "./CustomerOrderedProduct.ts";
import {DeliveryServiceType} from "../../enums/DeliveryServiceType.ts";

export class Order {
     id: number;
     customerId: number;
     deliveryCost: number;
     number: string;
     orderedProductCost: number;
     creationDate: Date;
     status: string;
     paymentType: string;
     processingOperatorId: number;
     paid: boolean;
     lastUpdateDate: Date;
     orderedProducts: CustomerOrderedProduct[];
     shipmentAddress: ShipmentAddress;
     deliveryServiceType: string;
     transactionId: string;

     static build(orderResponseModel: any): Order {
          const order: Order = new Order();
          order.id = orderResponseModel.id;
          order.customerId = orderResponseModel.customerId;
          order.deliveryCost = orderResponseModel.deliveryCost;
          order.number = orderResponseModel.number;
          order.orderedProductCost = orderResponseModel.orderedProductCost;
          order.creationDate = orderResponseModel.creationDate;
          order.status = orderResponseModel.status;
          order.paymentType = orderResponseModel.paymentType;
          order.processingOperatorId = orderResponseModel.processingOperatorId;
          order.paid = orderResponseModel.paid;
          order.lastUpdateDate = orderResponseModel.lastUpdateDate;
          order.orderedProducts = CustomerOrderedProduct.build(orderResponseModel.orderedProducts)

          if (orderResponseModel.shipmentAddress !== undefined && orderResponseModel.shipmentAddress !== null && order.deliveryServiceType !== DeliveryServiceType.NONE.toString()) {
               order.shipmentAddress = ShipmentAddress.build(orderResponseModel.shipmentAddress);
          }

          order.deliveryServiceType = orderResponseModel.deliveryServiceType;
          order.transactionId = orderResponseModel.transactionId;

          return order;
     }
}