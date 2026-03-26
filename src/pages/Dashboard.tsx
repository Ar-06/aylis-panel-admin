import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarSync, FolderTree, Package } from "lucide-react";

export default function Dashboard() {
  const stats = [
    {
      title: "Total Productos",
      value: "124",
      description: "Productos activos en la web",
      icon: Package,
    },
    {
      title: "Categorías",
      value: "12",
      description: "Secciones organizadas",
      icon: FolderTree,
    },
    {
      title: "Última Edición",
      value: "Hace 2 horas",
      description: "Álbum de fotos vintage",
      icon: CalendarSync,
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
              <stat.icon className="h-4 w-4 text-muted-foreground" />
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Resumen de Actividad</CardTitle>
          </CardHeader>
          <CardContent className="h-[200px] flex items-center justify-center border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">
              Próximamente: Gráfico de distribución
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
