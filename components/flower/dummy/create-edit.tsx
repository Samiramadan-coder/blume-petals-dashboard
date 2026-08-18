"use client";

import { toast } from "sonner";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import Input from "../../form/input";
import Header from "../../form/header";
import Footer from "../../form/footer";
import { Button } from "../../ui/button";
import AddButton from "../../form/add-button";
import { postFlowerAction } from "@/lib/flower";
import NormalFormTextarea from "../../form/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { availableLocales } from "@/constants/shared";
import { useLocale, useTranslations } from "next-intl";
import { useFormLocale } from "@/hooks/use-form-locale";
import { useForm, SubmitHandler } from "react-hook-form";
import LocaleFormSwitcher from "../../reusable/locale-form-switcher";
import SingleFormImageUploader from "../../form/single-image-uploader";
import { Flower, FlowerFormValues, flowerSchema } from "@/types/flower";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../../ui/sheet";

// Function to get default values for the form,
// either from an existing coupon or default values
function getDefaultValues(flower?: Flower): FlowerFormValues {
  return {
    name: flower?.name || { en: "", ar: "" },
    initial_quantity: flower?.initial_quantity || 0,
    low_stock_threshold: flower?.low_stock_threshold || 0,
    unit_cost: flower?.unit_cost || 0,
    note: flower?.note || { en: "", ar: "" },
    photo: flower?.photo || "",
  };
}

export default function CreateEdit({
  trigger,
  flower,
}: {
  trigger?: React.ReactNode;
  flower?: Flower;
}) {
  const locale = useLocale();
  const t = useTranslations("Flower");
  const tCommon = useTranslations("Common");
  const form = useRef<HTMLFormElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const { activeLocale, changeLocale, dir, isArabic, tLive } =
    useFormLocale("Flower");

  // Initialize the form with react-hook-form and zod validation
  // The form will use default values based on whether a coupon is being edited or a new one is being created
  const {
    register,
    control,
    setError,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<FlowerFormValues>({
    defaultValues: getDefaultValues(flower),
    resolver: zodResolver(flowerSchema(t)),
  });

  // Handle form submission
  // This function will be called when the form is submitted
  const onSubmit: SubmitHandler<FlowerFormValues> = async (data) => {
    const result = await postFlowerAction(data, flower?.id);

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
            className="relative grid grid-cols-1 sm:grid-cols-2 gap-6"
            onSubmit={(e) => handleSubmit(onSubmit)(e)}
          >
            <div className="sm:col-span-2">
              <SingleFormImageUploader
                control={control}
                name="photo"
                label={tLive("Fields.Photo.Label")}
                required
              />
            </div>

            {availableLocales.map((locale) => (
              <Input<FlowerFormValues>
                key={locale}
                label={tLive("Fields.Name.Label")}
                name={`name.${locale}`}
                type="text"
                placeholder={tLive("Fields.Name.Placeholder")}
                className={cn("sm:col-span-2", {
                  hidden: activeLocale !== locale,
                })}
                register={register}
                errors={errors}
                required
              />
            ))}

            <Input<FlowerFormValues>
              name="initial_quantity"
              type="number"
              register={register}
              required
              errors={errors}
              label={tLive("Fields.InitialQuantity.Label")}
              placeholder={tLive("Fields.InitialQuantity.Placeholder")}
              className="sm:col-span-2"
            />

            <Input<FlowerFormValues>
              name="low_stock_threshold"
              type="number"
              register={register}
              required
              errors={errors}
              label={tLive("Fields.LowStockThreshold.Label")}
              placeholder={tLive("Fields.LowStockThreshold.Placeholder")}
              className="sm:col-span-2"
              description={tLive("Fields.LowStockThreshold.Description")}
            />

            <Input<FlowerFormValues>
              name="unit_cost"
              type="number"
              register={register}
              required
              errors={errors}
              label={tLive("Fields.UnitCost.Label")}
              placeholder={tLive("Fields.UnitCost.Placeholder")}
              className="sm:col-span-2"
              description={tLive("Fields.UnitCost.Description")}
            />

            {availableLocales.map((locale) => (
              <NormalFormTextarea<FlowerFormValues>
                key={locale}
                name="note.en"
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
