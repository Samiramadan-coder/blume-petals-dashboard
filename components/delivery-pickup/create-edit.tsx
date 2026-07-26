"use client";

import Input from "../form/input";
import Select from "../form/select";
import Switch from "../form/switch";
import Footer from "../form/footer";
import { Button } from "../ui/button";
import FormHeader from "../form/header";
import RichText from "../form/rich-text";
import AddButton from "../form/add-button";
import { City } from "@/types/countries-cities";
import LocaleFormSwitcher from "../reusable/locale-form-switcher";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet";
import { useLocale, useTranslations } from "next-intl";
import React, { useRef } from "react";
import { cn } from "@/lib/utils";
import { useFormLocale } from "@/hooks/use-form-locale";
import { availableLocales } from "@/constants/shared";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  DeliveryPickupLocationFormValues,
  deliveryPickupLocationSchema,
} from "@/types/delivery-pickup-locations";
import { zodResolver } from "@hookform/resolvers/zod";

export default function CreateEdit({
  cities,
  trigger,
}: {
  cities: City[];
  trigger?: React.ReactNode;
}) {
  const locale = useLocale();
  const closeBtn = useRef<HTMLButtonElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const t = useTranslations("DeliveryPickupLocations");
  const { activeLocale, changeLocale, dir, isArabic, tLive } = useFormLocale(
    "DeliveryPickupLocations",
  );

  const {
    register,
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    clearErrors,
  } = useForm<DeliveryPickupLocationFormValues>({
    resolver: zodResolver(
      deliveryPickupLocationSchema((key) => tLive(key as never)),
    ),
  });

  const onSubmit: SubmitHandler<DeliveryPickupLocationFormValues> = async (
    data,
  ) => {
    console.log(data);
  };

  return (
    <Sheet>
      {trigger ? (
        <SheetTrigger asChild>{trigger}</SheetTrigger>
      ) : (
        <AddButton label={true ? t("AddLocation") : t("EditLocation")} />
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

        <FormHeader
          title={true ? t("AddLocation") : t("EditLocation")}
          description={true ? t("Description") : t("Description")}
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
            {availableLocales.map((locale) => (
              <React.Fragment key={locale}>
                <Input<DeliveryPickupLocationFormValues>
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

                <Input<DeliveryPickupLocationFormValues>
                  label={tLive("Fields.ReadyInText.Label")}
                  name={`ready_in_text.${locale}`}
                  type="text"
                  placeholder={tLive("Fields.ReadyInText.Placeholder")}
                  className={cn({
                    hidden: activeLocale !== locale,
                  })}
                  register={register}
                  errors={errors}
                  required
                />

                <RichText<DeliveryPickupLocationFormValues>
                  control={control}
                  label={tLive("Fields.Address.Label")}
                  name={`address.${locale}`}
                  placeholder={tLive("Fields.Address.Placeholder")}
                  required
                  className={cn({
                    hidden: activeLocale !== locale,
                  })}
                />
              </React.Fragment>
            ))}

            <Input<DeliveryPickupLocationFormValues>
              label={tLive("Fields.Hours.Label")}
              name="hours"
              type="text"
              placeholder={tLive("Fields.Hours.Placeholder")}
              register={register}
              errors={errors}
              required
            />

            <Select<DeliveryPickupLocationFormValues>
              control={control}
              label={tLive("Fields.City.Label")}
              name="city_id"
              placeholder={tLive("Fields.City.Placeholder")}
              required
              dir={dir}
              options={cities.map((city) => ({
                value: city.id,
                label: city.name[activeLocale],
              }))}
            />

            <Switch
              name="is_active"
              control={control}
              label={tLive("Fields.IsActive.Label")}
              description={tLive("Fields.IsActive.Description")}
            />

            {/* <Select<DeliveryPickupLocationFormValues>
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
            /> */}

            {/* <Input<DeliveryPickupLocationFormValues>
              label={tLive("Fields.SKU")}
              name="sku"
              type="text"
              placeholder={tLive("Placeholders.SKU")}
              register={register}
              errors={errors}
              required
            /> */}

            {/* {availableLocales.map((locale) => (
              <div
                key={locale}
                className={cn({
                  hidden: activeLocale !== locale,
                })}
              >
                <RichText<DeliveryPickupLocationFormValues>
                  key={activeLocale}
                  control={control}
                  label={tLive("Fields.Description")}
                  name={`description.${locale}`}
                  placeholder={tLive("Placeholders.Description")}
                />
              </div>
            ))} */}

            {/* <Switch
              name="is_new"
              control={control}
              label={tLive("Fields.ShowNewBadge")}
              description={tLive("Fields.ShowNewBadgeDescription")}
            /> */}
          </form>
        </div>

        <Footer form={form} loading={isSubmitting} />
      </SheetContent>
    </Sheet>
  );
}
