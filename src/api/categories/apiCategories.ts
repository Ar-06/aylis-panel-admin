import type { CategoryResponse } from "@/types/categories.type";
import axiosCategories from "./axiosCategory";

export class ApiCategories {
  async getCategories(): Promise<CategoryResponse> {
    const { data } = await axiosCategories.get<CategoryResponse>("/");
    return data;
  }
}

export const apiCategories = new ApiCategories();
