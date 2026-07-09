import z from "zod";

export type Tab = {
  label:
    | "Templates"
    | "Flowers"
    | "Wrapping & Ribbons"
    | "Add-ons"
    | "Pricing Rules";
  value: "templates" | "flowers" | "wrapping" | "addons" | "pricing-rules";
};

export type TabContent = {
  content: React.ReactNode;
  value: Tab["value"];
};

/**
 * Control On Templates
 */
const imageSchema = z.union([z.string(), z.instanceof(Blob)]);

export const templateSchema = z
  .object({
    name: z.string().min(2, "Template name is required"),
    icon: imageSchema.optional().nullable(),
    emoji: z.string().optional(),
    prices: z.array(
      z.object({
        size: z.enum(["S", "M", "L", "XL"]),
        flowers: z.number().min(1, "Please select a flower"),
        price: z.number().min(1, "Price must be a positive number"),
      }),
    ),
    active: z.boolean(),
  })
  .superRefine((data, ctx) => {
    const hasIcon = Boolean(data.icon);
    const hasEmoji = Boolean(data.emoji?.trim());

    if (!hasIcon && !hasEmoji) {
      ctx.addIssue({
        code: "custom",
        path: ["icon"],
        message: "Please add an icon or emoji",
      });

      ctx.addIssue({
        code: "custom",
        path: ["emoji"],
        message: "Please add an icon or emoji",
      });
    }

    if (hasIcon && hasEmoji) {
      ctx.addIssue({
        code: "custom",
        path: ["emoji"],
        message: "Choose either icon or emoji, not both",
      });
    }
  });

export type TemplateFormValues = z.infer<typeof templateSchema>;

export type Template = TemplateFormValues & {
  id: number;
};

/**
 * Control On Flowers
 */
export const flowerSchema = z
  .object({
    icon: imageSchema.optional().nullable(),
    emoji: z.string().optional(),
    name: z.string().min(2, "Flower name is required"),
    price: z.number().min(1, "Price must be a positive number"),
    startingStock: z
      .number()
      .min(1, "Starting stock must be a positive number"),
    lowStockThreshold: z
      .number()
      .min(1, "Low stock threshold must be a positive number"),
    colors: z
      .array(z.string().min(1, "Color is required"))
      .min(1, "At least one color is required"),
    active: z.boolean(),
  })
  .superRefine((data, ctx) => {
    const hasIcon = Boolean(data.icon);
    const hasEmoji = Boolean(data.emoji?.trim());

    if (!hasIcon && !hasEmoji) {
      ctx.addIssue({
        code: "custom",
        path: ["icon"],
        message: "Please add an icon or emoji",
      });

      ctx.addIssue({
        code: "custom",
        path: ["emoji"],
        message: "Please add an icon or emoji",
      });
    }

    if (hasIcon && hasEmoji) {
      ctx.addIssue({
        code: "custom",
        path: ["emoji"],
        message: "Choose either icon or emoji, not both",
      });
    }
  });

export type FlowerFormValues = z.infer<typeof flowerSchema>;

export type Flower = FlowerFormValues & {
  id: number;
};

/**
 * Control On Wrapping & Ribbons
 */
export const wrappingSchema = z
  .object({
    icon: imageSchema.optional().nullable(),
    emoji: z.string().optional(),
    name: z.string().min(2, "Wrapping option name is required"),
    price: z.number().min(1, "Price must be a positive number"),
    active: z.boolean(),
  })
  .superRefine((data, ctx) => {
    const hasIcon = Boolean(data.icon);
    const hasEmoji = Boolean(data.emoji?.trim());

    if (!hasIcon && !hasEmoji) {
      ctx.addIssue({
        code: "custom",
        path: ["icon"],
        message: "Please add an icon or emoji",
      });

      ctx.addIssue({
        code: "custom",
        path: ["emoji"],
        message: "Please add an icon or emoji",
      });
    }

    if (hasIcon && hasEmoji) {
      ctx.addIssue({
        code: "custom",
        path: ["emoji"],
        message: "Choose either icon or emoji, not both",
      });
    }
  });

export type WrappingFormValues = z.infer<typeof wrappingSchema>;

export type Wrapping = WrappingFormValues & {
  id: number;
};

// Ribbons
export const ribbonSchema = z.object({
  name: z.string().min(2, "Ribbon name is required"),
  color: z.string().min(1, "Color is required"),
  price: z.number().min(1, "Price must be a positive number"),
  active: z.boolean(),
});

export type RibbonFormValues = z.infer<typeof ribbonSchema>;

export type Ribbon = RibbonFormValues & {
  id: number;
};

/**
 * Control On Add-ons
 */
export const addOnsSchema = z.object({
  addOns: z.array(
    z.object({
      name: z.string().min(2, "Add-on name is required"),
      price: z.number().min(1, "Price must be a positive number"),
      stock: z.number().min(1, "Stock must be a positive number"),
      active: z.boolean(),
    }),
  ),
  price: z.number().min(1, "Price must be a positive number"),
  floral: imageSchema,
  minimal: imageSchema,
  handwritten: imageSchema,
});

export type AddOnsFormData = z.infer<typeof addOnsSchema>;

/**
 * Control On Pricing Rules
 */
export const pricingRulesSchema = z.object({
  shippingFee: z
    .number()
    .min(1, { message: "Shipping fee must be a positive number" }),
  activeAutoFillDiscount: z.boolean().optional(),
  discountPercentage: z
    .number()
    .optional()
    .refine(
      (value) => {
        if (value !== undefined && (value < 0 || value > 100)) {
          return false;
        }
        return true;
      },
      { message: "Discount percentage must be between 0 and 100" },
    ),
  sizes: z.array(
    z.object({
      size: z.enum(["S", "M", "L", "XL"]),
      minFlowers: z
        .number()
        .min(1, { message: "Minimum flowers must be at least 1" }),
      maxFlowers: z
        .number()
        .min(1, { message: "Maximum flowers must be at least 1" }),
      defaultHint: z.string().min(1, { message: "Default hint is required" }),
    }),
  ),
});

export type PricingRulesFormData = z.infer<typeof pricingRulesSchema>;
