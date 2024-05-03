export class UpdateProduct {
    productId: string;
    name: string;
    brand: string;
    parameters: { [key: string]: string };
    description: string;
    vendorId: string;
    cost: number;
    currency: string;
    itemsLeft: number;
    blocked: boolean;
    marginRate: number;
}