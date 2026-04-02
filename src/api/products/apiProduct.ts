import type {
  ProductResponse,
  SingleProductResponse,
} from "@/types/products.type";
import axiosProducts from "./axiosProducts";

export class ApiProduct {
  async getProducts(
    page: number = 1,
    limit: number = 10,
    category?: string,
    search?: string,
  ): Promise<ProductResponse> {
    const { data } = await axiosProducts.get<ProductResponse>("/", {
      params: {
        page,
        limit,
        category,
        search,
      },
    });
    return data;
  }

  async createProduct(formData: FormData): Promise<ProductResponse> {
    const { data } = await axiosProducts.post<ProductResponse>(
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

  async getProduct(id: string): Promise<SingleProductResponse> {
    const { data } = await axiosProducts.get<SingleProductResponse>(`/${id}`);
    return data;
  }

  async deleteImage(productId: string, publicId: string): Promise<void> {
    const { data } = await axiosProducts.delete(`/${productId}/image`, {
      data: { publicId },
    });
    return data;
  }

  async updateProduc(
    id: string,
    formData: FormData,
  ): Promise<SingleProductResponse> {
    const { data } = await axiosProducts.patch<SingleProductResponse>(
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

  async deleteProduct(id: string): Promise<void> {
    const { data } = await axiosProducts.delete(`/${id}`);
    return data;
  }
}

export const apiProduct = new ApiProduct();
