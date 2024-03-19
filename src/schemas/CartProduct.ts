import {CustomerProduct} from "./CustomerProduct";

export class CartProduct {
    id: number;
    name: string;
    productId: string;
    cost: number;
    currency: string;
    itemsBooked: number;
    categoryId: string;
    introductionPictureUrl: string;

    constructor(
        id: number,
        name: string,
        productId: string,
        cost: number,
        currency: string,
        itemsBooked: number,
        categoryId: string,
        introductionPictureUrl: string
    ) {
        this.id = id;
        this.name = name;
        this.productId = productId;
        this.cost = cost;
        this.currency = currency;
        this.itemsBooked = itemsBooked;
        this.categoryId = categoryId;
        this.introductionPictureUrl = introductionPictureUrl;
    }

    static getOfProduct(product: CustomerProduct) {
        let pictureUrl = product.introductionPictureUrl;

        if (!pictureUrl) {
            if (product.pictureUrls && product.pictureUrls.length > 0) {
                pictureUrl = product.pictureUrls[0];
            }
        }

        return new CartProduct(product.id, product.name, product.productId, product.cost, product.currency, 1, product.categoryId, pictureUrl);
    }
}