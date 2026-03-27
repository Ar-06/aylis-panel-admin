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
import { CalendarSync, FolderTree, Package } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

export default function Dashboard() {
  const chartData = [
    { category: "álbumes", stock: 35, fill: "var(--chart-1)" },
    { category: "agendas", stock: 25, fill: "var(--chart-2)" },
    { category: "libretas", stock: 20, fill: "var(--chart-3)" },
    { category: "cajas", stock: 15, fill: "var(--chart-4)" },
    { category: "otros", stock: 5, fill: "var(--chart-5)" },
  ];

  const chartConfig = {
    stock: { label: "Stock", color: "var(--primary)" },
    álbumes: { label: "Álbumes", color: "var(--chart-1)" },
    agendas: { label: "Agendas", color: "var(--chart-2)" },
    libretas: { label: "Libretas", color: "var(--chart-3)" },
    cajas: { label: "Cajas", color: "var(--chart-4)" },
    otros: { label: "Otros", color: "var(--chart-5)" },
  } satisfies ChartConfig;

  const stats = [
    {
      title: "Total Productos",
      value: "124",
      description: "Productos activos en la web",
      icon: Package,
      color: "bg-primary/10 text-primary",
    },
    {
      title: "Categorías",
      value: "12",
      description: "Secciones organizadas",
      icon: FolderTree,
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      title: "Última Edición",
      value: "Hace 2 horas",
      description: "Álbum de fotos vintage",
      icon: CalendarSync,
      color: "bg-orange-500/10 text-orange-500",
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Hola, Lía 👋</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
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
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
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
              config={chartConfig}
              className="mx-auto aspect-square max-h-87.5"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={chartData}
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
                              124
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
            {chartData.map((data) => {
              const categoryKey = data.category as keyof typeof chartConfig;
              return (
                <div key={data.category} className="flex items-center gap-2">
                  <div
                    className="size-3 rounded-full"
                    style={{ backgroundColor: chartConfig[categoryKey].color }}
                  />
                  <span className="text-base font-medium text-foreground capitalize">
                    {chartConfig[categoryKey].label}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    ({data.stock}%)
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
