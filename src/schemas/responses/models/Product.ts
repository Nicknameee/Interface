export class Product {
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

    getParameter(productParameter: string): string | undefined {
        return this.parameters[productParameter];
    }

    static build(productModels: any[]) {
        const products: Product[] = [];

        for (let index = 0; index < productModels.length; index++) {
            const product: Product = new Product();
            product.id = productModels[index].id
            product.name = productModels[index].name
            product.brand = productModels[index].brand
            product.parameters = productModels[index].parameters
            product.description = productModels[index].description
            product.vendorId = productModels[index].vendorId
            product.productId = productModels[index].productId
            product.cost = productModels[index].cost
            product.currency = productModels[index].currency
            product.itemsLeft = productModels[index].itemsLeft
            product.blocked = productModels[index].blocked
            product.categoryId = productModels[index].categoryId
            product.introductionPictureUrl = productModels[index].introductionPictureUrl
            product.pictureUrls = productModels[index].pictureUrls
            product.marginRate = productModels[index].marginRate

            products.push(product)
        }

        return products;
    }
}