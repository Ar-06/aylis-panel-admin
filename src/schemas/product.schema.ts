import * as z from "zod";

const productSchema = z.object({
  title: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  description: z
    .string()
    .min(10, "Describe mejor el producto (min. 10 caracteres)"),
  price: z
    .number()
    .refine((val) => !isNaN(val), {
      message: "Ingresa un precio válido",
    })
    .min(1, "El precio debe ser mayor a 0"),
  categoryId: z.string().uuid("ID de categoría no válido"),
  isAvailable: z.boolean(),
  specs: z.array(
    z.object({
      key: z.string().min(1, "Propiedad requerida"),
      value: z.string().min(1, "Valor requerido"),
    }),
  ),
  images: z
    .any()
    .refine?.((files) => files.length > 0, "Debes agregar al menos una imagen"),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default productSchema;
export type { ProductFormValues };

const updateProductSchema = z.object({
  title: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .optional(),
  description: z
    .string()
    .min(10, "Describe mejor el producto (min. 10 caracteres)")
    .optional(),
  price: z
    .number()
    .refine((val) => !isNaN(val), {
      message: "Ingresa un precio válido",
    })
    .min(1, "El precio debe ser mayor a 0")
    .optional(),
  categoryId: z.string().uuid("ID de categoría no válido").optional(),
  isAvailable: z.boolean().optional(),
  specs: z
    .array(
      z.object({
        key: z.string().min(1, "Propiedad requerida"),
        value: z.string().min(1, "Valor requerido"),
      }),
    )
    .optional(),
  images: z.any().optional(),
});

export { updateProductSchema };
type UpdateProductFormValues = z.infer<typeof updateProductSchema>;
export type { UpdateProductFormValues };
