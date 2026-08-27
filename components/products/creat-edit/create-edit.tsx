"use client";

import { toast } from "sonner";
import Variants from "./variants";
import Occasions from "./occasions";
import Input from "../../form/input";
import Header from "../../form/header";
import Footer from "../../form/footer";
import Select from "../../form/select";
import Switch from "../../form/switch";
import { Button } from "../../ui/button";
import { Occasion } from "@/types/occasions";
import AddButton from "../../form/add-button";
import { Category } from "@/types/categories";
import { Separator } from "../../ui/separator";
import StatusSelector from "./status-selector";
// import NormalFormTagsInput from "../../form/tags";
import { postProductAction } from "@/lib/products";
import SectionLabel from "../../form/section-label";
import ImageUploader from "../../form/image-uploader";
import { zodResolver } from "@hookform/resolvers/zod";
import { availableLocales } from "@/constants/shared";
import { useLocale, useTranslations } from "next-intl";
import { useFormLocale } from "@/hooks/use-form-locale";
import { useEffect, useRef, type ReactNode } from "react";
import { cn, getProductDefaultValues } from "@/lib/utils";
import NormalFormRichText from "@/components/form/rich-text";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import LocaleFormSwitcher from "../../reusable/locale-form-switcher";
import { Product, ProductFormValues, productSchema } from "@/types/products";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../../ui/sheet";

// CreateEdit component for adding or editing a product
export default function CreateEdit({
  trigger,
  product,
  categories,
  occasions,
  type,
  flowers,
}: {
  trigger?: ReactNode;
  product?: Product;
  categories: Category[];
  occasions: Occasion[];
  type: "default" | "addon";
  flowers: Product[];
}) {
  const locale = useLocale();
  const t = useTranslations("Products");
  const tCommon = useTranslations("Common");
  const form = useRef<HTMLFormElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const { changeLocale: changeLocaleCommon, tLive: tLiveCommon } =
    useFormLocale("Common");
  const { activeLocale, changeLocale, dir, isArabic, tLive } =
    useFormLocale("Products");

  const {
    register,
    control,
    handleSubmit,
    setError,
    setValue,
    getValues,
    trigger: triggerValidation,
    formState: { errors, isSubmitting, isSubmitted },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema((key) => tLive(key as never))),
    defaultValues: getProductDefaultValues(type, product),
  });

  // Trigger validation when the active locale changes, if the form has been submitted
  useEffect(() => {
    if (isSubmitted) void triggerValidation();
  }, [activeLocale, isSubmitted, triggerValidation]);

  // Watch the variants field to dynamically update the form when variants change
  const watchedVariants = useWatch({ control, name: "variants" });

  // Handle form submission for creating or updating a product
  // The onSubmit function sends the form data to the server and handles success or error responses
  const onSubmit: SubmitHandler<ProductFormValues> = async (values) => {
    const result = await postProductAction(values, product?.id);

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
      Object.entries(result.errors).forEach(([field, message]) => {
        toast.error(message);
        setError(field as keyof ProductFormValues, {
          type: "server",
          message,
        });
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
        <AddButton
          label={type === "default" ? t("AddProduct") : t("AddAddOnsProduct")}
        />
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

        <Header
          title={
            product
              ? type === "default"
                ? t("EditProduct")
                : t("EditAddOnsProduct")
              : type === "default"
                ? t("AddProduct")
                : t("AddAddOnsProduct")
          }
          description={
            type === "default"
              ? t("AddProductDescription")
              : t("AddAddOnsProductDescription")
          }
        />

        <LocaleFormSwitcher
          locale={activeLocale}
          onChange={(locale) => {
            changeLocaleCommon(locale);
            changeLocale(locale);
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
              void handleSubmit(onSubmit, (errors) => {
                if (activeLocale === "en") {
                  const hasArErrors = errors.name?.ar || errors.description?.ar;
                  if (hasArErrors) {
                    changeLocale("ar");
                    changeLocaleCommon("ar");
                    return;
                  }
                }

                if (activeLocale === "ar") {
                  const hasEnErrors = errors.name?.en || errors.description?.en;
                  if (hasEnErrors) {
                    changeLocale("en");
                    changeLocaleCommon("en");
                    return;
                  }
                }
              })(e);
            }}
            className="space-y-6 relative"
          >
            <ImageUploader
              key={activeLocale}
              control={control}
              name="images"
              label={tLive("Fields.Photo")}
              required
              buttonLabel={tLive("AddPhoto")}
              errors={errors}
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

            <Input<ProductFormValues>
              label={tLive("Fields.SKU")}
              name="sku"
              type="text"
              placeholder={tLive("Placeholders.SKU")}
              register={register}
              errors={errors}
              required
            />

            {availableLocales.map((locale) => (
              <div
                key={locale}
                className={cn({
                  hidden: activeLocale !== locale,
                })}
              >
                <NormalFormRichText<ProductFormValues>
                  key={activeLocale}
                  control={control}
                  label={tLive("Fields.Description")}
                  name={`description.${locale}`}
                  placeholder={tLive("Placeholders.Description")}
                />
              </div>
            ))}

            {availableLocales.map((locale) => (
              <div
                key={locale}
                className={cn({
                  hidden: activeLocale !== locale,
                })}
              >
                <NormalFormRichText<ProductFormValues>
                  key={activeLocale}
                  control={control}
                  label={tLive("Fields.ETA")}
                  name={`eta_text.${locale}`}
                  placeholder={tLive("Placeholders.ETA")}
                />
              </div>
            ))}

            {type === "default" && (
              <Occasions
                activeLocale={activeLocale}
                control={control}
                occasions={occasions}
                tLive={tLive}
              />
            )}

            <Separator className="bg-border" />
            <Variants
              register={register}
              errors={errors}
              control={control}
              variants={watchedVariants}
              tLive={tLive}
              tLiveCommon={tLiveCommon}
              dir={dir}
              flowers={flowers}
              activeLocale={activeLocale}
              setValue={setValue}
              getValues={getValues}
              productId={product?.id}
              type={type}
            />

            <Separator className="bg-border" />
            <SectionLabel>{tLive("Labels.DisplayOptions")}</SectionLabel>
            <Switch
              name="is_new"
              control={control}
              label={tLive("Fields.ShowNewBadge")}
              description={tLive("Fields.ShowNewBadgeDescription")}
            />

            <StatusSelector control={control} tLive={tLive} />
          </form>
        </div>

        <Footer form={form} loading={isSubmitting} />
      </SheetContent>
    </Sheet>
  );
}
