import z from "zod";

const imageSchema = z.union([z.string(), z.instanceof(Blob)]);

export const productSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  category: z.string().min(1, "Please select a category"),
  description: z.string().optional(),
  price: z.number().min(1, "Price must be a positive number"),
  salesPrice: z
    .number()
    .min(0, "Sales price must be a positive number")
    .optional(),
  stockQuantity: z.number().min(1, "Stock quantity must be a positive number"),
  sku: z.string().optional(),
  images: z.array(imageSchema).min(1, "Please upload at least one image"),
  sizes: z.array(z.string()).min(1, "Please select at least one size"),
  colors: z.array(z.string()).min(1, "Please select at least one color"),
  occasions: z.array(z.string()).min(1, "Please select at least one occasion"),
  showNewBadge: z.boolean(),
  featuredOnHomepage: z.boolean(),
  productStatus: z.string(),
});

export type ProductFormValues = z.infer<typeof productSchema>;

export type Product = ProductFormValues & {
  id: number;
  rating: number;
};
