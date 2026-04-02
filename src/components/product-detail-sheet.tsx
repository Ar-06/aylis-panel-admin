import { Separator } from "@/components/ui/separator";
import type { Product } from "@/types/products.type";
import { CheckCircle2, Frown, XCircle } from "lucide-react";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";

interface ProductDetailSheetProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductDetailSheet = ({
  product,
  isOpen,
  onClose,
}: ProductDetailSheetProps) => {
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Frown className="text-red-500 w-5 h-5" />
        <span className="text-xl">Producto no encontrado</span>
      </div>
    );
  }

  const specsList = product.specs
    ? Object.entries(product.specs).map(([key, value]) => ({ key, value }))
    : [];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl flex flex-col p-0">
        <ScrollArea className="h-full w-full">
          <div className="space-y-8 p-6">
            <SheetHeader className="space-y-3 text-left">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <SheetTitle className="text-2xl font-bold leading-tight">
                    {product.title}
                  </SheetTitle>
                  <SheetDescription className="text-sm font-medium mt-1">
                    Categoría:{" "}
                    <span className="capitalize text-foreground">
                      {product.category.name}
                    </span>
                  </SheetDescription>
                </div>
                <Badge
                  variant={product.isAvailable ? "default" : "destructive"}
                  className="flex gap-1 items-center whitespace-nowrap"
                >
                  {product.isAvailable ? (
                    <>
                      <CheckCircle2 className="w-3 h-3" />
                      Disponible
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3 h-3" /> Agotado
                    </>
                  )}
                </Badge>
              </div>
              <div className="text-3xl font-extrabold text-primary">
                S/ {Number(product.price).toFixed(2)}
              </div>
            </SheetHeader>

            <Separator />

            <div className="space-y-3">
              <h3 className="font-semibold text-lg tracking-tight">Galería</h3>
              {product.images && product.images.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {product.images.map((img, idx) => (
                    <div
                      key={img.id}
                      className={`relative overflow-hidden rounded-xl border border-border bg-muted/20 ${idx === 0 ? "col-span-2 aspect-video" : "aspect-square"}`}
                    >
                      <img
                        src={img.url}
                        alt={`Producto ${idx + 1}`}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full h-32 flex items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 text-muted-foreground text-sm">
                  Sin imágenes disponibles
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-3">
              <h3 className="font-semibold text-lg tracking-tight">
                Descripción
              </h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {product.description}
              </p>
            </div>

            {specsList.length > 0 && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg tracking-tight">
                    Específicaciones
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    {specsList.map((spec, index) => (
                      <div
                        key={index}
                        className="flex justify-between py-2 border-b border-border/50 last:border-0 text-sm"
                      >
                        <span className="font-medium text-muted-foreground">
                          {spec.key}
                        </span>
                        <span className="text-foreground text-right">
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="pt-6 flex justify-between text-xs text-muted-foreground/70">
              <span>
                Añadido: {new Date(product.createdAt).toLocaleDateString()}
              </span>
              <span>
                Actualizado: {new Date(product.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
