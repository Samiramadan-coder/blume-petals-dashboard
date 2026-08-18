"use client";

import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Input from "../form/input";
import Header from "../form/header";
import Footer from "../form/footer";
import Select from "../form/select";
import { Button } from "../ui/button";
import { Check } from "lucide-react";
import AddButton from "../form/add-button";
import { useRef, type ReactNode } from "react";
import { colors, sizes } from "@/constants/products";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { addVariantAction } from "@/lib/products-actions";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Field, FieldContent, FieldError, FieldLabel } from "../ui/field";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet";
import { Variant, VariantFormValues, variantSchema } from "@/types/products";

// Get list of colors including the selected color if it's not in the predefined list
function getListOfColors(color?: string): string[] {
  return [...colors, ...(color && !colors.includes(color) ? [color] : [])];
}

export default function CreateEditVariant({
  trigger,
  variant,
  productId,
}: {
  trigger?: ReactNode;
  variant?: Variant;
  productId: number;
}) {
  const locale = useLocale();
  const t = useTranslations("Products");
  const tCommon = useTranslations("Common");
  const form = useRef<HTMLFormElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<VariantFormValues>({
    resolver: zodResolver(variantSchema((key) => t(key as never))),
    defaultValues: variant || {
      id: undefined,
      sku: "",
      size: "",
      price: 0,
      stock: 0,
      compare_at_price: null,
      color_hex: "",
      in_stock: true,
      is_on_sale: false,
    },
  });

  const onSubmit: SubmitHandler<VariantFormValues> = async (values) => {
    const result = await addVariantAction(productId, values, variant?.id);
    if (result.success) {
      toast.success(
        variant
          ? tCommon("UpdatedSuccessfully")
          : tCommon("CreatedSuccessfully"),
      );
      form.current?.reset();
      closeBtn.current?.click();
      return;
    }
    if (result.errors) {
      Object.entries(result.errors).forEach(([field, message]) => {
        toast.error(message);
        setError(field as keyof VariantFormValues, {
          type: "server",
          message,
        });
      });
      return;
    }
    toast.error(variant ? tCommon("UpdateFailed") : tCommon("CreationFailed"));
  };

  return (
    <Sheet>
      {trigger ? (
        <SheetTrigger asChild>{trigger}</SheetTrigger>
      ) : (
        <AddButton label={t("AddVariant")} />
      )}

      <SheetContent
        showCloseButton={false}
        className="flex h-full flex-col sm:max-w-4xl"
        onInteractOutside={(event) => event.preventDefault()}
        side={locale === "ar" ? "left" : "right"}
      >
        <SheetClose asChild>
          <Button ref={closeBtn} className="hidden"></Button>
        </SheetClose>

        <Header title={variant ? t("EditVariant") : t("AddVariant")} />

        <div className={cn(`flex-1 overflow-auto px-4 pb-6 pt-2 relative`)}>
          <form
            ref={form}
            onSubmit={(e) => {
              void handleSubmit(onSubmit)(e);
            }}
            className="space-y-6 relative"
          >
            <Input<VariantFormValues>
              label={t("Fields.SKU")}
              name="sku"
              type="text"
              register={register}
              placeholder={t("Placeholders.SKU")}
              required
              errors={errors}
            />

            <Input<VariantFormValues>
              label={t("Fields.Price")}
              name="price"
              type="number"
              register={register}
              errors={errors}
              required
              placeholder={t("Placeholders.Price")}
            />

            <Input<VariantFormValues>
              label={t("Fields.StockQuantity")}
              name="stock"
              type="number"
              register={register}
              errors={errors}
              required
              placeholder={t("Placeholders.StockQuantity")}
            />

            <Select<VariantFormValues>
              control={control}
              label={t("Fields.Size")}
              name="size"
              placeholder={t("Placeholders.Size")}
              required
              options={sizes((key) => t(key as never))}
            />

            <Input<VariantFormValues>
              label={t("Fields.ComparePrice")}
              name="compare_at_price"
              type="number"
              register={register}
              placeholder={t("Placeholders.ComparePrice")}
              errors={errors}
            />

            <Field>
              <FieldLabel htmlFor="colors" className="text-sm font-semibold">
                {t("Fields.ColorVariants")}
              </FieldLabel>
              <FieldContent>
                <Controller
                  name="color_hex"
                  control={control}
                  render={({ field }) => {
                    const selectedColor = field.value ?? "";

                    return (
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap gap-2">
                          {getListOfColors(selectedColor || "").map((color) => {
                            const isSelected = selectedColor === color;

                            return (
                              <Button
                                key={color}
                                type="button"
                                variant="outline"
                                className={cn(
                                  "h-8 w-8 rounded-full border border-border",
                                  {
                                    "border-2 border-primary": isSelected,
                                  },
                                )}
                                style={{
                                  backgroundColor: color,
                                }}
                                onClick={() => {
                                  const nextColor = isSelected ? "" : color;
                                  field.onChange(nextColor);
                                }}
                              >
                                {isSelected && <Check />}
                              </Button>
                            );
                          })}
                          <div className="relative h-8 w-8">
                            <Button
                              variant="outline"
                              className="w-8 h-8 rounded-full border-2 border-dashed bg-white"
                            ></Button>
                            <input
                              type="color"
                              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                              onChange={(event) => {
                                const nextColor = event.target.value;
                                field.onChange(nextColor);
                              }}
                            />
                          </div>
                        </div>

                        <FieldError errors={[errors.color_hex]} />
                      </div>
                    );
                  }}
                />
              </FieldContent>
            </Field>
          </form>
        </div>

        <Footer form={form} loading={isSubmitting} />
      </SheetContent>
    </Sheet>
  );
}
