"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  City,
  CityFormValues,
  citySchema,
  Country,
} from "@/types/countries-cities";

import { toast } from "sonner";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import Input from "@/components/form/input";
import Switch from "@/components/form/switch";
import Footer from "@/components/form/footer";
import Header from "@/components/form/header";
import { Button } from "@/components/ui/button";
import AddButton from "@/components/form/add-button";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { availableLocales } from "@/constants/shared";
import { postCityAction } from "@/lib/country-cities";
import { useLocale, useTranslations } from "next-intl";
import { useFormLocale } from "@/hooks/use-form-locale";
import NormalFormSelect from "@/components/form/select";
import { useForm, SubmitHandler } from "react-hook-form";
import SectionLabel from "@/components/form/section-label";
import LocaleFormSwitcher from "@/components/reusable/locale-form-switcher";

type CreateEditProps = {
  city?: City;
  trigger?: React.ReactNode;
  totalCreatedItems: number;
  countries: Country[];
};

export default function CreateEdit({
  city,
  trigger,
  totalCreatedItems,
  countries,
}: CreateEditProps) {
  const locale = useLocale();
  const t = useTranslations("CountriesCities");
  const tCommon = useTranslations("Common");
  const form = useRef<HTMLFormElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const { activeLocale, changeLocale, dir, isArabic, tLive } =
    useFormLocale("CountriesCities");

  const {
    control,
    register,
    setError,
    clearErrors,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CityFormValues>({
    defaultValues: {
      name: city?.name || { en: "", ar: "" },
      country_id: city?.country_id || 0,
      delivery_fee: city?.delivery_fee
        ? parseFloat(city.delivery_fee.toString())
        : 0,
      is_active: city?.is_active ?? true,
      sort_order: city?.sort_order || totalCreatedItems + 1,
    },
    resolver: zodResolver(citySchema((key) => tLive(key as never))),
  });

  // Handle form submission by calling the postCategoryAction function and displaying appropriate success or error messages
  const onSubmit: SubmitHandler<CityFormValues> = async (data) => {
    const result = await postCityAction(data, city?.id);

    if (result.success) {
      toast.success(
        city ? tCommon("UpdatedSuccessfully") : tCommon("CreatedSuccessfully"),
      );
      form.current?.reset();
      closeBtn.current?.click();
      return;
    }

    if (result.errors) {
      Object.entries(result.errors).forEach(([field, message]) => {
        toast.error(message);
        setError(field as keyof CityFormValues, {
          type: "server",
          message,
        });
      });
      return;
    }

    toast.error(city ? tCommon("UpdateFailed") : tCommon("CreationFailed"));
  };

  return (
    <Sheet>
      {trigger ? (
        <SheetTrigger asChild>{trigger}</SheetTrigger>
      ) : (
        <AddButton label={t("AddCity")} />
      )}

      <SheetContent
        showCloseButton={false}
        className="flex h-full flex-col sm:max-w-2xl"
        side={locale === "ar" ? "left" : "right"}
        onInteractOutside={(event) => event.preventDefault()}
      >
        <SheetClose asChild>
          <Button ref={closeBtn} className="hidden"></Button>
        </SheetClose>

        <Header title={t("AddCity")} />

        <LocaleFormSwitcher
          locale={activeLocale}
          onChange={(locale) => {
            changeLocale(locale);
            clearErrors();
          }}
        />

        <div
          className={cn(`flex-1 overflow-auto px-4 pb-6 pt-2`, {
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
            <SectionLabel>{tLive("Labels.Details")}</SectionLabel>
            <NormalFormSelect<CityFormValues>
              control={control}
              name="country_id"
              label={tLive("Labels.Country")}
              placeholder={tLive("Placeholders.Country")}
              options={countries.map((country) => ({
                label: country.name[activeLocale],
                value: country.id,
              }))}
              required
              dir={dir}
            />

            {availableLocales.map((lang) => (
              <Input<CityFormValues>
                key={lang}
                label={tLive("Labels.Name")}
                placeholder={tLive("Placeholders.Name")}
                name={`name.${lang}`}
                type="text"
                register={register}
                errors={errors}
                required
                className={`${activeLocale === lang ? "" : "hidden"}`}
              />
            ))}

            <Input<CityFormValues>
              label={tLive("Labels.DeliveryFee")}
              placeholder={tLive("Placeholders.DeliveryFee")}
              name="delivery_fee"
              type="number"
              register={register}
              errors={errors}
              required
              suffix={tLive("AED")}
            />

            <Separator className="bg-border" />
            <SectionLabel>{tLive("Labels.Visibility")}</SectionLabel>
            <Switch<CityFormValues>
              name="is_active"
              control={control}
              label={tLive("Labels.Visibility")}
            />
          </form>
        </div>
        <Footer form={form} loading={isSubmitting} />
      </SheetContent>
    </Sheet>
  );
}
