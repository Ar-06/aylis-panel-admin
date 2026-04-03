import axiosStats from "./axiosStats";
import type { StatsResponse } from "@/types/stats.type";

export class ApiStats {
  async getStatsDashboard(): Promise<StatsResponse> {
    const { data } = await axiosStats.get<StatsResponse>("/");
    return data;
  }
}

export const apiStats = new ApiStats();
