import { apiProduct } from "@/api/products/apiProduct";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useCategories } from "@/hooks/useCategory";
import {
  updateProductSchema,
  type UpdateProductFormValues,
} from "@/schemas/product.schema";
import type { ProductImage } from "@/types/products.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import {
  ImageIcon,
  Loader2,
  PackageCheck,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { categories } = useCategories();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [previews, setPreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<ProductImage[]>([]);
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<UpdateProductFormValues>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      categoryId: "",
      isAvailable: true,
      specs: [{ key: "", value: "" }],
      images: [],
    },
  });

  const watchCategoryId = watch("categoryId");
  const displayCategoryName =
    categories.find((c) => c.id === watchCategoryId)?.name ||
    "Seleccione una categoría";

  const { fields, append, remove } = useFieldArray({
    control,
    name: "specs",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const currentImages = watch("images") || [];

    if (existingImages.length + currentImages.length + newFiles.length > 4) {
      toast.error("¡Máximo de 4 imágenes permitidas en total!");
      return;
    }

    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    const updatedImages = [...currentImages, ...newFiles];
    setPreviews((prev) => [...prev, ...newPreviews]);
    setValue("images", updatedImages, { shouldValidate: true });
  };

  const removeImage = (index: number) => {
    const currentImages = watch("images") || [];

    URL.revokeObjectURL(previews[index]);
    const updatedImages = currentImages.filter(
      (_: File, i: number) => i !== index,
    );
    const updatedPreviews = previews.filter(
      (_: string, i: number) => i !== index,
    );

    setPreviews(updatedPreviews);
    setValue("images", updatedImages, { shouldValidate: true });
  };

  const handleRemoveExistingImage = async (img: ProductImage) => {
    try {
      setDeletingImageId(img.id);
      await apiProduct.deleteImage(id!, img.publicId);
      setExistingImages((prev) => prev.filter((i) => i.id !== img.id));
      toast.success("¡Imagen eliminada con éxito!");
    } catch (error) {
      console.error("Error original:", error);

      if (isAxiosError(error) && error.response) {
        const data = error.response.data;

        if (data.errors && Array.isArray(data.errors)) {
          const messages = data.errors.map(
            (err: string | { message: string }) =>
              typeof err === "string" ? err : err.message,
          );

          toast.error("Revisa los campos", {
            description: messages.join(" | "),
          });
          return;
        }

        if (data.message) {
          toast.error("Error del servidor", {
            description: data.message,
          });
          return;
        }
      }

      toast.error("¡Ups!", {
        description: "No pudimos conectar con el servidor. Revisa tu internet.",
      });
    } finally {
      setDeletingImageId(null);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await apiProduct.getProduct(id!);
        const product = response.data;

        reset({
          title: product.title || "",
          description: product.description,
          price: Number(product.price),
          categoryId: product.category.id,
          isAvailable: product.isAvailable,
          specs: product.specs
            ? Object.entries(product.specs).map(([key, value]) => ({
                key,
                value: String(value),
              }))
            : [{ key: "", value: "" }],
          images: [],
        });

        setExistingImages(product.images || []);
      } catch (error) {
        toast.error("¡Ups! No pudimos cargar el producto.");
        console.error(error);
        navigate("/admin/products");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id, reset, navigate]);

  const onSubmit = async (data: UpdateProductFormValues) => {
    if (
      existingImages.length === 0 &&
      (!data.images || data.images.length === 0)
    ) {
      toast.error("¡El producto no puede quedarse sin fotos!", {
        description: "Sube al menos una imagen antes de guardar.",
      });
      return;
    }
    try {
      setIsSubmitting(true);
      const formData = new FormData();

      formData.append("title", data.title || "");
      formData.append("description", data.description || "");
      formData.append("price", data.price?.toString() || "");
      formData.append("categoryId", data.categoryId || "");
      formData.append("isAvailable", data.isAvailable?.toString() || "");

      const formatedSpecs = data.specs?.reduce(
        (acc, curr) => {
          if (curr.key.trim() !== "") {
            acc[curr.key] = curr.value;
          }
          return acc;
        },
        {} as Record<string, string>,
      );

      formData.append("specs", JSON.stringify(formatedSpecs));

      if (data.images && data.images.length > 0) {
        data.images.forEach((file: File) => {
          formData.append("images", file);
        });
      }

      await apiProduct.updateProduc(id!, formData);
      toast.success("¡Producto actualizado con éxito!");
      navigate("/admin/products");
    } catch (error) {
      console.error("Error original:", error);

      if (isAxiosError(error) && error.response) {
        const data = error.response.data;

        if (data.errors && Array.isArray(data.errors)) {
          const messages = data.errors.map(
            (err: string | { message: string }) =>
              typeof err === "string" ? err : err.message,
          );

          toast.error("Revisa los campos", {
            description: messages.join(" | "),
          });
          return;
        }

        if (data.message) {
          toast.error("Error del servidor", {
            description: data.message,
          });
          return;
        }
      }

      toast.error("¡Ups!", {
        description: "No pudimos conectar con el servidor. Revisa tu internet.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="animate-pulse text-muted-foreground">
          Cargando producto...
        </span>
      </div>
    );
  }

  return (
    <main className="space-y-6 md:p-8 bg-background flex-1">
      <div className="flex items-center justify-between gap-4 border-b pb-5">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          Editar Producto
        </h2>
      </div>

      <form className="grid gap-8" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-8 md:grid-cols-[2fr,1fr]">
          <div className="space-y-8">
            <Card className="border-border/60 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Detalles Esenciales</CardTitle>
                <CardDescription>
                  Ingresa la información básica y la descripción detallada del
                  producto.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold">
                    Nombre del Producto{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    {...register("title")}
                    id="name"
                    placeholder="ej. Agenda Personalizada 2026"
                    className="border-border focus-visible:ring-primary/20"
                  />
                  {errors.title && (
                    <p className="text-xs text-red-500">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm font-semibold">
                      Categoría <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={watchCategoryId}
                      onValueChange={(v) => setValue("categoryId", v as string)}
                    >
                      <SelectTrigger id="category" className="border-border">
                        <SelectValue placeholder="Selecciona una categoría">
                          <span className="capitalize">
                            {displayCategoryName}
                          </span>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            <span className="capitalize">{c.name}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.categoryId && (
                      <p className="text-xs text-red-500">
                        {errors.categoryId.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-sm font-semibold">
                      Precio Base (S/){" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                        S/
                      </span>
                      <Input
                        {...register("price", { valueAsNumber: true })}
                        id="price"
                        type="number"
                        step="0.01"
                        placeholder="35.00"
                        className="pl-9 border-border"
                      />
                      {errors.price && (
                        <p className="text-xs text-red-500">
                          {errors.price.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="description"
                    className="text-sm font-semibold"
                  >
                    Descripción Detallada{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    {...register("description")}
                    id="description"
                    placeholder="Describa los materiales, medidas y detalles del producto."
                    className="border-border min-h-36 resize-y focus-visible:ring-primary/20"
                  />
                  {errors.description && (
                    <p className="text-xs text-red-500">
                      {errors.description.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground pt-1">
                    Esta descripción aparecerá en la web para que el cliente
                    conozca los detalles de tu trabajo.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">
                  Características Específicas
                </CardTitle>
                <CardDescription>
                  Agrega detalles únicos de este producto (ej. Tamaño, Material,
                  Tiempo de elaboración, etc.)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-3 items-end">
                    <div className="flex-1">
                      <Input
                        {...register(`specs.${index}.key`)}
                        placeholder="Característica..."
                      />
                    </div>
                    <div className="flex-2">
                      <Input
                        {...register(`specs.${index}.value`)}
                        placeholder="Detalle..."
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive shrink-0 mt-1"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  type="button"
                  className="w-full mt-2 border-dashed border-border hover:bg-muted/50 gap-2"
                  onClick={() => append({ key: "", value: "" })}
                >
                  <Plus className="w-4 h-4" />
                  Agregar otra característica
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="border-border/60 shadow-sm overflow-hidden">
              <CardHeader className="bg-muted/30 border-b pb-4">
                <CardTitle className="text-xl flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-primary" />
                  Galería del Producto
                </CardTitle>
                <CardDescription>
                  Sube hasta 4 imágenes mostrando detalles y ángulos de tu
                  trabajo.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <input
                  type="file"
                  id="image-upload"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />

                <div className="grid grid-cols-2 gap-4">
                  {existingImages.map((img, index) => (
                    <div
                      key={img.url}
                      className="relative aspect-square rounded-xl overflow-hidden border border-border group"
                    >
                      <img
                        src={img.url}
                        alt={`Existente ${index}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingImage(img)}
                        disabled={deletingImageId === img.id}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg disabled:opacity-100 disabled:bg-red-400 disabled:cursor-not-allowed"
                      >
                        {deletingImageId === img.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <X className="w-3 h-3" />
                        )}
                      </button>
                      {index === 0 && (
                        <div className="absolute bottom-0 left-0 right-0 bg-primary/80 text-[10px] text-white text-center py-1 font-bold">
                          EXISTENTE - PRINCIPAL
                        </div>
                      )}
                    </div>
                  ))}

                  {previews.map((url, index) => (
                    <div
                      key={url}
                      className="relative aspect-square rounded-xl overflow-hidden border border-border group"
                    >
                      <img
                        src={url}
                        alt={`Preview ${index}`}
                        className="w-full h-full object-cover opacity-90"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-blue-500/80 text-[10px] text-white text-center py-1 font-bold">
                        NUEVA
                      </div>
                    </div>
                  ))}

                  {existingImages.length + previews.length < 4 && (
                    <Label
                      htmlFor="image-upload"
                      className="relative aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center bg-muted/20 hover:border-primary hover:bg-muted/40 transition-all cursor-pointer group"
                    >
                      <Plus className="w-8 h-8 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                      <span className="text-[10px] text-muted-foreground mt-1 font-medium group-hover:text-primary">
                        Añadir foto
                      </span>
                    </Label>
                  )}
                </div>

                <div className="pt-2 text-center text-[11px] text-muted-foreground border border-border/70 p-3 rounded-lg bg-muted/10">
                  <p>Aceptamos: JPG y PNG</p>
                  <p>Tamaño max: 5MB por imagen.</p>
                </div>
                {errors.images && (
                  <p className="text-xs text-red-500 text-center font-medium">
                    {errors.images.message as string}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="border-border/60 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between gap-4 p-4 border rounded-xl bg-muted/20 border-border">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-lg">
                      <PackageCheck className="h-6 w-6" />
                    </div>
                    <div className="space-y-0.5">
                      <Label
                        htmlFor="isAvailable"
                        className="text-base font-semibold"
                      >
                        Disponible para pedido
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Permite que los clientes vean y soliciten este producto
                        en la web.
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="isAvailable"
                    checked={watch("isAvailable")}
                    onCheckedChange={(v) => setValue("isAvailable", v)}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="border-border shadow-sm">
          <CardContent className="p-5 flex items-center justify-end gap-3">
            <Button variant="outline" className="border-border">
              <Link to="/admin/products">Cancelar</Link>
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Actualizar Producto"
              )}
            </Button>
          </CardContent>
        </Card>
      </form>
    </main>
  );
}
