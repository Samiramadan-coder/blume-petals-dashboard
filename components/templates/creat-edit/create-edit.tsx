"use client";

import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Variants from "./variants";
import Input from "../../form/input";
import Header from "../../form/header";
import Footer from "../../form/footer";
import { Button } from "../../ui/button";
import { Product } from "@/types/products";
import AddButton from "../../form/add-button";
import { Separator } from "../../ui/separator";
import { postTemplateAction } from "@/lib/templates";
import ImageUploader from "../../form/image-uploader";
import { zodResolver } from "@hookform/resolvers/zod";
import { availableLocales } from "@/constants/shared";
import { useLocale, useTranslations } from "next-intl";
import { useFormLocale } from "@/hooks/use-form-locale";
import { useEffect, useRef, type ReactNode } from "react";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import LocaleFormSwitcher from "../../reusable/locale-form-switcher";
import { TemplateFormValues, templateSchema } from "@/types/custom-builder";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../../ui/sheet";

// CreateEdit component for adding or editing a product
export default function CreateEdit({
  trigger,
  template,
  firstCategoryId,
}: {
  trigger?: ReactNode;
  template?: Product;
  firstCategoryId: number;
}) {
  const locale = useLocale();
  const t = useTranslations("CustomBuilder");
  const tCommon = useTranslations("Common");
  const form = useRef<HTMLFormElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const { activeLocale, changeLocale, dir, isArabic, tLive } =
    useFormLocale("CustomBuilder");

  const {
    register,
    control,
    handleSubmit,
    setError,
    setValue,
    getValues,
    trigger: triggerValidation,
    formState: { errors, isSubmitting, isSubmitted },
  } = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema((key) => tLive(key as never))),
    defaultValues: {
      name: template?.name ?? { en: "", ar: "" },
      sku: template?.sku ?? "",
      status: "published",
      is_purchasable: true,
      show_in_builder: false,
      category_id: firstCategoryId,
      tags: template?.tags ?? [],
      images: template?.images.map((image) => image.url) ?? [],
      variants: template?.variants.length
        ? template?.variants.map((variant) => ({
            id: variant.id,
            sku: variant.sku || "",
            price: variant.price || 0,
            size: variant.size || "",
            min_stems: variant.min_stems || 0,
            max_stems: variant.max_stems || 0,
          }))
        : [
            {
              sku: "",
              price: 0,
              size: "",
              min_stems: 0,
              max_stems: 0,
            },
          ],
    },
  });

  // Trigger validation when the active locale changes, if the form has been submitted
  useEffect(() => {
    if (isSubmitted) void triggerValidation();
  }, [activeLocale, isSubmitted, triggerValidation]);

  // Watch the variants field to dynamically update the form when variants change
  const watchedVariants = useWatch({ control, name: "variants" });

  // Handle form submission for creating or updating a product
  // The onSubmit function sends the form data to the server and handles success or error responses
  const onSubmit: SubmitHandler<TemplateFormValues> = async (values) => {
    const preparedValues = {
      ...values,
      variants: values.variants.map((v, index) => ({
        ...v,
        sku: values.tags[0] + "-" + index,
      })),
    };

    const result = await postTemplateAction(preparedValues, template?.id);

    if (result.success) {
      toast.success(
        template
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
        setError(field as keyof TemplateFormValues, {
          type: "server",
          message,
        });
      });
      return;
    }

    toast.error(template ? tCommon("UpdateFailed") : tCommon("CreationFailed"));
  };

  return (
    <Sheet>
      {trigger ? (
        <SheetTrigger asChild>{trigger}</SheetTrigger>
      ) : (
        <AddButton label={t("AddTemplate")} />
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
          title={template ? t("EditTemplate") : t("AddTemplate")}
          description={t("AddTemplateDescription")}
        />

        <LocaleFormSwitcher
          locale={activeLocale}
          onChange={(locale) => {
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
                  const hasArErrors = errors.name?.ar;
                  if (hasArErrors) {
                    changeLocale("ar");
                    return;
                  }
                }

                if (activeLocale === "ar") {
                  const hasEnErrors = errors.name?.en;
                  if (hasEnErrors) {
                    changeLocale("en");
                    return;
                  }
                }
              })(e);
            }}
            className="space-y-6 relative"
          >
            <ImageUploader
              control={control}
              name="images"
              label={tLive("Fields.Photo.Label")}
              required
              buttonLabel={tLive("Fields.Photo.AddPhoto")}
              errors={errors}
            />

            {availableLocales.map((locale) => (
              <Input<TemplateFormValues>
                key={locale}
                label={tLive("Fields.Name.Label")}
                name={`name.${locale}`}
                type="text"
                placeholder={tLive("Fields.Name.Placeholder")}
                className={cn({
                  hidden: activeLocale !== locale,
                })}
                register={register}
                errors={errors}
                required
              />
            ))}

            <Input<TemplateFormValues>
              label={tLive("Fields.SKU.Label")}
              name="sku"
              type="text"
              placeholder={tLive("Fields.SKU.Placeholder")}
              register={register}
              errors={errors}
              required
            />

            <Input<TemplateFormValues>
              label={tLive("Fields.Tags.Label")}
              name="tags.0"
              type="text"
              placeholder={tLive("Fields.Tags.Placeholder")}
              register={register}
              errors={errors}
              required
            />

            <Separator className="bg-border" />
            <Variants
              register={register}
              errors={errors}
              variants={watchedVariants}
              tLive={tLive}
              setValue={setValue}
              getValues={getValues}
              templateId={template?.id}
            />
          </form>
        </div>

        <Footer form={form} loading={isSubmitting} />
      </SheetContent>
    </Sheet>
  );
}
