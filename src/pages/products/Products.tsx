import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";
import { ProductDetailSheet } from "@/components/product-detail-sheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCategories } from "@/hooks/useCategory";
import { useProducts } from "@/hooks/useProduct";
import type { Product } from "@/types/products.type";
import { Edit, Eye, PackageOpen, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Products() {
  const { categories } = useCategories();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isViewSheetOpen, setIsViewSheetOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const categoryFilter =
    selectedCategory !== "all" ? selectedCategory : undefined;
  const { products, loading, error, refetch, page, meta, nextPage, prevPage } =
    useProducts(10, categoryFilter, debouncedSearch);

  const displayCategoryName =
    selectedCategory === "all"
      ? "Todas"
      : categories.find((c) => c.id === selectedCategory)?.name || "Categoría";

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsViewSheetOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="animate-pulse text-muted-foreground">
          Cargando inventario...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-destructive font-medium">{error}</p>
        <button onClick={refetch} className="text-primary hover:underline">
          Intentar de nuevo
        </button>
      </div>
    );
  }

  return (
    <>
      <main className="flex-1 space-y-6 p-4 md:p-8 bg-background">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Inventario de Productos
          </h2>
          <p>Gestiona tu catálogo, precios y disponbilidad de materiales.</p>
        </div>

        <Card className="border-border shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative w-full flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre..."
                  className="pl-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="w-full md:w-auto md:min-w-45">
                <Select
                  value={selectedCategory}
                  onValueChange={(value) => setSelectedCategory(value || "all")}
                >
                  <SelectTrigger className="w-full max-w-48">
                    <SelectValue placeholder="Categoría">
                      <span className="capitalize">{displayCategoryName}</span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="all">Todas</SelectItem>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          <span className="capitalize">{c.name}</span>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">
              Mostrando {meta?.total} de {products.length} productos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <PackageOpen className="w-10 h-10 mb-4 opacity-10" />
                <p className="text-lg font-medium">
                  No hay productos que coincidan
                </p>
                <p className="text-sm">
                  Prueba ajustando tus filtros de búsqueda.
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow className="bg-muted/5 hover:bg-transparent">
                        <TableHead className="w-20 pl-6">Imagen</TableHead>
                        <TableHead className="min-w-50">Producto</TableHead>
                        <TableHead className="hidden sm:table-cell">
                          Categoría
                        </TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Precio</TableHead>
                        <TableHead className="text-center w-35 pr-6">
                          Acciones
                        </TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {products.map((p) => (
                        <TableRow
                          key={p.id}
                          className="hover:bg-muted/5 transition-colors"
                        >
                          <TableCell className="pl-6">
                            {p.images && p.images.length > 0 ? (
                              <img
                                src={p.images[0]?.url}
                                alt={`Imagen de ${p.title}`}
                                className="w-10 h-10 rounded-md object-cover border border-border shadow-sm"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center border border-border">
                                <PackageOpen className="w-5 h-5 text-muted-foreground/40" />
                              </div>
                            )}
                          </TableCell>

                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-semibold text-foreground leading-none mb-1">
                                {p.title}
                              </span>
                              <span className="text-xs text-muted-foreground line-clamp-2 max-w-[200px] sm:max-w-[300px] whitespace-normal mt-1">
                                {p.description}
                              </span>
                            </div>
                          </TableCell>

                          <TableCell className="hidden sm:table-cell">
                            <span className="inline-flex items-center rounded-full bg-secondary/50 px-2.5 py-0.5 text-xs font-medium text-secondary-foreground capitalize">
                              {p.category.name}
                            </span>
                          </TableCell>

                          <TableCell>
                            {p.isAvailable ? (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-600">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                                Disponible
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-2 py-1 text-xs font-medium text-rose-600">
                                <span className="h-1.5 w-1.5 rounded-full bg-rose-600" />
                                Sin materiales
                              </span>
                            )}
                          </TableCell>

                          <TableCell className="text-right font-medium">
                            S/ {Number(p.price).toFixed(2)}
                          </TableCell>

                          <TableCell className="py-3 px-4 text-center space-x-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:text-yellow-600"
                              onClick={() => handleViewProduct(p)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:text-blue-600"
                              onClick={() =>
                                navigate(`/admin/products/${p.id}`)
                              }
                            >
                              <Edit className="w-4 h-4" />
                            </Button>

                            <DeleteConfirmationDialog
                              idProduct={p.id}
                              onDeleted={() => refetch()}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {meta && meta.totalPages > 1 && (
                  <div className="p-4 border-t bg-muted/5">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={prevPage}
                            className={`cursor-pointer ${page === 1 ? "pointer-events-none opacity-50" : ""}`}
                          />
                        </PaginationItem>

                        <PaginationItem className="hidden xs:block">
                          <PaginationLink
                            isActive
                            className="bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>

                        <PaginationItem className="text-xs text-muted-foreground px-2">
                          de {meta.totalPages}
                        </PaginationItem>

                        <PaginationItem>
                          <PaginationNext
                            onClick={nextPage}
                            className={`cursor-pointer ${page === meta.totalPages ? "pointer-events-none opacity-50" : ""}`}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </main>

      <ProductDetailSheet
        product={selectedProduct}
        isOpen={isViewSheetOpen}
        onClose={() => setIsViewSheetOpen(false)}
      />
    </>
  );
}
