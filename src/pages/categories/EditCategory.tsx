import { apiCategories } from "@/api/categories/apiCategories";
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
import { Textarea } from "@/components/ui/textarea";
import {
  updateCategorySchema,
  type UpdateCategoryFormValues,
} from "@/schemas/category.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { Check, ImageIcon, Loader2, Plus, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export default function EditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<UpdateCategoryFormValues>({
    resolver: zodResolver(updateCategorySchema),
    defaultValues: {
      name: "",
      label: "",
      description: "",
      image: undefined,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newPreview = URL.createObjectURL(file);
    setPreview(newPreview);
    setValue("image", file, { shouldValidate: true });
  };

  const removeImage = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setExistingImage(null);
    setValue("image", undefined, { shouldValidate: true });
  };

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await apiCategories.getCategoryById(id!);
        const category = response.data;

        reset({
          name: category.name || "",
          description: category.description || "",
          label: category.label || "",
          image: undefined,
        });

        setExistingImage(category.image);
      } catch (error) {
        toast.error("¡Ups! No pudimos cargar la categoría");
        console.error(error);
        navigate("/admin/categories");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchCategory();
  }, [id, reset, navigate]);

  const onSubmit = async (data: UpdateCategoryFormValues) => {
    if (!existingImage && !preview) {
      toast.error("¡La categoría necesita una imagen!", {
        description: "Por favor sube una foto antes de actualizar.",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();

      formData.append("name", data.name || "");
      formData.append("label", data.label || "");
      formData.append("description", data.description || "");

      if (data.image) {
        formData.append("image", data.image);
      }

      await apiCategories.updateCategory(id!, formData);
      toast.success("¡Categoría actualizada con éxito!", {
        icon: <Check className="w-4 h-4" />,
        description: "Los cambios ya están disponibles",
      });
      navigate("/admin/categories");
    } catch (error) {
      console.error("Error original", error);
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2">Cargando categoría...</span>
      </div>
    );
  }

  return (
    <main className="space-y-6 md:p-8 bg-background flex-1">
      <div className="flex items-center justify-between gap-4 border-b pb-5">
        <h2 className="text-3xl font-bold tracking-tight">Editar Categoría</h2>
      </div>

      <form className="grid gap-8" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-8 md:grid-cols-[2fr, 1fr]">
          <div className="space-y-8">
            <Card className="border-border/60 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">
                  Detalles de la Categoría
                </CardTitle>
                <CardDescription>
                  Define el nombre y la información que verán los clientes.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-semibold">
                      Nombre <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      {...register("name")}
                      id="name"
                      placeholder="ej. San valentín"
                      className="border-border focus-visible:ring-primary/20"
                    />
                    {errors.name && (
                      <p className="text-xs text-red-500 text-center font-medium">
                        {errors.name.message as string}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="label" className="text-sm font-semibold">
                      Etiqueta Pública (Label)
                    </Label>
                    <Input
                      {...register("label")}
                      id="label"
                      placeholder="ej. Amor y Amistad"
                      className="border-border focus-visible:ring-primary/20"
                    />
                    {errors.label && (
                      <p className="text-xs text-red-500 text-center font-medium">
                        {errors.label.message as string}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    {...register("description")}
                    id="description"
                    placeholder="Describe los productos que contendrá esta categoría... "
                    className="border-border min-h-24 resize-y focus-visible:ring-primary/20"
                  />
                  {errors.description && (
                    <p className="text-xs text-red-500 text-center font-medium">
                      {errors.description.message as string}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="border-border/60 shadow-sm overflow-hidden">
              <CardHeader className="bg-muted/30 border-b pb-4">
                <CardTitle className="text-xl flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-primary" />
                  Imagen Principal
                </CardTitle>
                <CardDescription>
                  Sube una imagen representativa para la categoría.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <input
                  type="file"
                  id="category-image"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />

                <div className="flex justify-center">
                  {existingImage ? (
                    <div className="relative w-full max-w-[250px] aspect-square rounded-xl overflow-hidden border border-border group">
                      <img
                        src={existingImage}
                        alt="preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : preview ? (
                    <div className="relative w-full max-w-[250px] aspect-square rounded-xl overflow-hidden border border-border group">
                      <img
                        src={preview}
                        alt="preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <Label
                      htmlFor="category-image"
                      className="relative w-full max-w-[250px] aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center bg-muted/20 hover:border-primary hover:bg-muted/40 transition-all cursor-pointer group"
                    >
                      <Plus className="w-10 h-10 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                      <span className="text-xs text-muted-foreground mt-2 font-medium group-hover:text-primary">
                        Seleccionar foto
                      </span>
                    </Label>
                  )}
                </div>

                <div className="pt-2 text-center text-[11px] text-muted-foreground border border-border/70 p-3 rounded-lg bg-muted/10">
                  <p>Aceptamos: JPG Y PNG</p>
                  <p>Tamaño máximo: 5MB.</p>
                </div>
                {errors.image && (
                  <p className="text-xs text-red-500 text-center font-medium">
                    {errors.image.message as string}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        <Card className="border-border shadow-sm">
          <CardContent className="p-5 flex items-center justify-end gap-3">
            <Button variant="outline" className="border-border">
              <Link to="/admin/categories">Cancelar</Link>
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Actualizar Categoría"
              )}
            </Button>
          </CardContent>
        </Card>
      </form>
    </main>
  );
}
