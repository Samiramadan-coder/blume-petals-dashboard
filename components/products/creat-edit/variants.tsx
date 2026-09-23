"use client";

import {
  Controller,
  useWatch,
  type Control,
  type FieldErrors,
  type UseFormGetValues,
  type UseFormRegister,
  type UseFormSetValue,
} from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Plus, X } from "lucide-react";
import Input from "@/components/form/input";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import { deleteVariantAction } from "@/lib/products";
import { useFormLocale } from "@/hooks/use-form-locale";
import DeleteBtn from "@/components/reusable/delete-btn";
import SectionLabel from "@/components/form/section-label";
import { Product, ProductFormValues } from "@/types/products";
import { initialFlower, initialVariant } from "@/constants/products";

type VariantsProps = {
  register: UseFormRegister<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  control: Control<ProductFormValues>;
  setValue: UseFormSetValue<ProductFormValues>;
  getValues: UseFormGetValues<ProductFormValues>;
  variants: ProductFormValues["variants"];
  tLive: ReturnType<typeof useFormLocale>["tLive"];
  tLiveCommon: ReturnType<typeof useFormLocale>["tLive"];
  dir: string;
  flowers: Product[];
  activeLocale: "ar" | "en";
  productId?: number;
  type: "default" | "addon";
};

type VariantItemProps = Omit<VariantsProps, "variants"> & {
  variant: ProductFormValues["variants"][number];
  index: number;
};

export default function Variants(props: VariantsProps) {
  const { type, tLive, control, getValues, setValue } = props;

  const variants = useWatch({
    control,
    name: "variants",
    defaultValue: props.variants,
  });

  function addVariant() {
    const newVariant = {
      ...initialVariant,
      recipe: initialVariant.recipe.map((item) => ({ ...item })),
    };

    setValue("variants", [...getValues("variants"), newVariant], {
      shouldDirty: true,
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <SectionLabel>{tLive("Labels.Variants")}</SectionLabel>

        {type === "default" && (
          <Button
            type="button"
            variant="ghost"
            className="text-xs text-primary hover:bg-transparent hover:text-primary"
            onClick={addVariant}
          >
            <Plus />
            {tLive("AddVariant")}
          </Button>
        )}
      </div>

      {variants.map((variant, index) => (
        <VariantItem
          key={variant.id ?? `new-${index}`}
          register={props.register}
          errors={props.errors}
          control={control}
          getValues={getValues}
          setValue={setValue}
          variant={variant}
          index={index}
          tLive={tLive}
          tLiveCommon={props.tLiveCommon}
          dir={props.dir}
          flowers={props.flowers}
          activeLocale={props.activeLocale}
          productId={props.productId}
          type={type}
        />
      ))}
    </div>
  );
}

export function VariantItem({
  register,
  errors,
  control,
  getValues,
  setValue,
  variant: initialVariantValue,
  index,
  tLive,
  tLiveCommon,
  dir,
  flowers,
  activeLocale,
  productId,
  type,
}: VariantItemProps) {
  const [loadingDelete, setLoadingDelete] = useState(false);

  const variant = useWatch({
    control,
    name: `variants.${index}` as const,
    defaultValue: initialVariantValue,
  });

  const [startPrice, setStartPrice] = useState(
    initialVariantValue.compare_at_price
      ? initialVariantValue.compare_at_price
      : initialVariantValue.price || 0,
  );

  const recipe = variant.recipe ?? [];

  const chosenFlowerIds = recipe.map((item) => item.component_variant_id);

  const estimatedCost = recipe.reduce((total, item) => {
    const flower = flowers.find(
      (flower) => flower.variants[0]?.id === item.component_variant_id,
    );

    const unitCost = Number(
      flower?.variants[0]?.cost_price ?? flower?.variants[0]?.price ?? 0,
    );

    return total + (Number(item.qty) || 0) * unitCost;
  }, 0);

  const sellingPrice = Number(variant.price) || 0;

  const margin =
    sellingPrice > 0
      ? ((sellingPrice - estimatedCost) / sellingPrice) * 100
      : 0;

  async function deleteVariant() {
    setLoadingDelete(true);

    try {
      if (variant.id && productId) {
        await deleteVariantAction(productId, variant.id);
      }

      const updatedVariants = getValues("variants").filter(
        (_, currentIndex) => currentIndex !== index,
      );

      setValue("variants", updatedVariants, {
        shouldDirty: true,
        shouldValidate: true,
      });
    } finally {
      setLoadingDelete(false);
    }
  }

  function addFlower() {
    const currentRecipe = getValues(`variants.${index}.recipe`) ?? [];

    setValue(
      `variants.${index}.recipe`,
      [...currentRecipe, { ...initialFlower }],
      { shouldDirty: true },
    );
  }

  function removeFlower(recipeIndex: number) {
    const currentRecipe = getValues(`variants.${index}.recipe`) ?? [];

    setValue(
      `variants.${index}.recipe`,
      currentRecipe.filter((_, currentIndex) => currentIndex !== recipeIndex),
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 rounded-md border border-border p-4 md:grid-cols-2">
      {index > 0 && (
        <div className="flex justify-end md:col-span-2">
          <DeleteBtn loading={loadingDelete} onDelete={deleteVariant} />
        </div>
      )}

      <Input<ProductFormValues>
        label={tLive("Fields.SKU")}
        name={`variants.${index}.sku`}
        type="text"
        register={register}
        placeholder={tLive("Placeholders.SKU")}
        required
        errors={errors}
      />

      <Input<ProductFormValues>
        label={tLive("Fields.Price")}
        name={`variants.${index}.price`}
        type="number"
        register={register}
        errors={errors}
        required
        placeholder={tLive("Placeholders.Price")}
        max={
          variant.compare_at_price ? variant.compare_at_price - 1 : undefined
        }
        prefix={
          variant.compare_at_price ? (
            <span className="line-through">{variant.compare_at_price}</span>
          ) : null
        }
        onChange={(event) => {
          const newPrice = event.target.valueAsNumber || 0;

          setValue(`variants.${index}.price`, newPrice, {
            shouldDirty: true,
            shouldValidate: true,
          });

          if (variant.compare_at_price) {
            const discount =
              ((variant.compare_at_price - newPrice) /
                variant.compare_at_price) *
              100;

            setValue(`variants.${index}.discount`, discount, {
              shouldDirty: true,
              shouldValidate: true,
            });
          } else {
            setStartPrice(newPrice);
          }
        }}
      />

      <Input<ProductFormValues>
        label={tLive("Fields.Size")}
        name={`variants.${index}.size`}
        type="text"
        register={register}
        placeholder={tLive("Placeholders.Size")}
        required
        errors={errors}
      />

      <Input<ProductFormValues>
        label={tLive("Fields.Discount")}
        name={`variants.${index}.discount`}
        type="number"
        register={register}
        placeholder={tLive("Placeholders.Discount")}
        errors={errors}
        prefix={<span className="text-sm">%</span>}
        min={0}
        max={100}
        disabled={!variant.price}
        onChange={(event) => {
          const newDiscount = parseFloat(event.target.value) || 0;

          const newPrice = startPrice - (startPrice * newDiscount) / 100;

          setValue(`variants.${index}.discount`, newDiscount, {
            shouldDirty: true,
            shouldValidate: true,
          });

          setValue(`variants.${index}.price`, newPrice, {
            shouldDirty: true,
            shouldValidate: true,
          });

          setValue(
            `variants.${index}.compare_at_price`,
            newDiscount ? +startPrice : undefined,
            {
              shouldDirty: true,
            },
          );
        }}
      />

      {type === "default" && (
        <div className="space-y-3 rounded-md border border-border p-4 md:col-span-2">
          <p className="text-xs text-muted-foreground">
            {tLive("Labels.FlowerLabel")}
          </p>

          {recipe.map((recipeItem, recipeIndex) => {
            const selectedFlower = flowers.find(
              (flower) =>
                flower.variants[0]?.id === recipeItem.component_variant_id,
            );

            const availableFlowers = flowers.filter((flower) => {
              const flowerVariantId = flower.variants[0]?.id;

              if (flowerVariantId == null) return false;

              return (
                !chosenFlowerIds.includes(flowerVariantId) ||
                flowerVariantId === recipeItem.component_variant_id
              );
            });

            const unitCost = Number(
              selectedFlower?.variants[0]?.cost_price ??
                selectedFlower?.variants[0]?.price ??
                0,
            );

            const itemCost = (Number(recipeItem.qty) || 0) * unitCost;

            return (
              <div
                key={recipeIndex}
                className="mb-3 grid grid-cols-[1.2fr_0.4fr_0.4fr] items-center gap-2"
              >
                <div>
                  <Controller
                    control={control}
                    name={`variants.${index}.recipe.${recipeIndex}.component_variant_id`}
                    render={({ field }) => (
                      <Select
                        value={field.value ? String(field.value) : ""}
                        onValueChange={(value) => field.onChange(Number(value))}
                      >
                        <SelectTrigger
                          ref={field.ref}
                          onBlur={field.onBlur}
                          dir={dir}
                          className="h-10! w-full border-border bg-background"
                        >
                          {selectedFlower ? (
                            <div className="flex min-w-0 items-center gap-2">
                              {selectedFlower.images[0]?.url ? (
                                <Image
                                  src={selectedFlower.images[0].url}
                                  alt={selectedFlower.name[activeLocale]}
                                  width={28}
                                  height={28}
                                  className="size-7 shrink-0 rounded-full object-cover"
                                />
                              ) : (
                                <div className="size-7 shrink-0 rounded-full bg-primary/30" />
                              )}

                              <span className="truncate">
                                {selectedFlower.name[activeLocale]}
                              </span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">
                              {tLive("Placeholders.SelectFlower")}
                            </span>
                          )}
                        </SelectTrigger>

                        <SelectContent
                          position="popper"
                          align="start"
                          className="max-h-56 w-(--radix-select-trigger-width)"
                          dir={dir}
                        >
                          {availableFlowers.map((flower) => (
                            <SelectItem
                              key={flower.id}
                              value={String(flower.variants[0].id)}
                              className="py-1.5"
                            >
                              <div className="flex min-w-0 items-center gap-2">
                                {flower.images[0]?.url ? (
                                  <Image
                                    src={flower.images[0].url}
                                    alt={flower.name[activeLocale]}
                                    width={28}
                                    height={28}
                                    className="size-7 shrink-0 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="size-7 shrink-0 rounded-full bg-primary/30" />
                                )}

                                <span className="min-w-0 flex-1 truncate">
                                  {flower.name[activeLocale]}
                                </span>

                                <span className="shrink-0 text-xs text-muted-foreground">
                                  {flower.variants[0]?.available_stock ?? 0}{" "}
                                  {tLive("InStock")}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />

                  <FieldError
                    errors={[
                      errors.variants?.[index]?.recipe?.[recipeIndex]
                        ?.component_variant_id,
                    ]}
                  />
                </div>

                <Input<ProductFormValues>
                  name={`variants.${index}.recipe.${recipeIndex}.qty`}
                  type="number"
                  register={register}
                  errors={errors}
                  required
                  min={1}
                  max={selectedFlower?.variants[0]?.available_stock}
                  onChange={(event) => {
                    const quantity = event.target.valueAsNumber;

                    setValue(
                      `variants.${index}.recipe.${recipeIndex}.qty`,
                      Number.isNaN(quantity) ? 0 : quantity,
                      {
                        shouldDirty: true,
                        shouldValidate: true,
                      },
                    );
                  }}
                />

                <div className="flex items-center justify-between gap-1">
                  <p className="text-xs text-muted-foreground">
                    {itemCost} {tLiveCommon("AED")}
                  </p>

                  {recipeIndex > 0 && (
                    <DeleteButton onClick={() => removeFlower(recipeIndex)} />
                  )}
                </div>
              </div>
            );
          })}

          <div className="space-y-2">
            <Button
              type="button"
              variant="ghost"
              className="text-xs text-primary hover:bg-transparent hover:text-primary"
              onClick={addFlower}
            >
              <Plus />
              {tLive("AddFlower")}
            </Button>

            {estimatedCost > 0 && (
              <div className="space-y-1 rounded-md border border-border bg-background p-4">
                <p className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {tLive("EstimatedCost")}
                  </span>

                  <span className="text-xs font-semibold">
                    {estimatedCost} {tLiveCommon("AED")}
                  </span>
                </p>

                <p className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {tLive("SellingPrice")}
                  </span>

                  <span className="text-xs font-semibold">
                    {sellingPrice} {tLiveCommon("AED")}
                  </span>
                </p>

                <p
                  className={cn("flex items-center justify-between", {
                    "text-destructive": margin < 0,
                  })}
                >
                  <span className="text-xs text-muted-foreground">
                    {tLive("Margin")}
                  </span>

                  <span className="text-xs font-semibold">
                    {margin.toFixed(2)}%
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function DeleteButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label="Remove flower"
      className="shrink-0 cursor-pointer text-muted-foreground hover:text-destructive"
      onClick={onClick}
    >
      <X className="size-4" />
    </button>
  );
}
