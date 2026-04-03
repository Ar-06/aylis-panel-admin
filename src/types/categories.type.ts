export interface Category {
  id: string;
  name: string;
  label: string;
  description: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryResponse {
  message: string;
  data: Category[];
}

export interface SingleCategoryResponse {
  message: string;
  data: Category;
}
