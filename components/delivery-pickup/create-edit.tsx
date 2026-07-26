"use client";

import {
  DeliveryPickupLocation,
  DeliveryPickupLocationFormValues,
  deliveryPickupLocationSchema,
} from "@/types/delivery-pickup-locations";

import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Input from "../form/input";
import Select from "../form/select";
import Switch from "../form/switch";
import Footer from "../form/footer";
import { Button } from "../ui/button";
import React, { useRef } from "react";
import FormHeader from "../form/header";
import RichText from "../form/rich-text";
import AddButton from "../form/add-button";
import { City } from "@/types/countries-cities";
import LocationPicker from "../form/location-picker";
import { availableLocales } from "@/constants/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useFormLocale } from "@/hooks/use-form-locale";
import LocaleFormSwitcher from "../reusable/locale-form-switcher";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet";
import { useForm, SubmitHandler, Controller, useWatch } from "react-hook-form";
import { postDeliveryPickupLocationAction } from "@/lib/delivery-pickup-locations";

function getDefaultValues(location?: DeliveryPickupLocation) {
  return {
    name: location?.name || { en: "", ar: "" },
    address: location?.address || { en: "", ar: "" },
    ready_in_text: location?.ready_in_text || { en: "", ar: "" },
    hours: location?.hours || "",
    city_id: location?.city_id || 0,
    latitude: location?.latitude ? parseFloat(location.latitude) : 25.2048,
    longitude: location?.longitude ? parseFloat(location.longitude) : 55.2708,
    is_active: location?.is_active ?? true,
  };
}

export default function CreateEdit({
  cities,
  trigger,
  location,
}: {
  cities: City[];
  trigger?: React.ReactNode;
  location?: DeliveryPickupLocation;
}) {
  const locale = useLocale();
  const tCommon = useTranslations("Common");
  const form = useRef<HTMLFormElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const t = useTranslations("DeliveryPickupLocations");
  const { activeLocale, changeLocale, dir, isArabic, tLive } = useFormLocale(
    "DeliveryPickupLocations",
  );

  const {
    register,
    control,
    setValue,
    handleSubmit,
    clearErrors,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<DeliveryPickupLocationFormValues>({
    defaultValues: getDefaultValues(location),
    resolver: zodResolver(
      deliveryPickupLocationSchema((key) => tLive(key as never)),
    ),
  });

  // Watch latitude and longitude fields to update the LocationPicker component
  const watchLatitude = useWatch({ control, name: "latitude" });
  const watchLongitude = useWatch({ control, name: "longitude" });

  // Handle form submission
  const onSubmit: SubmitHandler<DeliveryPickupLocationFormValues> = async (
    data,
  ) => {
    const result = await postDeliveryPickupLocationAction(data, location?.id);

    if (result.success) {
      toast.success(
        location
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
        setError(field as keyof DeliveryPickupLocationFormValues, {
          type: "server",
          message,
        });
      });

      return;
    }

    toast.error(location ? tCommon("UpdateFailed") : tCommon("CreationFailed"));
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
            <div className="col-span-1 md:col-span-2">
              <Controller
                control={control}
                name="latitude"
                render={() => (
                  <LocationPicker
                    value={{
                      latitude: watchLatitude,
                      longitude: watchLongitude,
                    }}
                    onChange={(location) => {
                      setValue("latitude", location.latitude);
                      setValue("longitude", location.longitude);
                    }}
                  />
                )}
              />
            </div>

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
          </form>
        </div>

        <Footer form={form} loading={isSubmitting} />
      </SheetContent>
    </Sheet>
  );
}
