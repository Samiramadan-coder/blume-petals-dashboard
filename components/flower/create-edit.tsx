"use client";

import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Input from "../form/input";
import Header from "../form/header";
import Footer from "../form/footer";
import { Button } from "../ui/button";
import AddButton from "../form/add-button";
import NormalFormTextarea from "../form/textarea";
import ImageUploader from "../form/image-uploader";
import { zodResolver } from "@hookform/resolvers/zod";
import { availableLocales } from "@/constants/shared";
import { useLocale, useTranslations } from "next-intl";
import { useFormLocale } from "@/hooks/use-form-locale";
import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useRef, type ReactNode } from "react";
import { postProductAction } from "@/lib/products-actions";
import { FlowerFormValues, flowerSchema } from "@/types/flower";
import LocaleFormSwitcher from "../reusable/locale-form-switcher";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet";
import { Product, ProductFormValues } from "@/types/products";

// Get default values for the form based on the product data
function getDefaultValues(product?: Product): FlowerFormValues {
  return {
    name: product?.name || { en: "", ar: "" },
    description: product?.description || { en: "", ar: "" },
    images: product?.images.map((image) => image.url) || [],
    variants: [
      {
        price: product ? product.variants[0].price : 0,
        stock: product ? product.variants[0].stock : 0,
      },
    ],
  };
}

export default function CreateEdit({
  trigger,
  product,
}: {
  trigger?: ReactNode;
  product?: Product;
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
    defaultValues: getDefaultValues(product),
  });

  useEffect(() => {
    if (isSubmitted) {
      void triggerValidation();
    }
  }, [activeLocale, isSubmitted, triggerValidation]);

  const onSubmit: SubmitHandler<FlowerFormValues> = async (values) => {
    // console.log(values);
    // const result = await postProductAction(values, product?.id);
    // if (result.success) {
    //   toast.success(
    //     product
    //       ? tCommon("UpdatedSuccessfully")
    //       : tCommon("CreatedSuccessfully"),
    //   );
    //   form.current?.reset();
    //   closeBtn.current?.click();
    //   return;
    // }
    // if (result.errors) {
    //   console.log("Server validation errors:", result.errors); // Log the server validation errors for debugging
    //   Object.entries(result.errors).forEach(([field, message]) => {
    //     toast.error(message);
    //     setError(field as keyof FlowerFormValues, {
    //       type: "server",
    //       message,
    //     });
    //   });
    //   return;
    // }
    // toast.error(product ? tCommon("UpdateFailed") : tCommon("CreationFailed"));
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
          title={product ? t("EditFlower") : t("AddFlower")}
          description={
            product ? t("EditFlowerDescription") : t("AddFlowerDescription")
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
                // Check if current locale is English and there are Arabic field errors
                if (activeLocale === "en") {
                  const hasArErrors = errors.name?.ar || errors.description?.ar;
                  if (hasArErrors) {
                    changeLocale("ar");
                    return;
                  }
                }

                // Check if current locale is Arabic and there are English field errors
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
            <ImageUploader
              key={activeLocale}
              control={control}
              name="images"
              label={tLive("Fields.Photo.Label")}
              required
              buttonLabel={tLive("Fields.Photo.AddPhoto")}
              errors={errors}
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
