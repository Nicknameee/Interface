export class TransactionState {
    customerId: number;
    amount: number;
    sourceCurrency: string;
    status: string;
    authorized: boolean;
    settled: boolean;

    static build(transactionStateModel: {customerId: number, amount: number, sourceCurrency: string, status: string, authorized: boolean, settled: boolean}) {
        const transactionState: TransactionState = new TransactionState();
        transactionState.customerId = transactionStateModel.customerId;
        transactionState.amount = transactionStateModel.amount;
        transactionState.sourceCurrency = transactionStateModel.sourceCurrency;
        transactionState.status = transactionStateModel.status;
        transactionState.authorized = transactionStateModel.authorized;
        transactionState.settled = transactionStateModel.settled;

        return transactionState;
    }
}