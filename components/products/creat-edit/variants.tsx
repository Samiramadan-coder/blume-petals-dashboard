import {
  Field,
  FieldError,
  FieldLabel,
  FieldContent,
} from "@/components/ui/field";

import {
  Control,
  Controller,
  FieldErrors,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

import {
  colors,
  initialFlower,
  initialVariant,
  sizes,
} from "@/constants/products";

import Image from "next/image";
import { cn } from "@/lib/utils";
import Input from "@/components/form/input";
import { Check, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import NormalSelect from "@/components/form/select";
import { useFormLocale } from "@/hooks/use-form-locale";
import SectionLabel from "@/components/form/section-label";
import { Product, ProductFormValues } from "@/types/products";
import DeleteBtn from "@/components/reusable/delete-btn";
import { useState } from "react";
import { deleteVariantAction } from "@/lib/products";

// Get list of colors including the selected color if it's not in the predefined list
function getListOfColors(color?: string): string[] {
  return [...colors, ...(color && !colors.includes(color) ? [color] : [])];
}

export default function Variants({
  register,
  errors,
  control,
  getValues,
  setValue,
  variants,
  tLive,
  tLiveCommon,
  dir,
  flowers,
  activeLocale,
  productId,
}: {
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
}) {
  const [loadingDelete, setLoadingDelete] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 justify-between">
        <SectionLabel>{tLive("Labels.Variants")}</SectionLabel>
        <Button
          type="button"
          variant="ghost"
          className="text-xs text-primary hover:bg-transparent hover:text-primary"
          onClick={() => {
            const updatedVariants = [...getValues(`variants`), initialVariant];
            setValue(`variants`, updatedVariants);
          }}
        >
          <Plus />
          {tLive("AddVariant")}
        </Button>
      </div>

      {variants.map((variant, index) => (
        <div
          key={index}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-border p-4 rounded-md"
        >
          {index > 0 && (
            <div className="md:col-span-2 flex justify-end">
              <DeleteBtn
                loading={loadingDelete}
                onDelete={async () => {
                  if (variant.id && productId) {
                    setLoadingDelete(true);
                    await deleteVariantAction(productId, variant.id);
                    setLoadingDelete(false);
                  }

                  const updatedVariants = variants.filter(
                    (_, i) => i !== index,
                  );

                  setValue(`variants`, updatedVariants);
                }}
              />
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
          />

          <Input<ProductFormValues>
            label={tLive("Fields.StockQuantity")}
            name={`variants.${index}.stock`}
            type="number"
            register={register}
            errors={errors}
            required
            placeholder={tLive("Placeholders.StockQuantity")}
          />

          <NormalSelect<ProductFormValues>
            control={control}
            label={tLive("Fields.Size")}
            name={`variants.${index}.size`}
            placeholder={tLive("Placeholders.Size")}
            required
            dir={dir}
            options={sizes((key) => tLive(key as never))}
          />

          <Input<ProductFormValues>
            label={tLive("Fields.ComparePrice")}
            name={`variants.${index}.compare_at_price`}
            type="number"
            register={register}
            placeholder={tLive("Placeholders.ComparePrice")}
            errors={errors}
            className="md:col-span-2"
          />

          <div className="md:col-span-2 border border-border p-4 rounded-md space-y-3">
            <p className="text-xs text-muted-foreground">
              {tLive("Labels.FlowerLabel")}
            </p>

            {variant.recipe.map((recipeItem, recipeIndex) => {
              // Get the selected flower for this recipe item
              const selectedFlower = flowers.find(
                (flower) =>
                  flower.id ===
                  variants[index].recipe[recipeIndex].component_variant_id,
              );

              // Get the IDs of the chosen flowers for this variant, excluding the current recipe item
              const chossenFlowersIds = variants[index].recipe.map(
                (item) => item.component_variant_id,
              );

              // Filter the available flowers to exclude those already chosen, except for the current recipe item
              const availableFlowers = flowers.filter(
                (flower) =>
                  !chossenFlowersIds.includes(flower.id) ||
                  flower.id === recipeItem.component_variant_id,
              );

              // Calculate the estimated cost for this variant based on the recipe items and their quantities
              const estimatedCost = variant.recipe.reduce((total, item) => {
                const flower = flowers.find(
                  (flower) => flower.id === item.component_variant_id,
                );
                // console.log(flower, total, item.qty, "flower, total, item.qty");
                return total + item.qty * (flower?.variants[0]?.price ?? 0);
              }, 0);

              const margin =
                ((variant.price - estimatedCost) / estimatedCost) * 100;

              return (
                <div key={recipeIndex}>
                  <div className="mb-3 grid items-center grid-cols-[1.3fr_0.3fr_0.4fr] gap-2">
                    <div>
                      <Controller
                        control={control}
                        name={`variants.${index}.recipe.${recipeIndex}.component_variant_id`}
                        render={({ field }) => {
                          return (
                            <Select
                              value={
                                field.value ? String(field.value) : undefined
                              }
                              onValueChange={(value) =>
                                field.onChange(Number(value))
                              }
                            >
                              <SelectTrigger
                                dir={dir}
                                className="h-10! w-full border-border bg-background"
                              >
                                {selectedFlower ? (
                                  <div className="flex min-w-0 items-center gap-2">
                                    {selectedFlower.images.length > 0 ? (
                                      <Image
                                        src={
                                          selectedFlower.images[0]?.url ?? ""
                                        }
                                        alt={selectedFlower.name[activeLocale]}
                                        width={28}
                                        height={28}
                                        className="size-7 rounded-full object-cover"
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
                                    value={String(flower.id)}
                                    className="py-1.5"
                                  >
                                    <div className="flex min-w-0 items-center gap-2">
                                      {flower.images.length > 0 ? (
                                        <Image
                                          src={flower.images[0]?.url ?? ""}
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
                                        {flower.variants[0]?.available_stock ??
                                          0}{" "}
                                        {tLive("InStock")}
                                      </span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          );
                        }}
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
                    />

                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs text-muted-foreground">
                        {recipeItem.qty *
                          (selectedFlower?.variants[0]?.price ?? 0)}{" "}
                        {tLiveCommon("AED")}
                      </p>

                      {recipeIndex > 0 && (
                        <DeleteButton
                          onClick={() => {
                            const recieps = getValues(
                              `variants.${index}.recipe`,
                            );
                            const updatedRecipe = recieps.filter(
                              (_, i) => i !== recipeIndex,
                            );
                            setValue(`variants.${index}.recipe`, updatedRecipe);
                          }}
                        />
                      )}
                    </div>
                  </div>

                  {recipeIndex === variant.recipe.length - 1 && (
                    <div className="space-y-2">
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-xs text-primary hover:bg-transparent hover:text-primary"
                        onClick={() => {
                          const updatedRecipe = [
                            ...getValues(`variants.${index}.recipe`),
                            initialFlower,
                          ];

                          setValue(`variants.${index}.recipe`, updatedRecipe);
                        }}
                      >
                        <Plus />
                        {tLive("AddFlower")}
                      </Button>

                      <div className="p-4 bg-background rounded-md border border-border space-y-1">
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
                            {variant.price} {tLiveCommon("AED")}
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
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="md:col-span-2">
            <Field>
              <FieldLabel htmlFor="colors" className="text-xs font-semibold">
                {tLive("Fields.ColorVariants")}
              </FieldLabel>
              <FieldContent>
                <Controller
                  name={`variants.${index}.color_hex`}
                  control={control}
                  render={({ field }) => {
                    const selectedColor = field.value ?? "";

                    return (
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap gap-2">
                          {getListOfColors(variants[index].color_hex || "").map(
                            (color) => {
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
                            },
                          )}
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

                        <FieldError
                          errors={[errors.variants?.[index]?.color_hex]}
                        />
                      </div>
                    );
                  }}
                />
              </FieldContent>
            </Field>
          </div>
        </div>
      ))}
    </div>
  );
}

function DeleteButton({ onClick }: { onClick: () => void }) {
  return (
    <X
      className="size-4 text-muted-foreground cursor-pointer"
      onClick={onClick}
    />
  );
}
