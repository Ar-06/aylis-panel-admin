export interface Category {
  id: string;
  name: string;
}

export interface ProductImage {
  id: string;
  url: string;
  publicId: string;
  productId?: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: string;
  images: ProductImage[];
  isAvailable: boolean;
  specs: Record<string, string>;
  category: Category;
  createdAt: string;
  updatedAt: string;
}

export interface MetaPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductResponse {
  message: string;
  data: Product[];
  meta: MetaPagination;
}

export interface SingleProductResponse {
  message: string;
  data: Product;
}