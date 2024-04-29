export class OrderFilter {
    page: number | 1;
    size: number | 100;
    sortBy: string | 'creationDate';
    direction: string | 'DESC';
    id: number | null;
    customerId: number | null;
    totalDeliveryCostFrom: number | null;
    totalDeliveryCostTo: number | null;
    orderNumber: string | null;
    orderedProductsCostFrom: number | null;
    orderedProductsCostTo: number | null;
    orderDateFrom: Date | null;
    orderDateTo: Date | null;
    orderStatuses: string[] | null;
    paymentTypes: string[] | null;
    processingOperatorIds: number[] | null;
    paid: boolean | null;
    lastChangedOrderDateFrom: Date | null;
    lastChangedOrderDateTo: Date | null;
    orderedProductIds: string[] | null;
    productNames: string[] | null;
    vendorIds: string[] | null;

    formAsRequestParameters() {
        return {
            page: this.page,
            size: this.size,
            sortBy: this.sortBy,
            direction: this.direction
        };
    }

    formAsRequestBody() {
        return {
            id: this.id,
            customerId: this.customerId,
            totalDeliveryCostFrom: this.totalDeliveryCostFrom,
            totalDeliveryCostTo: this.totalDeliveryCostTo,
            orderNumber: this.orderNumber,
            orderedProductsCostFrom: this.orderedProductsCostFrom,
            orderedProductsCostTo: this.orderedProductsCostTo,
            orderDateFrom: this.orderDateFrom,
            orderDateTo: this.orderDateTo,
            orderStatuses: this.orderStatuses,
            paymentTypes: this.paymentTypes,
            processingOperatorIds: this.processingOperatorIds,
            paid: this.paid,
            lastChangedOrderDateFrom: this.lastChangedOrderDateFrom,
            lastChangedOrderDateTo: this.lastChangedOrderDateTo,
            orderedProductIds: this.orderedProductIds,
            productNames: this.productNames,
            vendorIds: this.vendorIds
        };
    }

    static build(data: {customerId: number, number: string}) {
        const orderFilter: OrderFilter = new OrderFilter();
        orderFilter.customerId = data.customerId;
        orderFilter.orderNumber = data.number;

        return orderFilter;
    }
}