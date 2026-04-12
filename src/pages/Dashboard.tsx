import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Switch } from "@/components/ui/switch";
import { useSetting } from "@/hooks/useSetting";
import { useStats } from "@/hooks/useStats";
import { formatDate } from "@/lib/format-date";
import {
  AlertCircle,
  CalendarSync,
  FolderTree,
  Loader2,
  Package,
  Store,
} from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

export default function Dashboard() {
  const { stats, loading, error } = useStats();
  const { isOpen, isLoading, isToggling, toggleAgenda } = useSetting();

  const dynamicChartData = stats.chartData?.map((item, index) => ({
    category: item.category,
    stock: item.stock,
    fill: `var(--chart-${(index % 5) + 1})`,
  }));

  const dynamicChartConfig = {
    stock: { label: "Productos", color: "var(--primary)" },
  } as ChartConfig;

  stats.chartData?.forEach((item, index) => {
    dynamicChartConfig[item.category] = {
      label: item.category,
      color: `var(--chart-${(index % 5) + 1})`,
    };
  });

  const statsData = [
    {
      title: "Total Productos",
      value: stats.totalProducts,
      description: "Productos activos en la web",
      icon: Package,
      color: "bg-primary/10 text-primary",
    },
    {
      title: "Categorías",
      value: stats.totalCategories,
      description: "Secciones organizadas",
      icon: FolderTree,
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      title: "Última Edición",
      value: formatDate(stats.latestUpdate || ""),
      description:
        stats.latestItemName && stats.latestUpdate
          ? `${stats.latestItemType}: ${stats.latestItemName}`
          : "No hay modificaciones",
      icon: CalendarSync,
      color: "bg-orange-500/10 text-orange-500",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2">Cargando métricas...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-destructive">
        <p>¡Ups! Ocurrió un error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <h2 className="text-3xl font-bold tracking-tight">Hola, Lía 👋</h2>

        <Card
          className={`flex flex-row items-center justify-between gap-4 px-4 py-2 w-full sm:w-auto transition-all duration-300 shadow-sm border ${
            isOpen
              ? "bg-emerald-50/40 border-emerald-200"
              : "bg-orange-50/40 border-orange-200"
          }`}
        >
          <div className="flex flex-row items-center gap-3">
            <div
              className={`p-2 rounded-full transition-colors shrink-0 ${
                isOpen
                  ? "bg-emerald-100 text-emerald-600"
                  : "bg-orange-100 text-orange-600"
              }`}
            >
              {isOpen ? (
                <Store className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
            </div>

            <div className="flex flex-col min-w-[130px]">
              <p className="text-[13px] font-semibold text-gray-900 leading-none mb-1">
                Estado de la Agenda
              </p>
              <p
                className={`text-[10px] font-bold uppercase tracking-wider ${isOpen ? "text-emerald-600" : "text-orange-600"}`}
              >
                {isLoading ? "Cargando..." : isOpen ? "Abierta" : "Llena"}
              </p>
            </div>
          </div>

          <div className="pl-3 py-1 border-l border-foreground/10 flex items-center shrink-0">
            <Switch
              checked={isOpen}
              onCheckedChange={toggleAgenda}
              disabled={isLoading || isToggling}
              className={isOpen ? "data-[state=checked]:bg-emerald-500" : ""}
            />
          </div>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {statsData.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg transition-colors ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div
                className={`font-bold ${typeof stat.value === "string" && stat.value.length > 5 ? "text-xl" : "text-2xl"}`}
              >
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="w-full">
        <Card className="flex flex-col shadow-sm border-border/50">
          <CardHeader className="items-center pb-0">
            <CardTitle>Distribución de Catálogo</CardTitle>
            <CardDescription>
              Porcentaje de stock por categorías
            </CardDescription>
          </CardHeader>

          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={dynamicChartConfig}
              className="mx-auto aspect-square max-h-87.5"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={dynamicChartData}
                  dataKey="stock"
                  nameKey="category"
                  innerRadius={80}
                  strokeWidth={5}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-4xl font-bold"
                            >
                              {stats.totalProducts}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground text-sm"
                            >
                              Productos Total
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 px-6 pb-6 pt-6 border-t border-border/50 mt-4 bg-muted/10">
            {dynamicChartData?.map((data) => {
              const config = dynamicChartConfig[data.category];
              if (!config) return null;

              const percentage =
                stats.totalProducts > 0
                  ? Math.round((data.stock / stats.totalProducts) * 100)
                  : 0;

              return (
                <div key={data.category} className="flex items-center gap-2">
                  <div
                    className="size-3 rounded-full"
                    style={{
                      backgroundColor: config.color,
                    }}
                  />
                  <span className="text-base font-medium text-foreground capitalize">
                    {config.label}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    ({data.stock} prods - {percentage}%)
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
