export class ProductFilter {
    page: number | 1;
    size: number | 100;
    sortBy: string | 'parentCategoryId';
    direction: string | 'ASC';
    name: string | null;
    brand: string | null;
    vendorId: string | null;
    productIds: string[] | null;
    priceFrom: number | null;
    priceTo: number | null;
    isPresent: boolean | null;
    isBlocked: boolean | null;
    categoryId: string | null;

    constructor(
        page: number | 1,
        size: number | 100,
        sortBy: string | 'parentCategoryId',
        direction: string | 'ASC',
        name: string | null,
        brand: string | null,
        vendorId: string | null,
        productIds: string[] | null,
        priceFrom: number | null,
        priceTo: number | null,
        isPresent: boolean | null,
        isBlocked: boolean | null,
        categoryId: string | null
    ) {
        this.page = page;
        this.size = size;
        this.sortBy = sortBy;
        this.direction = direction;
        this.name = name;
        this.brand = brand;
        this.vendorId = vendorId;
        this.productIds = productIds;
        this.priceFrom = priceFrom;
        this.priceTo = priceTo;
        this.isPresent = isPresent;
        this.isBlocked = isBlocked;
        if (categoryId) {
            this.categoryId = categoryId;
        }
    }

    static build(filteringBy: { page: any; size: any; sortBy: any; direction: any; name: any; brand: any; vendorId: any; productIds: any; priceFrom: any; priceTo: any; isPresent: any; isBlocked: any; categoryId: any;}) {
        return new ProductFilter(filteringBy.page || 1,
            filteringBy.size || 100,
            filteringBy.sortBy || 'cost',
            filteringBy.direction || 'ASC',
            filteringBy.name || null,
            filteringBy.brand || null,
            filteringBy.vendorId || null,
            filteringBy.productIds || null,
            filteringBy.priceFrom || null,
            filteringBy.priceTo || null,
            filteringBy.isPresent || null,
            filteringBy.isBlocked || null,
            filteringBy.categoryId || null
            );
    }

    formAsRequestParameters() {
        return {
            page: this.page,
            size: this.size,
            sortBy: this.sortBy,
            direction: this.direction
        };
    }

    formAsRequestBody() {
        return {
            name: this.name,
            brand: this.brand,
            vendorId: this.vendorId,
            productIds: this.productIds,
            priceFrom: this.priceFrom,
            priceTo: this.priceTo,
            isPresent: this.isPresent,
            isBlocked: this.isBlocked,
            categoryId: this.categoryId
        };
    }
}
