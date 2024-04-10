export class TransactionState {
    customerId: number;
    amount: number;
    sourceCurrency: string;
    status: string;
    authorized: boolean;
    settled: boolean;
}