export class Category {
    id: number;
    name: string;
    categoryId: string;
    parentCategoryId: string | null;
    pictureUrl: string | null;
    enabled: boolean;

    constructor(
        id: number,
        name: string,
        categoryId: string,
        parentCategoryId: string | null,
        pictureUrl: string | null,
        enabled: boolean
    ) {
        this.id = id;
        this.name = name;
        this.categoryId = categoryId;
        this.parentCategoryId = parentCategoryId;
        this.pictureUrl = pictureUrl;
        this.enabled = enabled;
    }
}
