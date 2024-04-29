import {CustomerProduct} from "./CustomerProduct.ts";

export class CustomerOrderedProduct {
    product: CustomerProduct;
    productAmount: number;

    static build(orderedProducts: any): CustomerOrderedProduct[] {
        const products: CustomerOrderedProduct[] = [];

        for (let index = 0; index < orderedProducts.length; index++) {
            const product: CustomerOrderedProduct = new CustomerOrderedProduct();
            product.product = CustomerProduct.build(orderedProducts[index].product)
            product.productAmount = orderedProducts[index].productAmount;

            products.push(product)
        }

        return products;
    }
}