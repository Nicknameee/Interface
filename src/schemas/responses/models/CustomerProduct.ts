export class CustomerProduct {
    name: string;
    brand: string;
    productId: string;
    cost: number;
    currency: string;

    static build(product: any): CustomerProduct {
        const customerProduct: CustomerProduct = new CustomerProduct();
        customerProduct.name = product.name;
        customerProduct.brand = product.brand
        customerProduct.productId = product.productId
        customerProduct.cost = product.cost
        customerProduct.currency = product.currency

        return customerProduct;
    }
}