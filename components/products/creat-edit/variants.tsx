import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import Input from "@/components/form/input";
import Select from "@/components/form/select";
import { Button } from "@/components/ui/button";
import { ProductFormValues } from "@/types/products";
import { colors, sizes } from "@/constants/products";
import { useFormLocale } from "@/hooks/use-form-locale";
import SectionLabel from "@/components/form/section-label";

// Get list of colors including the selected color if it's not in the predefined list
function getListOfColors(color?: string): string[] {
  return [...colors, ...(color && !colors.includes(color) ? [color] : [])];
}

export default function Variants({
  register,
  errors,
  control,
  variants,
  tLive,
  dir,
}: {
  register: UseFormRegister<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  control: Control<ProductFormValues>;
  variants: ProductFormValues["variants"];
  tLive: ReturnType<typeof useFormLocale>["tLive"];
  dir: string;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 justify-between">
        <SectionLabel>{tLive("Labels.Variants")}</SectionLabel>
      </div>
      {variants.map((_, index) => (
        <div
          key={index}
          className="grid grid-cols-1 md:grid-cols-2 gap-2 border border-border p-4 rounded-md bg-primary/10"
        >
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

          <Select<ProductFormValues>
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

          <div className="md:col-span-2">
            <Field>
              <FieldLabel htmlFor="colors" className="text-sm font-semibold">
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
