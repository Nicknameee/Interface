export class Transaction {
    id: number;
    customerId: number;
    amount: number;
    sourceCurrency: string;
    acquiringCurrency: string;
    reference: string;
    status: string;
    issuedAt: Date;
    merchantId: string;
    transactionId: string;
    authorizationCode: string;
    acquireAuthorizationCode: string;
    transactionProcessingCountry: string;
    transactionType: string;
    transactionAlias: string;
    expiration: string;
    pan: string;
    settledAt: Date;
}