import type {
  CategoryResponse,
  SingleCategoryResponse,
} from "@/types/categories.type";
import axiosCategories from "./axiosCategory";

export class ApiCategories {
  async createCategory(formData: FormData): Promise<CategoryResponse> {
    const { data } = await axiosCategories.post<CategoryResponse>(
      "/create",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return data;
  }

  async getCategories(): Promise<CategoryResponse> {
    const { data } = await axiosCategories.get<CategoryResponse>("/");
    return data;
  }

  async deleteCategory(id: string): Promise<CategoryResponse> {
    const { data } = await axiosCategories.delete<CategoryResponse>(
      `/delete/${id}`,
    );
    return data;
  }

  async getCategoryById(id: string): Promise<SingleCategoryResponse> {
    const { data } = await axiosCategories.get<SingleCategoryResponse>(
      `/${id}`,
    );
    return data;
  }

  async updateCategory(
    id: string,
    formData: FormData,
  ): Promise<SingleCategoryResponse> {
    const { data } = await axiosCategories.patch<SingleCategoryResponse>(
      `/update/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return data;
  }
}

export const apiCategories = new ApiCategories();
