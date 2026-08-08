"use client";

import { toast } from "sonner";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { saveSettings } from "@/lib/settings";
import { Card, CardContent } from "../ui/card";
import NormalFormRichText from "../form/rich-text";
import { availableLocales } from "@/constants/shared";
import { useLocale, useTranslations } from "next-intl";
import { useFormLocale } from "@/hooks/use-form-locale";
import { useForm, SubmitHandler } from "react-hook-form";
import { Settings, SettingsSchema } from "@/types/settings";
import LocaleFormSwitcher from "../reusable/locale-form-switcher";
import { usePermissions } from "@/providers/permission-providers";
import SingleFormImageUploader from "../form/single-image-uploader";

export default function DataPreview({ settings }: { settings: Settings }) {
  const locale = useLocale();
  const { can } = usePermissions();
  const t = useTranslations("Settings");
  const tCommon = useTranslations("Common");
  const { activeLocale, changeLocale, dir, isArabic, tLive } =
    useFormLocale("Settings");

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SettingsSchema>({
    defaultValues: settings,
  });

  const onSubmit: SubmitHandler<SettingsSchema> = async (data) => {
    const result = await saveSettings(data);

    if (result.success) {
      toast.success(t("SavedSuccessfully"));
      return;
    }

    toast.error(t("SaveFailed"));
  };

  return (
    <>
      <header className="flex items-center justify-between">
        <div>
          <h1
            className={cn(`text-2xl font-semibold text-foreground`, {
              "font-cairo": locale === "ar",
              "font-heading": locale === "en",
            })}
          >
            {t("Title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            {t("Description")}
          </p>
        </div>
      </header>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="max-w-xl mb-6">
          <LocaleFormSwitcher
            locale={activeLocale}
            onChange={(locale) => {
              changeLocale(locale);
            }}
          />
        </div>

        {(Object.keys(settings) as Array<keyof Settings>).map((key) => (
          <Card key={key} className="mb-4">
            <CardContent className="space-y-4" dir={dir}>
              <h3
                className={cn("text-lg", {
                  "font-cairo": isArabic,
                })}
              >
                {tLive(key)}
              </h3>

              {key === "logo_url" ? (
                <div className="flex gap-8">
                  <div className="max-w-50 min-w-50">
                    <SingleFormImageUploader
                      control={control}
                      name="logo_url"
                    />
                  </div>

                  <div className="flex items-center">
                    <Image
                      src={settings.logo_url}
                      alt="Logo"
                      width={100}
                      height={100}
                    />
                  </div>
                </div>
              ) : (
                <div
                  className={cn({
                    "font-cairo": isArabic,
                  })}
                >
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
                        name={
                          `${key}.${locale}` as `${Exclude<
                            keyof Settings,
                            "logo_url"
                          >}.${typeof locale}`
                        }
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}

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
