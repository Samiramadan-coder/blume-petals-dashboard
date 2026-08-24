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
  type,
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
  type: "default" | "addon";
}) {
  const [loadingDelete, setLoadingDelete] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 justify-between">
        <SectionLabel>{tLive("Labels.Variants")}</SectionLabel>
        {type === "default" && (
          <Button
            type="button"
            variant="ghost"
            className="text-xs text-primary hover:bg-transparent hover:text-primary"
            onClick={() => {
              const updatedVariants = [
                ...getValues(`variants`),
                initialVariant,
              ];
              setValue(`variants`, updatedVariants);
            }}
          >
            <Plus />
            {tLive("AddVariant")}
          </Button>
        )}
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
            label={tLive("Fields.Size")}
            name={`variants.${index}.size`}
            type="text"
            register={register}
            placeholder={tLive("Placeholders.Size")}
            required
            errors={errors}
          />

          <Input<ProductFormValues>
            label={tLive("Fields.ComparePrice")}
            name={`variants.${index}.compare_at_price`}
            type="number"
            register={register}
            placeholder={tLive("Placeholders.ComparePrice")}
            errors={errors}
          />

          {type === "default" && (
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
                  return total + item.qty * (flower?.variants[0]?.price ?? 0);
                }, 0);

                const margin =
                  ((variant.price - estimatedCost) / estimatedCost || 1) * 100;

                return (
                  <div key={recipeIndex}>
                    <div className="mb-3 grid items-center grid-cols-[1.2fr_0.4fr_0.4fr] gap-2">
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
                                          alt={
                                            selectedFlower.name[activeLocale]
                                          }
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
                                          {flower.variants[0]
                                            ?.available_stock ?? 0}{" "}
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
                        min={1}
                        max={selectedFlower?.variants[0].available_stock}
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
                              setValue(
                                `variants.${index}.recipe`,
                                updatedRecipe,
                              );
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

                        {estimatedCost > 0 && (
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
                              className={cn(
                                "flex items-center justify-between",
                                {
                                  "text-destructive": margin < 0,
                                },
                              )}
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
                    )}
                  </div>
                );
              })}
            </div>
          )}
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
