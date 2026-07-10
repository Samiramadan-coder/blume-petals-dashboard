import z from "zod";

type T = (key: string) => string;

export const categorySchema = (t: T) =>
  z.object({
    name: z.object({
      en: z.string().min(1, t("NameIsRequired")).min(3, t("NameMinLength")),
      ar: z.string().min(1, t("NameIsRequired")).min(3, t("NameMinLength")),
    }),
    visibility: z.boolean(),
    icon: z.number().min(1, t("SelectIcon")),
    color: z.string().min(1, t("SelectColor")),
  });

export type CategoryFormValues = z.infer<ReturnType<typeof categorySchema>>;

export type Icon = {
  icon: React.ReactNode;
  id: number;
  label: string;
};

export type Category = CategoryFormValues & {
  id: number;
  status: string;
};
