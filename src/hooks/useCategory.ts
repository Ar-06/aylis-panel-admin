import { apiCategories } from "@/api/categories/apiCategories";
import type { Category } from "@/types/categories.type";
import { useEffect, useState } from "react";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiCategories.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.log(error);
      const errorMessage = "Error al cargar categorías";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
  };
}
