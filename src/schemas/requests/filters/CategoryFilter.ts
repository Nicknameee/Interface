export class CategoryFilter {
  page: number | 1;
  size: number | 100;
  sortBy: string | "name";
  direction: string | "ASC";
  enabled: boolean;
  parentCategoryId: number | null;
  categoryId: string;

  constructor(
    page: number | 1,
    size: number | 100,
    sortBy: string | "name",
    direction: string | "ASC",
    enabled: boolean | null,
    parentCategoryId: number | null,
    categoryId: string
  ) {
    this.page = page;
    this.size = size;
    this.sortBy = sortBy;
    this.direction = direction;
    this.enabled = enabled;
    this.parentCategoryId = parentCategoryId;
    this.categoryId = categoryId;
  }

  static build(filteringBy: {
    page: any;
    size: any;
    sortBy: any;
    direction: any;
    enabled: any;
    parentCategoryId: any;
    categoryId: any;
  }) {
    return new CategoryFilter(
      filteringBy.page || 1,
      filteringBy.size || 100,
      filteringBy.sortBy || "name",
      filteringBy.direction || "ASC",
      filteringBy.enabled ?? null,
      filteringBy.parentCategoryId || null,
      filteringBy.categoryId || null
    );
  }

  formAsRequestParameters() {
    return {
      page: this.page,
      size: this.size,
      sortBy: this.sortBy,
      direction: this.direction,
      enabled: this.enabled,
      parentCategoryId: this.parentCategoryId,
      categoryId: this.categoryId,
    };
  }
}
