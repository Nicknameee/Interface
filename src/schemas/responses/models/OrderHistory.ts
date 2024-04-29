import {Order} from "./Order.ts";

export class OrderHistory {
    orderId: number;
    oldOrder: Order;
    updatedOrder: Order;
    iteration: number;
    updatedFields: string[];
    orderNumber: string;
    updateTime: string;

    static build(number: string, orderHistoryEntries: any[]): OrderHistory[] {
        const history: OrderHistory[] = [];

        for (const entry of orderHistoryEntries) {
            const orderHistoryEntry: OrderHistory = new OrderHistory();

            orderHistoryEntry.orderId = entry.orderId;
            orderHistoryEntry.oldOrder = Order.build(entry.oldOrder);
            orderHistoryEntry.updatedOrder = Order.build(entry.updatedOrder)
            orderHistoryEntry.iteration = entry.iteration
            orderHistoryEntry.updatedFields = entry.updatedFields
            orderHistoryEntry.orderNumber = number
            orderHistoryEntry.updateTime = entry.updateTime

            history.push(orderHistoryEntry)
        }

        return history;
    }

    isParamChanged(paramName: string): boolean {
        return this.updatedFields.includes(paramName);
    }
}