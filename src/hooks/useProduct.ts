import { apiProduct } from "@/api/products/apiProduct";
import type { Product, MetaPagination } from "@/types/products.type";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export function useProducts(
  limit: number = 10,
  category?: string,
  search?: string,
) {
  const [products, setProducts] = useState<Product[]>([]);

  const [meta, setMeta] = useState<MetaPagination | null>(null);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(
    async (currentPage: number) => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiProduct.getProducts(
          currentPage,
          limit,
          category,
          search,
        );
        setProducts(response.data);
        setMeta(response.meta);
      } catch (error) {
        console.log(error);
        const errorMessage = "Error al cargar productos";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [limit, category, search],
  );

  useEffect(() => {
    setPage(1);
    fetchProducts(page);
  }, [page, fetchProducts]);

  const nextPage = () => {
    if (meta && page < meta.totalPages) {
      setPage(page + 1);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return {
    products,
    meta,
    loading,
    error,
    page,
    nextPage,
    prevPage,
    refetch: () => fetchProducts(page),
  };
}
