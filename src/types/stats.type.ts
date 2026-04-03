export interface ChartDataResponse {
  category: string;
  label: string;
  stock: number;
}

export interface StatsResponse {
  totalProducts: number;
  totalCategories: number;
  latestUpdate: string | null;
  latestItemName?: string;
  latestItemType?: string;
  chartData?: ChartDataResponse[];
}
