import z from "zod";

export const categorySchema = z.object({
  name: z.string().min(2, "Category name is required"),
  visibility: z.boolean(),
  icon: z.number().min(1, "Please select an icon"),
  color: z.string().min(1, "Please select a color"),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

export type Icon = {
  icon: React.ReactNode;
  id: number;
  label: string;
};

export type Category = CategoryFormValues & {
  id: number;
  status: string;
};
