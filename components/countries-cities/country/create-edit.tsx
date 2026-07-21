"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
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
import { useLocale, useTranslations } from "next-intl";
import { useFormLocale } from "@/hooks/use-form-locale";
import { useForm, SubmitHandler } from "react-hook-form";
import SectionLabel from "@/components/form/section-label";
import { postCategoryAction } from "@/lib/categories-actions";
import LocaleFormSwitcher from "@/components/reusable/locale-form-switcher";
import {
  Country,
  CountryFormValues,
  countrySchema,
} from "@/types/countries-cities";
import { postCountryAction } from "@/lib/country-cities";

type CreateEditProps = {
  country?: Country;
  trigger?: React.ReactNode;
  totalCreatedItems: number;
};

export default function CreateEdit({
  country,
  trigger,
  totalCreatedItems,
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
  } = useForm<CountryFormValues>({
    defaultValues: {
      name: country?.name || { en: "", ar: "" },
      code: country?.code || "",
      is_active: country?.is_active ?? true,
      sort_order: country?.sort_order || totalCreatedItems + 1,
    },
    resolver: zodResolver(countrySchema((key) => tLive(key as never))),
  });

  // Handle form submission by calling the postCategoryAction function and displaying appropriate success or error messages
  const onSubmit: SubmitHandler<CountryFormValues> = async (data) => {
    const result = await postCountryAction(data, country?.id);

    if (result.success) {
      toast.success(
        country
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
        setError(field as keyof CountryFormValues, {
          type: "server",
          message,
        });
      });
      return;
    }

    toast.error(country ? tCommon("CreationFailed") : tCommon("UpdateFailed"));
  };

  return (
    <Sheet>
      {trigger ? (
        <SheetTrigger asChild>{trigger}</SheetTrigger>
      ) : (
        <AddButton label={t("AddCountry")} />
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

        <Header title={t("AddCountry")} />

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
            {availableLocales.map((lang) => (
              <Input<CountryFormValues>
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

            <Input<CountryFormValues>
              label={tLive("Labels.Code")}
              placeholder={tLive("Placeholders.Code")}
              name="code"
              type="text"
              register={register}
              errors={errors}
              required
            />

            <Separator className="bg-border" />
            <SectionLabel>{tLive("Labels.Visibility")}</SectionLabel>
            <Switch<CountryFormValues>
              name="is_active"
              control={control}
              label={tLive("Labels.Visibility")}
              description={tLive("Labels.VisibilityLabel")}
            />
          </form>
        </div>
        <Footer form={form} loading={isSubmitting} />
      </SheetContent>
    </Sheet>
  );
}
