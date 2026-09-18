"use client";

import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { saveSettings } from "@/lib/settings";
import NormalFormRichText from "../form/rich-text";
import { availableLocales } from "@/constants/shared";
import { useTranslations } from "next-intl";
import { useFormLocale } from "@/hooks/use-form-locale";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { Settings, SettingsSchema } from "@/types/settings";
import LocaleFormSwitcher from "../reusable/locale-form-switcher";
import { usePermissions } from "@/providers/permission-providers";
import SingleFormImageUploader from "../form/single-image-uploader";
import ModuleHeader from "../reusable/module-header";
import { Checkbox } from "../ui/checkbox";
import NormalFormInput from "../form/input";
import { Field, FieldGroup, FieldLabel } from "../ui/field";

export default function DataPreview({ settings }: { settings: Settings }) {
  const { can } = usePermissions();
  const t = useTranslations("Settings");
  const tCommon = useTranslations("Common");
  const { activeLocale, changeLocale, dir, isArabic, tLive } =
    useFormLocale("Settings");

  const {
    register,
    control,
    setError,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<SettingsSchema>({
    defaultValues: settings,
  });

  const onSubmit: SubmitHandler<SettingsSchema> = async (data) => {
    const result = await saveSettings(data);

    if (result.success) {
      toast.success(result.message);
      return;
    }

    if (result.message) {
      toast.error(result.message);
    }

    if (result.errors) {
      Object.entries(result.errors).forEach(([field, message]) => {
        toast.error(message);
        setError(field as keyof SettingsSchema, {
          type: "server",
          message,
        });
      });
      return;
    }

    toast.error(t("SaveFailed"));
  };

  return (
    <>
      <ModuleHeader title={t("Title")} description={t("Description")} />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="max-w-xl mb-6">
          <LocaleFormSwitcher
            locale={activeLocale}
            onChange={(locale) => {
              changeLocale(locale);
            }}
          />
        </div>

        <div
          className={cn(
            "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
            isArabic && "font-cairo",
          )}
          dir={dir}
        >
          <div className="sm:col-span-2 lg:col-span-3">
            {availableLocales.map((locale) => (
              <div
                key={locale}
                className={cn({
                  hidden: activeLocale !== locale,
                })}
              >
                <NormalFormRichText<SettingsSchema>
                  key={activeLocale}
                  control={control}
                  name={`about_us.${locale}`}
                  label={tLive("about_us")}
                  labelClassName="text-sm"
                />
              </div>
            ))}
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            {availableLocales.map((locale) => (
              <div
                key={locale}
                className={cn({
                  hidden: activeLocale !== locale,
                })}
              >
                <NormalFormRichText<SettingsSchema>
                  key={activeLocale}
                  control={control}
                  name={`terms_and_conditions.${locale}`}
                  label={tLive("terms_and_conditions")}
                  labelClassName="text-sm"
                />
              </div>
            ))}
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            {availableLocales.map((locale) => (
              <div
                key={locale}
                className={cn({
                  hidden: activeLocale !== locale,
                })}
              >
                <NormalFormRichText<SettingsSchema>
                  key={activeLocale}
                  control={control}
                  name={`policy.${locale}`}
                  label={tLive("policy")}
                  labelClassName="text-sm"
                />
              </div>
            ))}
          </div>

          <NormalFormInput
            register={register}
            errors={errors}
            name="instagram"
            label={tLive("instagram")}
            labelClassName="text-sm"
            inputClassName="bg-white"
          />

          <NormalFormInput
            register={register}
            errors={errors}
            name="whatsapp"
            label={tLive("whatsapp")}
            labelClassName="text-sm"
            inputClassName="bg-white"
          />

          <NormalFormInput
            register={register}
            errors={errors}
            name="contact_email"
            label={tLive("contact_email")}
            labelClassName="text-sm"
            inputClassName="bg-white"
          />

          <NormalFormInput
            register={register}
            errors={errors}
            name="contact_phone"
            label={tLive("contact_phone")}
            labelClassName="text-sm"
            inputClassName="bg-white"
          />

          <Controller
            control={control}
            name="show_addition"
            render={({ field }) => (
              <FieldGroup>
                <Field orientation="horizontal" className="mt-auto pb-2">
                  <Checkbox
                    id="show-addition-checkbox"
                    name="show-addition-checkbox"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <FieldLabel htmlFor="show-addition-checkbox">
                    {tLive("show_addition")}
                  </FieldLabel>
                </Field>
              </FieldGroup>
            )}
          />

          <div className="sm:col-span-2 lg:col-span-3">
            <SingleFormImageUploader
              control={control}
              name="logo_url"
              label={tLive("logo_url")}
              labelClassName="text-sm"
            />
          </div>
        </div>

        {can("settings.edit") && (
          <div className="flex justify-end">
            <Button type="submit" className="h-10 w-20">
              {isSubmitting ? <Spinner /> : tCommon("Save")}
            </Button>
          </div>
        )}
      </form>
    </>
  );
}
