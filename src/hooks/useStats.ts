import { apiStats } from "@/api/stats/apiStats";
import type { StatsResponse } from "@/types/stats.type";
import { useEffect, useState } from "react";

export function useStats() {
  const [stats, setStats] = useState<StatsResponse>({
    totalProducts: 0,
    totalCategories: 0,
    latestUpdate: "",
    latestItemName: "",
    latestItemType: "",
    chartData: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiStats.getStatsDashboard();
      setStats(response);
    } catch (error) {
      console.log(error);
      setError("Error al cargar estadísticas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}
