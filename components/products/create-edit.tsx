"use client";

import {
  Controller,
  SubmitHandler,
  useForm,
  useWatch,
  type Path,
} from "react-hook-form";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Input from "../form/input";
import { Badge } from "../ui/badge";
import Header from "../form/header";
import Footer from "../form/footer";
import Select from "../form/select";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import RichText from "../form/rich-text";
import AddButton from "../form/add-button";
import { Separator } from "../ui/separator";
import { Occasion } from "@/types/occasions";
import { Category } from "@/types/categories";
import SectionLabel from "../form/section-label";
import ImageUploader from "../form/image-uploader";
import { zodResolver } from "@hookform/resolvers/zod";
import { availableLocales } from "@/constants/shared";
import { useLocale, useTranslations } from "next-intl";
import { useFormLocale } from "@/hooks/use-form-locale";
import { useRef, useState, type ReactNode } from "react";
import { postProductAction } from "@/lib/products-actions";
import { productStatuses, sizes } from "@/constants/products";
import LocaleFormSwitcher from "../reusable/locale-form-switcher";
import { Field, FieldContent, FieldError, FieldLabel } from "../ui/field";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet";
import { Product, ProductFormValues, productSchema } from "@/types/products";

function getDefaultValues(product?: Product): ProductFormValues {
  return {
    name: product?.name || { en: "", ar: "" },
    description: product?.description || { en: "", ar: "" },
    category_id: product?.category_id || 0,
    occasion_ids: product?.occasion_ids || [],
    sku: product?.sku || "",
    status: product?.status || "published",
    images: product?.images.map((image) => image.url) || [],
    variants: product?.variants.map((variant) => ({
      id: variant.id,
      sku: variant.sku,
      size: variant.size,
      price: variant.price,
      stock: variant.stock,
      compare_at_price: variant.compare_at_price,
      color_hex: variant.color_hex,
      in_stock: variant.in_stock,
      is_on_sale: variant.is_on_sale,
    })) || [
      {
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
    ],
  };
}

export default function CreateEdit({
  trigger,
  product,
  categories,
  occasions,
}: {
  trigger?: ReactNode;
  product?: Product;
  categories: Category[];
  occasions: Occasion[];
}) {
  const locale = useLocale();
  const t = useTranslations("Products");
  const tCommon = useTranslations("Common");
  const form = useRef<HTMLFormElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const [productId, setProductId] = useState<number | undefined>(product?.id);
  const { activeLocale, changeLocale, dir, isArabic, tLive } =
    useFormLocale("Products");

  const {
    register,
    control,
    handleSubmit,
    getValues,
    setValue,
    clearErrors,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema((key) => tLive(key as never))),
    defaultValues: getDefaultValues(product),
  });

  const watchedVariants = useWatch({
    control,
    name: "variants",
  });

  const onSubmit: SubmitHandler<ProductFormValues> = async (values) => {
    const result = await postProductAction(values, productId);

    if (result.success) {
      toast.success(
        product
          ? tCommon("UpdatedSuccessfully")
          : tCommon("CreatedSuccessfully"),
      );
      form.current?.reset();
      closeBtn.current?.click();
      return;
    }

    if (result.errors) {
      setProductId(result.productId);
      const shownMessages = new Set<string>();

      Object.entries(result.errors).forEach(([field, message]) => {
        const normalizedField = field.replace(/\[(\d+)\]/g, ".$1");
        setError(normalizedField as Path<ProductFormValues>, {
          type: "server",
          message,
        });
        if (!shownMessages.has(message)) {
          shownMessages.add(message);
          toast.error(message);
        }
      });

      return;
    }

    toast.error(product ? tCommon("UpdateFailed") : tCommon("CreationFailed"));
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
        <SheetClose asChild>
          <Button ref={closeBtn} className="hidden"></Button>
        </SheetClose>

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
            onSubmit={(e) => {
              void handleSubmit(onSubmit)(e);
            }}
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
            {availableLocales.map((locale) => (
              <Input<ProductFormValues>
                key={locale}
                label={tLive("Fields.Name")}
                name={`name.${locale}`}
                type="text"
                placeholder={tLive("Placeholders.Name")}
                className={cn({
                  hidden: activeLocale !== locale,
                })}
                register={register}
                errors={errors}
                required
              />
            ))}

            <Select<ProductFormValues>
              control={control}
              label={tLive("Fields.Category")}
              name="category_id"
              placeholder={tLive("Placeholders.Category")}
              required
              dir={dir}
              options={categories.map((category) => ({
                value: category.id,
                label: category.name[activeLocale],
              }))}
            />

            {availableLocales.map((locale) => (
              <div
                key={locale}
                className={cn({
                  hidden: activeLocale !== locale,
                })}
              >
                <RichText<ProductFormValues>
                  key={activeLocale}
                  control={control}
                  label={tLive("Fields.Description")}
                  name={`description.${locale}`}
                  placeholder={tLive("Placeholders.Description")}
                  required
                />
              </div>
            ))}

            <Input<ProductFormValues>
              label={tLive("Fields.SKU")}
              name="sku"
              type="text"
              placeholder={tLive("Placeholders.SKU")}
              register={register}
              errors={errors}
              required
            />

            <Separator className="bg-border" />
            <Field>
              <FieldLabel htmlFor="occasions" className="text-sm font-semibold">
                {tLive("Fields.OccasionTags")}
                <span className="text-red-500">*</span>
              </FieldLabel>

              <FieldContent>
                <Controller
                  name="occasion_ids"
                  control={control}
                  render={({ field }) => {
                    const selectedOccasions = field.value ?? [];

                    return (
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap gap-2">
                          {occasions.map((occasion) => {
                            const isSelected = selectedOccasions.includes(
                              occasion.id,
                            );

                            return (
                              <Badge
                                key={occasion.id}
                                variant="outline"
                                className={cn(
                                  `h-7 text-sm px-4 cursor-pointer`,
                                  { "bg-primary/20 border": isSelected },
                                )}
                                onClick={() => {
                                  const nextOccasions = isSelected
                                    ? selectedOccasions.filter(
                                        (i) => i !== occasion.id,
                                      )
                                    : [...selectedOccasions, occasion.id];
                                  field.onChange(nextOccasions);
                                }}
                              >
                                {occasion.name_translations[activeLocale]}
                              </Badge>
                            );
                          })}
                        </div>
                        <FieldError errors={[errors.occasion_ids]} />
                      </div>
                    );
                  }}
                />
              </FieldContent>
            </Field>

            <Separator className="bg-border" />
            <div className="space-y-4">
              <div className="flex items-center gap-2 justify-between">
                <SectionLabel>{tLive("Labels.Variants")}</SectionLabel>
                <Button
                  type="button"
                  onClick={() => {
                    const currentVariants = getValues("variants") || [];
                    setValue("variants", [
                      ...currentVariants,
                      {
                        sku: "",
                        size: "",
                        price: 0,
                        stock: 0,
                        compare_at_price: null,
                      },
                    ]);
                  }}
                >
                  <Plus />
                </Button>
              </div>
              {watchedVariants.map((_, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-border p-4 rounded-md bg-primary/10"
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
                    className="md:col-span-2"
                    placeholder={tLive("Placeholders.ComparePrice")}
                    errors={errors}
                  />
                </div>
              ))}
            </div>

            {/* <Separator className="bg-border" />
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
            </Field> */}

            {/* <Field>
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
            </Field> */}

            {/* <Separator className="bg-border" />
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
            /> */}

            <Separator className="bg-border" />
            <Controller
              name="status"
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

        <Footer form={form} loading={isSubmitting} />
      </SheetContent>
    </Sheet>
  );
}
