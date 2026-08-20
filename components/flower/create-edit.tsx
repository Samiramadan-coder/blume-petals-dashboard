"use client";

import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Input from "../form/input";
import Header from "../form/header";
import Footer from "../form/footer";
import { Button } from "../ui/button";
import AddButton from "../form/add-button";
import { Product } from "@/types/products";
import NormalFormTextarea from "../form/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { availableLocales } from "@/constants/shared";
import { useLocale, useTranslations } from "next-intl";
import { useFormLocale } from "@/hooks/use-form-locale";
import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useRef, type ReactNode } from "react";
import { postProductAction } from "@/lib/products";
import { FlowerFormValues, flowerSchema } from "@/types/flower";
import LocaleFormSwitcher from "../reusable/locale-form-switcher";
import SingleFormImageUploader from "../form/single-image-uploader";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet";

export default function CreateEdit({
  trigger,
  flower,
  firstCategoryId,
}: {
  trigger?: ReactNode;
  flower?: Product;
  firstCategoryId: number;
}) {
  const locale = useLocale();
  const t = useTranslations("Flower");
  const tCommon = useTranslations("Common");
  const form = useRef<HTMLFormElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const { activeLocale, changeLocale, dir, isArabic, tLive } =
    useFormLocale("Flower");

  const {
    register,
    control,
    handleSubmit,
    setError,
    trigger: triggerValidation,
    formState: { errors, isSubmitting, isSubmitted },
  } = useForm<FlowerFormValues>({
    resolver: zodResolver(flowerSchema((key) => tLive(key as never))),
    defaultValues: {
      name: flower?.name || { en: "", ar: "" },
      description: flower?.description || { en: "", ar: "" },
      images: flower?.images.map((image) => image.url) || [],
      category_id: flower?.category_id || firstCategoryId,
      status: "published",
      show_in_builder: true,
      variants: [
        {
          price: flower ? flower.variants[0].price : undefined,
          stock: flower ? flower.variants[0].stock : undefined,
          sku: flower ? flower.variants[0].sku : "",
        },
      ],
    },
  });

  // Use Effect to Trigger Validation on Locale Change
  // This effect runs whenever the active locale changes or the form has been submitted.
  useEffect(() => {
    if (isSubmitted) {
      void triggerValidation();
    }
  }, [activeLocale, isSubmitted, triggerValidation]);

  // Form Submission Handler
  // This function handles the form submission for creating or editing a flower product.
  // It uses the `postProductAction` function to send the form data to the server.
  // If the submission is successful, it shows a success toast message and resets the form.
  // If there are validation errors, it displays error messages for each field.
  // If the submission fails for other reasons, it shows a generic error message.
  const onSubmit: SubmitHandler<FlowerFormValues> = async (values) => {
    const result = await postProductAction(values, flower?.id);

    if (result.success) {
      toast.success(
        flower
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
        setError(field as keyof FlowerFormValues, {
          type: "server",
          message,
        });
      });
      return;
    }

    toast.error(flower ? tCommon("UpdateFailed") : tCommon("CreationFailed"));
  };

  return (
    <Sheet>
      {trigger ? (
        <SheetTrigger asChild>{trigger}</SheetTrigger>
      ) : (
        <AddButton label={t("AddFlower")} />
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
          title={flower ? t("EditFlower") : t("AddFlower")}
          description={
            flower ? t("EditFlowerDescription") : t("AddFlowerDescription")
          }
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
                  const hasArErrors = errors.name?.ar || errors.description?.ar;
                  if (hasArErrors) {
                    changeLocale("ar");
                    return;
                  }
                }

                if (activeLocale === "ar") {
                  const hasEnErrors = errors.name?.en || errors.description?.en;
                  if (hasEnErrors) {
                    changeLocale("en");
                    return;
                  }
                }
              })(e);
            }}
            className="space-y-6 relative"
          >
            <SingleFormImageUploader
              control={control}
              name="images.0"
              label={tLive("Fields.Photo.Label")}
              required
            />

            {availableLocales.map((locale) => (
              <Input<FlowerFormValues>
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

            <Input<FlowerFormValues>
              label={tLive("Fields.ProductSku.Label")}
              name="sku"
              type="text"
              register={register}
              errors={errors}
              required
              placeholder={tLive("Fields.ProductSku.Placeholder")}
            />

            <Input<FlowerFormValues>
              label={tLive("Fields.InitialQuantity.Label")}
              name={`variants.0.stock`}
              type="number"
              register={register}
              errors={errors}
              required
              placeholder={tLive("Fields.InitialQuantity.Placeholder")}
            />

            <Input<FlowerFormValues>
              label={tLive("Fields.UnitCost.Label")}
              name={`variants.0.price`}
              type="number"
              register={register}
              errors={errors}
              required
              placeholder={tLive("Fields.UnitCost.Placeholder")}
            />

            <Input<FlowerFormValues>
              label={tLive("Fields.VariantSku.Label")}
              name="variants.0.sku"
              type="text"
              register={register}
              errors={errors}
              required
              placeholder={tLive("Fields.VariantSku.Placeholder")}
            />

            {availableLocales.map((locale) => (
              <NormalFormTextarea<FlowerFormValues>
                key={locale}
                name={`description.${locale}`}
                register={register}
                label={tLive("Fields.Note.Label")}
                placeholder={tLive("Fields.Note.Placeholder")}
                className={cn("sm:col-span-2", {
                  hidden: activeLocale !== locale,
                })}
              />
            ))}
          </form>
        </div>

        <Footer form={form} loading={isSubmitting} />
      </SheetContent>
    </Sheet>
  );
}
