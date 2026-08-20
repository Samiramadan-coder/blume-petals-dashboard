"use client";

import {
  Select as UiSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "../ui/select";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Input from "../form/input";
import Header from "../form/header";
import Footer from "../form/footer";
import Select from "../form/select";
import { Button } from "../ui/button";
import { Check, X } from "lucide-react";
import AddButton from "../form/add-button";
import { Product } from "@/types/products";
import { useRef, type ReactNode } from "react";
import { addVariantAction } from "@/lib/products";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { colors, initialFlower, sizes } from "@/constants/products";
import { Field, FieldContent, FieldError, FieldLabel } from "../ui/field";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet";
import { Variant, VariantFormValues, variantSchema } from "@/types/products";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";

// Get list of colors including the selected color if it's not in the predefined list
function getListOfColors(color?: string): string[] {
  return [...colors, ...(color && !colors.includes(color) ? [color] : [])];
}

export default function CreateEditVariant({
  trigger,
  variant,
  productId,
  flowers,
}: {
  trigger?: ReactNode;
  variant?: Variant;
  productId: number;
  flowers: Product[];
}) {
  const locale = useLocale();
  const t = useTranslations("Products");
  const tCommon = useTranslations("Common");
  const form = useRef<HTMLFormElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  const {
    register,
    control,
    getValues,
    handleSubmit,
    setValue,
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
      recipe: [{ component_variant_id: 0, qty: 0 }],
    },
  });
  const recipe = useWatch({ control, name: "recipe" });
  const price = useWatch({ control, name: "price" });

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

            <div className="border border-border p-4 rounded-md">
              <Field>
                <FieldLabel className="text-sm font-semibold">
                  {t("Labels.FlowerLabel")}
                </FieldLabel>
                <FieldContent>
                  <div className="space-y-2">
                    {recipe.map((recipeItem, index) => {
                      const selectedFlower = flowers.find(
                        (flower) =>
                          flower.id === recipeItem.component_variant_id,
                      );

                      const chosenFlowerIds = recipe.map(
                        (item) => item.component_variant_id,
                      );

                      const availableFlowers = flowers.filter(
                        (flower) =>
                          !chosenFlowerIds.includes(flower.id) ||
                          flower.id === recipeItem.component_variant_id,
                      );

                      return (
                        <div
                          key={index}
                          className="grid grid-cols-[1.3fr_0.3fr_0.4fr] items-center gap-2"
                        >
                          <Controller
                            control={control}
                            name={`recipe.${index}.component_variant_id`}
                            render={({ field }) => {
                              const selectedFlower = flowers.find(
                                (flower) => flower.id === field.value,
                              );

                              return (
                                <UiSelect
                                  value={
                                    field.value
                                      ? String(field.value)
                                      : undefined
                                  }
                                  onValueChange={(value) =>
                                    field.onChange(Number(value))
                                  }
                                >
                                  <SelectTrigger className="h-10! w-full border-border bg-background">
                                    {selectedFlower ? (
                                      <div className="flex min-w-0 items-center gap-2">
                                        {selectedFlower.images[0]?.url ? (
                                          <Image
                                            src={selectedFlower.images[0].url}
                                            alt={selectedFlower.name[locale]}
                                            width={28}
                                            height={28}
                                            className="size-7 shrink-0 rounded-full object-cover"
                                          />
                                        ) : (
                                          <div className="size-7 shrink-0 rounded-full bg-primary/30" />
                                        )}
                                        <span className="truncate">
                                          {selectedFlower.name[locale]}
                                        </span>
                                      </div>
                                    ) : (
                                      <span className="text-muted-foreground">
                                        {t("Placeholders.SelectFlower")}
                                      </span>
                                    )}
                                  </SelectTrigger>
                                  <SelectContent
                                    position="popper"
                                    align="start"
                                    className="max-h-56 w-(--radix-select-trigger-width)"
                                  >
                                    {availableFlowers.map((flower) => (
                                      <SelectItem
                                        key={flower.id}
                                        value={String(flower.id)}
                                        className="py-1.5"
                                      >
                                        <div className="flex min-w-0 items-center gap-2">
                                          {flower.images[0]?.url ? (
                                            <Image
                                              src={flower.images[0].url}
                                              alt={flower.name[locale]}
                                              width={28}
                                              height={28}
                                              className="size-7 shrink-0 rounded-full object-cover"
                                            />
                                          ) : (
                                            <div className="size-7 shrink-0 rounded-full bg-primary/30" />
                                          )}
                                          <span className="min-w-0 flex-1 truncate">
                                            {flower.name[locale]}
                                          </span>
                                          <span className="shrink-0 text-xs text-muted-foreground">
                                            {flower.variants[0]
                                              ?.available_stock ?? 0}{" "}
                                            {t("InStock")}
                                          </span>
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </UiSelect>
                              );
                            }}
                          />

                          <Input<VariantFormValues>
                            name={`recipe.${index}.qty`}
                            type="number"
                            register={register}
                            errors={errors}
                            required
                          />

                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs text-muted-foreground">
                              {recipeItem.qty *
                                (selectedFlower?.variants[0]?.price ?? 0)}{" "}
                              {tCommon("AED")}
                            </span>
                            {index > 0 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="size-7"
                                onClick={() =>
                                  setValue(
                                    "recipe",
                                    getValues("recipe").filter(
                                      (_, recipeIndex) => recipeIndex !== index,
                                    ),
                                  )
                                }
                                aria-label={tCommon("Delete")}
                              >
                                <X className="size-4" aria-hidden="true" />
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    <Button
                      type="button"
                      variant="ghost"
                      className="text-xs text-primary hover:bg-transparent hover:text-primary"
                      onClick={() =>
                        setValue("recipe", [
                          ...getValues("recipe"),
                          initialFlower,
                        ])
                      }
                    >
                      <span aria-hidden="true">+</span>
                      {t("AddFlower")}
                    </Button>

                    <div className="space-y-1 rounded-md border border-border bg-background p-4">
                      <p className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          {t("EstimatedCost")}
                        </span>
                        <span className="font-semibold">
                          {recipe.reduce((total, item) => {
                            const flower = flowers.find(
                              (candidate) =>
                                candidate.id === item.component_variant_id,
                            );
                            return (
                              total +
                              item.qty * (flower?.variants[0]?.price ?? 0)
                            );
                          }, 0)}{" "}
                          {tCommon("AED")}
                        </span>
                      </p>
                      <p className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          {t("SellingPrice")}
                        </span>
                        <span className="font-semibold">
                          {price} {tCommon("AED")}
                        </span>
                      </p>
                      <p className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          {t("Margin")}
                        </span>
                        <span className="font-semibold">
                          {(() => {
                            const estimatedCost = recipe.reduce(
                              (total, item) => {
                                const flower = flowers.find(
                                  (candidate) =>
                                    candidate.id === item.component_variant_id,
                                );
                                return (
                                  total +
                                  item.qty * (flower?.variants[0]?.price ?? 0)
                                );
                              },
                              0,
                            );
                            return estimatedCost > 0
                              ? (
                                  ((price - estimatedCost) / estimatedCost) *
                                  100
                                ).toFixed(2)
                              : "0.00";
                          })()}
                          %
                        </span>
                      </p>
                    </div>
                  </div>
                </FieldContent>
              </Field>
            </div>
          </form>
        </div>

        <Footer form={form} loading={isSubmitting} />
      </SheetContent>
    </Sheet>
  );
}
