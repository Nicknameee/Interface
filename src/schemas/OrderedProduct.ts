export class OrderedProduct {
    productId: string;
    amount: number;

    constructor(productId: string, amount: number) {
        if (amount < 1) {
            throw new Error('Invalid amount of oredered products')
        }

        this.productId = productId;
        this.amount = amount;
    }
}