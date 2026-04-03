import { apiCategories } from "@/api/categories/apiCategories";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/hooks/useCategory";
import { Edit, ImageOff, Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Categories() {
  const { categories, loading, error, refetch } = useCategories();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Error al cargar categorías</p>
      </div>
    );
  }

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    try {
      setDeletingId(id);
      const response = await apiCategories.deleteCategory(id);
      toast.success(response.message);
      refetch();
    } catch (error) {
      console.error("Error original", error);
      toast.error("No se puedo eliminar la categoría");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="flex-1 space-y-6 p-4 md:p-8 bg-background">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Categorías
          </h2>
          <p className="text-muted-foreground">
            Gestiona las secciones principales de la tienda de Aylis Scrap
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-[200px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground border-2 border-dashed border-border rounded-xl bg-muted/10">
          <ImageOff className="w-12 h-12 mb-4 opacity-20" />
          <p className="text-xl font-medium text-foreground">Sin categorías</p>
          <p className="text-sm mt-1 mb-6">
            Aún no has creado ninguna categoría para tu tienda.
          </p>
          <Button variant="outline">
            <Link to="/admin/categories/new">
              <Plus className="w-4 h-4 mr-2" />
              Crear mi primera categoría
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-300 border-border/60 group"
            >
              <div className="relative aspect-square bg-muted border-b border-border/50 overflow-hidden">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageOff className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <Badge
                    variant="secondary"
                    className="bg-background/80 backdrop-blur-md shadow-sm border-0 font-medium text-xs"
                  >
                    {category.label}
                  </Badge>
                </div>
              </div>

              <CardHeader className="p-4 pb-2 flex-1">
                <CardTitle className="text-xl font-bold leading-tight line-clamp-1">
                  {category.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {category.description}
                </p>
              </CardHeader>

              <CardFooter className="p-4 pt-2 flex justify-between items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-2 border-border/60 hover:bg-primary/5"
                  onClick={() => navigate(`/admin/categories/${category.id}`)}
                >
                  <Edit className="w-4 h-4" />
                  Editar
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger
                    className={buttonVariants({
                      variant: "outline",
                      size: "icon",
                      className:
                        "shrink-0 border-destructive/20 text-destructive hover:bg-destructive hover:text-destructive-foreground",
                    })}
                  >
                    <Trash2 className="w-4 h-4" />
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Eliminar categoría?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Estas a punto de eliminar la categoría{" "}
                        <span className="font-bold text-foreground">
                          {category.name}
                        </span>
                        . Esta acción no se puede deshacer.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={deletingId === category.id}>
                        Cancelar
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={(e) => handleDelete(e, category.id)}
                        disabled={deletingId === category.id}
                        className="bg-red-500 hover:bg-red-600 text-white"
                      >
                        {deletingId === category.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : null}

                        {deletingId === category.id ? "Eliminando" : "Eliminar"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
