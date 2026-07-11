"use client";

import {
  colors,
  occasions,
  productStatuses,
  sizes,
} from "@/constants/products";
import { cn } from "@/lib/utils";
import Input from "../form/input";
import { Badge } from "../ui/badge";
import Header from "../form/header";
import Footer from "../form/footer";
import Select from "../form/select";
import Switch from "../form/switch";
import { Check } from "lucide-react";
import { Button } from "../ui/button";
import RichText from "../form/rich-text";
import AddButton from "../form/add-button";
import { Separator } from "../ui/separator";
import { useTranslations } from "next-intl";
import { useRef, type ReactNode } from "react";
import SectionLabel from "../form/section-label";
import ImageUploader from "../form/image-uploader";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Field, FieldContent, FieldError, FieldLabel } from "../ui/field";
import { Product, ProductFormValues, productSchema } from "@/types/products";

export default function CreateEdit({
  trigger,
  product,
}: {
  trigger?: ReactNode;
  product?: Product;
}) {
  const t = useTranslations("Products");
  const form = useRef<HTMLFormElement>(null);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      category: product?.category || "",
      description: product?.description || "",
      price: product?.price || undefined,
      salesPrice: product?.salesPrice || undefined,
      stockQuantity: product?.stockQuantity || undefined,
      images: product?.images || [],
      sizes: product?.sizes || [],
      colors: product?.colors || [],
      occasions: product?.occasions || [],
      showNewBadge: product?.showNewBadge || false,
      featuredOnHomepage: product?.featuredOnHomepage || false,
      productStatus: product?.productStatus || "active",
    },
  });

  const onSubmit = (values: ProductFormValues) => {
    console.log("Product form values:", values);
  };

  return (
    <Sheet>
      {trigger ? (
        <SheetTrigger asChild>{trigger}</SheetTrigger>
      ) : (
        <AddButton label={t("AddProduct")} />
      )}

      <SheetContent
        showCloseButton={false}
        className="flex h-full flex-col sm:max-w-2xl"
        onInteractOutside={(event) => event.preventDefault()}
      >
        <Header
          title={product ? t("EditProduct") : t("AddProduct")}
          description={t("AddProductDescription")}
        />

        <div className="flex-1 overflow-auto px-4 pb-6 pt-2 relative">
          <form
            ref={form}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 relative"
          >
            <ImageUploader
              control={control}
              name="images"
              label={t("Fields.Photo")}
              required
            />

            <SectionLabel>{t("Labels.BasicInformation")}</SectionLabel>

            <Input<ProductFormValues>
              label={t("Fields.Name")}
              name="name"
              type="text"
              placeholder={t("Placeholders.Name")}
              register={register}
              errors={errors}
              required
            />

            <Select<ProductFormValues>
              control={control}
              label={t("Fields.Category")}
              name="category"
              placeholder={t("Placeholders.Category")}
              required
              options={[
                { label: "Category 1", value: "category1" },
                { label: "Category 2", value: "category2" },
              ]}
            />

            <RichText<ProductFormValues>
              control={control}
              label={t("Fields.Description")}
              name="description"
              placeholder={t("Placeholders.Description")}
            />

            <SectionLabel>{t("Labels.PricingAndStock")}</SectionLabel>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input<ProductFormValues>
                label={t("Fields.Price")}
                name="price"
                type="number"
                register={register}
                errors={errors}
                required
                placeholder={t("Placeholders.Price")}
              />

              <Input<ProductFormValues>
                label={t("Fields.SalesPrice")}
                name="salesPrice"
                type="number"
                register={register}
                placeholder={t("Placeholders.SalesPrice")}
              />

              <Input<ProductFormValues>
                label={t("Fields.StockQuantity")}
                name="stockQuantity"
                type="number"
                register={register}
                errors={errors}
                required
                placeholder={t("Placeholders.StockQuantity")}
              />

              <Input<ProductFormValues>
                label={t("Fields.SKU")}
                name="sku"
                type="text"
                register={register}
                placeholder={t("Placeholders.SKU")}
              />
            </div>

            <Separator className="bg-border" />
            <SectionLabel>{t("Labels.Variants")}</SectionLabel>
            <Field>
              <FieldLabel htmlFor="sizes" className="text-sm font-semibold">
                {t("Fields.AvailableSizes")}
                <span className="text-red-500">*</span>
              </FieldLabel>
              <FieldContent>
                <Controller
                  name="sizes"
                  control={control}
                  render={({ field }) => {
                    const selectedSizes = field.value ?? [];

                    return (
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap gap-2">
                          {sizes(t).map((size) => {
                            const isSelected = selectedSizes.includes(
                              size.value,
                            );

                            return (
                              <Button
                                key={size.value}
                                type="button"
                                variant="outline"
                                className={cn(
                                  `h-11 w-11 bg-white cursor-pointer`,
                                  { "bg-primary/20 border-2": isSelected },
                                )}
                                onClick={() => {
                                  const nextSizes = isSelected
                                    ? selectedSizes.filter(
                                        (i) => i !== size.value,
                                      )
                                    : [...selectedSizes, size.value];

                                  field.onChange(nextSizes);
                                }}
                              >
                                {size.label}
                              </Button>
                            );
                          })}
                        </div>
                        <FieldError errors={[errors.sizes]} />
                      </div>
                    );
                  }}
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="colors" className="text-sm font-semibold">
                {t("Fields.ColorVariants")}
                <span className="text-red-500">*</span>
              </FieldLabel>
              <FieldContent>
                <Controller
                  name="colors"
                  control={control}
                  render={({ field }) => {
                    const selectedColors = field.value ?? [];

                    return (
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap gap-2">
                          {colors(t).map((color) => {
                            const isSelected = selectedColors.includes(
                              color.value,
                            );

                            return (
                              <Button
                                key={color.value}
                                type="button"
                                variant="outline"
                                className={cn(
                                  "h-8 w-8 rounded-full border border-border cursor-pointer",
                                  {
                                    "border-2 border-primary": isSelected,
                                  },
                                )}
                                style={{ backgroundColor: color.value }}
                                onClick={() => {
                                  const nextColors = isSelected
                                    ? selectedColors.filter(
                                        (i) => i !== color.value,
                                      )
                                    : [...selectedColors, color.value];

                                  field.onChange(nextColors);
                                }}
                              >
                                {isSelected && <Check />}
                              </Button>
                            );
                          })}
                        </div>

                        {selectedColors.length ? (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {selectedColors.map((colorValue) => {
                              const label = colors(t).find(
                                (c) => c.value === colorValue,
                              )?.label;

                              return (
                                <Badge
                                  key={colorValue}
                                  variant="outline"
                                  className="h-6 border border-border"
                                >
                                  <div
                                    className="h-3 w-3 rounded-full"
                                    style={{ backgroundColor: colorValue }}
                                  ></div>
                                  {label}
                                </Badge>
                              );
                            })}
                          </div>
                        ) : null}

                        <FieldError errors={[errors.colors]} />
                      </div>
                    );
                  }}
                />
              </FieldContent>
            </Field>

            <Separator className="bg-border" />
            <Field>
              <FieldLabel htmlFor="occasions" className="text-sm font-semibold">
                {t("Fields.OccasionTags")}
                <span className="text-red-500">*</span>
              </FieldLabel>

              <FieldContent>
                <Controller
                  name="occasions"
                  control={control}
                  render={({ field }) => {
                    const selectedOccasions = field.value ?? [];

                    return (
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap gap-2">
                          {occasions(t).map((occasion) => {
                            const isSelected = selectedOccasions.includes(
                              occasion.value,
                            );

                            return (
                              <Badge
                                key={occasion.value}
                                variant="outline"
                                className={cn(`h-6`, {
                                  "bg-primary/20 border-2 cursor-pointer":
                                    isSelected,
                                })}
                                onClick={() => {
                                  const nextOccasions = isSelected
                                    ? selectedOccasions.filter(
                                        (i) => i !== occasion.value,
                                      )
                                    : [...selectedOccasions, occasion.value];
                                  field.onChange(nextOccasions);
                                }}
                              >
                                {occasion.label}
                              </Badge>
                            );
                          })}
                        </div>

                        <FieldError errors={[errors.occasions]} />
                      </div>
                    );
                  }}
                />
              </FieldContent>
            </Field>

            <Separator className="bg-border" />
            <SectionLabel>{t("Labels.DisplayOptions")}</SectionLabel>
            <Switch
              name="showNewBadge"
              control={control}
              label={t("Fields.ShowNewBadge")}
              description={t("Fields.ShowNewBadgeDescription")}
            />

            <Switch
              name="featuredOnHomepage"
              control={control}
              label={t("Fields.FeaturedOnHomepage")}
              description={t("Fields.FeaturedOnHomepageDescription")}
            />

            <Controller
              name="productStatus"
              control={control}
              render={({ field }) => {
                const selectedStatus = field.value ?? "active";

                return (
                  <div className="flex gap-2">
                    {productStatuses(t).map((status) => {
                      return (
                        <Button
                          className={cn(`flex-1 h-10 bg-white`, {
                            "bg-primary/20 border-2":
                              selectedStatus === status.value,
                          })}
                          onClick={() => field.onChange(status.value)}
                          type="button"
                          variant="outline"
                          key={status.value}
                        >
                          {status.label}
                        </Button>
                      );
                    })}
                  </div>
                );
              }}
            />
          </form>
        </div>

        <Footer form={form} />
      </SheetContent>
    </Sheet>
  );
}
