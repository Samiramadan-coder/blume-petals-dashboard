import z from "zod";

const imageSchema = z.union([
  z.string().trim().min(1, "Please upload a banner"),
  z.instanceof(Blob),
]);

export const occasionCollectionSchema = z
  .object({
    banner: imageSchema,
    name: z.string().min(2, "Category name is required"),
    startDate: z.string().min(1, "Please select a start date"),
    endDate: z.string().min(1, "Please select an end date"),
    visibility: z.boolean(),
    color: z.string().min(1, "Please select a color"),
  })
  .superRefine((data, ctx) => {
    if (!data.startDate || !data.endDate) return;

    if (data.startDate > data.endDate) {
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "End date must be after start date",
      });
    }
  });

export type OccasionCollectionFormValues = z.infer<
  typeof occasionCollectionSchema
>;

export type OccasionCollection = OccasionCollectionFormValues & {
  id: number;
  products: number;
};
