import {Order} from "./Order.ts";
import {TransactionState} from "./TransactionState.ts";

export class CustomerOrder {
    order: Order;
    transaction: TransactionState;

    static build(customerOrderModel: any): CustomerOrder {
        const customerOrder: CustomerOrder = new CustomerOrder();

        customerOrder.order = Order.build(customerOrderModel.order);

        if (customerOrderModel.transaction !== undefined && customerOrderModel.transaction !== null) {
            customerOrder.transaction = TransactionState.build(customerOrderModel.transaction);
        }

        return customerOrder;
    }
}