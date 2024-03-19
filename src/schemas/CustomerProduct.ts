export class CustomerProduct {
    id: number;
    name: string;
    brand: string;
    parameters: { [key: string]: string };
    description: string;
    vendorId: string;
    productId: string;
    cost: number;
    currency: string;
    itemsLeft: number;
    blocked: boolean;
    categoryId: string;
    introductionPictureUrl: string;
    pictureUrls: string[];
    marginRate: number;

    constructor(
        id: number,
        name: string,
        brand: string,
        parameters: { [key: string]: string },
        description: string,
        vendorId: string,
        productId: string,
        cost: number,
        currency: string,
        itemsLeft: number,
        blocked: boolean,
        categoryId: string,
        introductionPictureUrl: string,
        pictureUrls: string[],
        marginRate: number
    ) {
        this.id = id;
        this.name = name;
        this.brand = brand;
        this.parameters = parameters;
        this.description = description;
        this.vendorId = vendorId;
        this.productId = productId;
        this.cost = cost;
        this.currency = currency;
        this.itemsLeft = itemsLeft;
        this.blocked = blocked;
        this.categoryId = categoryId;
        this.introductionPictureUrl = introductionPictureUrl;
        this.pictureUrls = pictureUrls;
        this.marginRate = marginRate;
    }

    getParameter(productParameter: string): string | undefined {
        return this.parameters[productParameter];
    }
}