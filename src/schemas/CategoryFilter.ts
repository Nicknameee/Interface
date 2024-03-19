export class CategoryFilter {
    page: number | 1;
    size: number | 100;
    sortBy: string | 'parentCategoryId';
    direction: string | 'ASC';
    enabled: boolean;
    parentCategoryId: number | null;

    constructor(
        page: number | 1,
        size: number | 100,
        sortBy: string | 'parentCategoryId',
        direction: string | 'ASC',
        enabled: boolean | null,
        parentCategoryId: number | null
    ) {
        this.page = page;
        this.size = size;
        this.sortBy = sortBy;
        this.direction = direction;
        this.enabled = enabled;
        this.parentCategoryId = parentCategoryId;
    }

    static build(filteringBy: { page: any; size: any; sortBy: any; direction: any; enabled: any; parentCategoryId: any; }) {
        return new CategoryFilter(filteringBy.page || 1, filteringBy.size || 100, filteringBy.sortBy || 'parentCategoryId',
            filteringBy.direction || 'ASC',
            filteringBy.enabled || null,
            filteringBy.parentCategoryId || null);
    }
}