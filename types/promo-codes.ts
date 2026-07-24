import z from "zod";
import { T } from "./shared";

export const promoCodeSchema = (t: T) =>
  z
    .object({
      code: z
        .string()
        .min(1, t("Fields.Code.Required"))
        .min(3, t("Fields.Code.MinLength")),
      type: z.enum(["percentage", "fixed"], t("Fields.Type.Required")),
      value: z.number().min(1, t("Fields.Value.Required")),
      min_order_total: z.number().optional().catch(undefined),
      usage_limit: z.number().optional().catch(undefined),
      per_customer_limit: z.number().optional().catch(undefined),
      scope: z.enum(["all", "categories"], t("Fields.Scope.Required")),
      is_active: z.boolean().optional(),
      starts_at: z.string().optional(),
      expires_at: z.string().optional(),
      category_ids: z.array(z.number()).optional(),
    })
    .superRefine((data, ctx) => {
      if (
        data.scope === "categories" &&
        (!data.category_ids || data.category_ids.length === 0)
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["category_ids"],
          message: t("Fields.Category.Required"),
        });
      }

      if (data.expires_at && data.starts_at) {
        const startsAt = new Date(data.starts_at);
        const expiresAt = new Date(data.expires_at);
        if (expiresAt <= startsAt) {
          ctx.addIssue({
            code: "custom",
            path: ["expires_at"],
            message: t("Fields.ExpiresAt.MustBeAfterStartDate"),
          });
        }
      }
    });

export type PromoCodeFormValues = z.infer<ReturnType<typeof promoCodeSchema>>;

export type Coupon = {
  id: number;
  code: string;
  type: PromoCodeFormValues["type"];
  value: string;
  scope: PromoCodeFormValues["scope"];
  category_ids: number[];
  min_order_total: string;
  max_discount: null;
  usage_limit: number;
  per_customer_limit: number;
  used_count: number;
  status: string;
  starts_at: null | string;
  expires_at: null | string;
  is_active: boolean;
};

export type PromoCodesSummary = {
  active: number;
  expired_inactive: number;
  scheduled: number;
  total: number;
  total_redemptions: number;
};
