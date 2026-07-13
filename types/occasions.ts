import z from "zod";
import { T } from "./shared";
import { typesEnum } from "@/constants/shared";

const imageSchema = z.union([z.string(), z.instanceof(Blob)]);

export const occasionCollectionSchema = (t: T) =>
  z
    .object({
      name: z.object({
        en: z
          .string()
          .min(1, t("Errors.OccasionCollectionNameRequired"))
          .min(2, t("Errors.OccasionCollectionNameMinLength")),
        ar: z
          .string()
          .min(1, t("Errors.OccasionCollectionNameRequired"))
          .min(2, t("Errors.OccasionCollectionNameMinLength")),
      }),
      type: z.enum(typesEnum, t("Errors.OccasionCollectionTypeRequired")),
      color: z.string().min(1, t("Errors.OccasionCollectionColorRequired")),
      banner: imageSchema,
      is_visible: z.boolean(),
      // slug: z.string().min(1, "Please enter a slug"),
      // startDate: z.string().min(1, "Please select a start date"),
      // endDate: z.string().min(1, "Please select an end date"),
      // visibility: z.boolean(),
      // color: z.string().min(1, "Please select a color"),
    })
    .superRefine((data, ctx) => {
      console.log("data", data);
      console.log("ctx", ctx);
      // if (!data.startDate || !data.endDate) return;
      // if (data.startDate > data.endDate) {
      //   ctx.addIssue({
      //     code: "custom",
      //     path: ["endDate"],
      //     message: "End date must be after start date",
      //   });
      // }
    });

export type OccasionCollectionFormValues = z.infer<
  ReturnType<typeof occasionCollectionSchema>
>;

export type OccasionCollectionType = OccasionCollectionFormValues["type"];

export type OccasionCollection = OccasionCollectionFormValues & {
  id: number;
  products: number;
};
