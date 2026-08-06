"use client";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";
import NormalFormRichText from "../form/rich-text";
import { availableLocales } from "@/constants/shared";
import { useFormLocale } from "@/hooks/use-form-locale";
import { useForm, SubmitHandler } from "react-hook-form";
import { Settings, SettingsSchema } from "@/types/settings";
import LocaleFormSwitcher from "../reusable/locale-form-switcher";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { saveSettings } from "@/lib/settings";
import { Spinner } from "../ui/spinner";
import { toast } from "sonner";

export default function DataPreview({ settings }: { settings: Settings }) {
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <Tabs defaultValue="about_us" className="space-y-6">
        <TabsList variant="line" className="h-12! space-x-4">
          {Object.keys(settings).map((key) => (
            <TabsTrigger
              key={key}
              value={key}
              className="text-sm px-0 cursor-pointer data-[state=active]:after:bg-primary! data-[state=active]:text-primary!"
            >
              {t(key)}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* About Us */}
        <TabsContent value="about_us" className="space-y-4">
          <div className="max-w-xl">
            <LocaleFormSwitcher
              locale={activeLocale}
              onChange={(locale) => {
                changeLocale(locale);
              }}
            />
          </div>

          <div
            dir={dir}
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
                  name={`about_us.${locale}`}
                  placeholder={tLive("AboutUsPlaceholder")}
                />
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Terms and Conditions */}
        <TabsContent value="terms_and_conditions" className="space-y-4">
          <div className="max-w-xl">
            <LocaleFormSwitcher
              locale={activeLocale}
              onChange={(locale) => {
                changeLocale(locale);
              }}
            />
          </div>

          <div
            dir={dir}
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
                  name={`terms_and_conditions.${locale}`}
                  placeholder={tLive("TermsAndConditionsPlaceholder")}
                />
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Privacy Policy */}
        <TabsContent value="policy" className="space-y-4">
          <div className="max-w-xl">
            <LocaleFormSwitcher
              locale={activeLocale}
              onChange={(locale) => {
                changeLocale(locale);
              }}
            />
          </div>

          <div
            dir={dir}
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
                  name={`policy.${locale}`}
                  placeholder={tLive("PolicyPlaceholder")}
                />
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Logo */}
        <TabsContent value="logo_url" className="space-y-4"></TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button type="submit" className="h-10 w-20">
          {isSubmitting ? <Spinner /> : tCommon("Save")}
        </Button>
      </div>
    </form>
  );
}
