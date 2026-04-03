import * as z from "zod";

const categorySchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  label: z.string().min(3, "La etiqueta debe tener al menos 3 caracteres"),
  description: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres"),
  image: z
    .any()
    .refine((file) => file instanceof File, "Debes seleccionar una imagen"),
});

const updateCategorySchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  label: z.string().min(3, "La etiqueta debe tener al menos 3 caracteres"),
  description: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres"),
  image: z.any().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;
type UpdateCategoryFormValues = z.infer<typeof updateCategorySchema>;

export { categorySchema, updateCategorySchema };
export type { CategoryFormValues, UpdateCategoryFormValues };
