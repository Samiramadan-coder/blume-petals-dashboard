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
import { useRef, useState, type ReactNode } from "react";
import SectionLabel from "../form/section-label";
import ImageUploader from "../form/image-uploader";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useFormLocale } from "@/hooks/use-form-locale";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import LocaleFormSwitcher from "../reusable/locale-form-switcher";
import { Field, FieldContent, FieldError, FieldLabel } from "../ui/field";
import { Product, ProductFormValues, productSchema } from "@/types/products";

export default function CreateEdit({
  trigger,
  product,
}: {
  trigger?: ReactNode;
  product?: Product;
}) {
  const locale = useLocale();
  const t = useTranslations("Products");
  const form = useRef<HTMLFormElement>(null);

  const { activeLocale, changeLocale, dir, isArabic, tLive } =
    useFormLocale("Products");

  const [listOfColors, setListOfColors] = useState(
    colors((key) => tLive(key as never)),
  );

  const {
    register,
    control,
    handleSubmit,
    clearErrors,
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
        side={locale === "ar" ? "left" : "right"}
      >
        <Header
          title={product ? t("EditProduct") : t("AddProduct")}
          description={t("AddProductDescription")}
        />

        <LocaleFormSwitcher
          locale={activeLocale}
          onChange={(locale) => {
            changeLocale(locale);
            clearErrors();
          }}
        />

        <div
          className={cn(`flex-1 overflow-auto px-4 pb-6 pt-2 relative`, {
            "font-cairo": isArabic,
            "font-inter": !isArabic,
          })}
          dir={dir}
        >
          <form
            ref={form}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 relative"
          >
            <ImageUploader
              control={control}
              name="images"
              label={tLive("Fields.Photo")}
              required
              buttonLabel={tLive("AddPhoto")}
              mainLabel={tLive("MainLabel")}
            />

            <SectionLabel>{tLive("Labels.BasicInformation")}</SectionLabel>

            <Input<ProductFormValues>
              label={tLive("Fields.Name")}
              name="name"
              type="text"
              placeholder={tLive("Placeholders.Name")}
              register={register}
              errors={errors}
              required
            />

            <Select<ProductFormValues>
              control={control}
              label={tLive("Fields.Category")}
              name="category"
              placeholder={tLive("Placeholders.Category")}
              required
              dir={dir}
              options={[
                { label: "Category 1", value: "category1" },
                { label: "Category 2", value: "category2" },
              ]}
            />

            <RichText<ProductFormValues>
              key={activeLocale}
              control={control}
              label={tLive("Fields.Description")}
              name="description"
              placeholder={tLive("Placeholders.Description")}
            />

            <SectionLabel>{tLive("Labels.PricingAndStock")}</SectionLabel>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input<ProductFormValues>
                label={tLive("Fields.Price")}
                name="price"
                type="number"
                register={register}
                errors={errors}
                required
                placeholder={tLive("Placeholders.Price")}
              />

              <Input<ProductFormValues>
                label={tLive("Fields.SalesPrice")}
                name="salesPrice"
                type="number"
                register={register}
                placeholder={tLive("Placeholders.SalesPrice")}
              />

              <Input<ProductFormValues>
                label={tLive("Fields.StockQuantity")}
                name="stockQuantity"
                type="number"
                register={register}
                errors={errors}
                required
                placeholder={tLive("Placeholders.StockQuantity")}
              />

              <Input<ProductFormValues>
                label={tLive("Fields.SKU")}
                name="sku"
                type="text"
                register={register}
                placeholder={tLive("Placeholders.SKU")}
              />
            </div>

            <Separator className="bg-border" />
            <SectionLabel>{tLive("Labels.Variants")}</SectionLabel>
            <Field>
              <FieldLabel htmlFor="sizes" className="text-sm font-semibold">
                {tLive("Fields.AvailableSizes")}
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
                          {sizes((key) => tLive(key as never)).map((size) => {
                            const isSelected = selectedSizes.includes(
                              size.value,
                            );

                            return (
                              <Button
                                key={size.value}
                                type="button"
                                variant="outline"
                                className={cn(`h-11 w-11 bg-white`, {
                                  "bg-primary/20 border-2": isSelected,
                                })}
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
                {tLive("Fields.ColorVariants")}
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
                          {listOfColors.map((color) => {
                            const isSelected = selectedColors.includes(
                              color.value,
                            );

                            return (
                              <Button
                                key={color.value}
                                type="button"
                                variant="outline"
                                className={cn(
                                  "h-8 w-8 rounded-full border border-border",
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
                          <div className="relative h-8 w-8">
                            <Button
                              variant="outline"
                              className="w-8 h-8 rounded-full border-2 border-dashed bg-white"
                            ></Button>
                            <input
                              type="color"
                              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                              onChange={(event) => {
                                setListOfColors((prevColors) => [
                                  ...prevColors,
                                  {
                                    value: event.target.value,
                                    label: event.target.value,
                                  },
                                ]);

                                field.onChange([
                                  event.target.value,
                                  ...selectedColors,
                                ]);
                              }}
                            />
                          </div>
                        </div>

                        {selectedColors.length ? (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {selectedColors.map((colorValue) => {
                              const label = listOfColors.find(
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
                                  {label ?? colorValue}
                                  <span
                                    className="text-muted-foreground cursor-pointer"
                                    onClick={() => {
                                      const nextColors = selectedColors.filter(
                                        (color) => color !== colorValue,
                                      );
                                      field.onChange(nextColors);
                                    }}
                                  >
                                    x
                                  </span>
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
                {tLive("Fields.OccasionTags")}
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
                          {occasions((key) => tLive(key as never)).map(
                            (occasion) => {
                              const isSelected = selectedOccasions.includes(
                                occasion.value,
                              );

                              return (
                                <Badge
                                  key={occasion.value}
                                  variant="outline"
                                  className={cn(
                                    `h-7 text-sm px-4 cursor-pointer`,
                                    { "bg-primary/20 border": isSelected },
                                  )}
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
                            },
                          )}
                        </div>
                        <FieldError errors={[errors.occasions]} />
                      </div>
                    );
                  }}
                />
              </FieldContent>
            </Field>

            <Separator className="bg-border" />
            <SectionLabel>{tLive("Labels.DisplayOptions")}</SectionLabel>
            <Switch
              name="showNewBadge"
              control={control}
              label={tLive("Fields.ShowNewBadge")}
              description={tLive("Fields.ShowNewBadgeDescription")}
            />

            <Switch
              name="featuredOnHomepage"
              control={control}
              label={tLive("Fields.FeaturedOnHomepage")}
              description={tLive("Fields.FeaturedOnHomepageDescription")}
            />

            <Controller
              name="productStatus"
              control={control}
              render={({ field }) => {
                const selectedStatus = field.value ?? "active";

                return (
                  <div className="flex gap-2">
                    {productStatuses((key) => tLive(key as never)).map(
                      (status) => {
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
                      },
                    )}
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
