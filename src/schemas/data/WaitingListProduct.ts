import {Product} from "../responses/models/Product.ts";

export class WaitingListProduct {
    id: number;
    name: string;
    productId: string;
    cost: number;
    currency: string;
    categoryId: string;
    introductionPictureUrl: string;

    constructor(
        id: number,
        name: string,
        productId: string,
        cost: number,
        currency: string,
        categoryId: string,
        introductionPictureUrl: string
    ) {
        this.id = id;
        this.name = name;
        this.productId = productId;
        this.cost = cost;
        this.currency = currency;
        this.categoryId = categoryId;
        this.introductionPictureUrl = introductionPictureUrl;
    }

    static getOfProduct(product: Product): WaitingListProduct {
        let pictureUrl = product.introductionPictureUrl;

        if (!pictureUrl) {
            if (product.pictureUrls && product.pictureUrls.length > 0) {
                pictureUrl = product.pictureUrls[0];
            }
        }

        return new WaitingListProduct(product.id, product.name, product.productId, product.cost, product.currency, product.categoryId, pictureUrl);
    }
}