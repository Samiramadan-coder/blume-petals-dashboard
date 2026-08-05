"use client";

import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Input from "../form/input";
import Footer from "../form/footer";
import Header from "../form/header";
import { Button } from "../ui/button";
import { useEffect, useRef } from "react";
import AddButton from "../form/add-button";
import NormalFormRichText from "../form/rich-text";
import { zodResolver } from "@hookform/resolvers/zod";
import { availableLocales } from "@/constants/shared";
import { useLocale, useTranslations } from "next-intl";
import { useFormLocale } from "@/hooks/use-form-locale";
import { SubmitHandler, useForm } from "react-hook-form";
import { Sheet, SheetClose, SheetContent } from "../ui/sheet";
import LocaleFormSwitcher from "../reusable/locale-form-switcher";
import {
  NotificationFormData,
  notificationSchema,
} from "@/types/notifications";
import { postNotificationAction } from "@/lib/notifications";

export default function Create() {
  const locale = useLocale();
  const t = useTranslations("Notifications");
  const tCommon = useTranslations("Common");
  const form = useRef<HTMLFormElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const { tLive, changeLocale, activeLocale, dir, isArabic } =
    useFormLocale("Notifications");

  const {
    control,
    register,
    setError,
    trigger: triggerValidation,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitted },
  } = useForm<NotificationFormData>({
    defaultValues: {
      title: { en: "", ar: "" },
      body: { en: "", ar: "" },
      link: "/products",
      type: "promo",
    },
    resolver: zodResolver(notificationSchema((key) => tLive(key as never))),
  });

  useEffect(() => {
    if (isSubmitted) {
      void triggerValidation();
    }
  }, [triggerValidation, isSubmitted, activeLocale]);

  const onSubmit: SubmitHandler<NotificationFormData> = async (data) => {
    const result = await postNotificationAction(data);

    if (result.success) {
      toast.success(tCommon("CreatedSuccessfully"));
      form.current?.reset();
      closeBtn.current?.click();
      return;
    }

    if (result.errors) {
      Object.entries(result.errors).forEach(([field, message]) => {
        toast.error(message);
        setError(field as keyof NotificationFormData, {
          type: "server",
          message,
        });
      });
      return;
    }

    toast.error(tCommon("CreationFailed"));
  };

  return (
    <Sheet>
      <AddButton label={t("CreateNotification")} />

      <SheetContent
        showCloseButton={false}
        className="flex h-full flex-col sm:max-w-2xl"
        side={locale === "ar" ? "left" : "right"}
        onInteractOutside={(event) => event.preventDefault()}
      >
        <SheetClose asChild>
          <Button ref={closeBtn} className="hidden"></Button>
        </SheetClose>

        <Header
          title={t("CreateNotification")}
          description={t("CreateNotificationDescription")}
        />

        <LocaleFormSwitcher
          locale={activeLocale}
          onChange={(locale) => {
            changeLocale(locale);
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
            className="space-y-4 relative"
          >
            {availableLocales.map((lang) => (
              <Input<NotificationFormData>
                key={lang}
                label={tLive("Fields.Title.Label")}
                placeholder={tLive("Fields.Title.Placeholder")}
                name={`title.${lang}` as const}
                type="text"
                className={`${activeLocale === lang ? "" : "hidden"}`}
                register={register}
                errors={errors}
                required
              />
            ))}

            {availableLocales.map((locale) => (
              <div
                key={locale}
                className={cn({
                  hidden: activeLocale !== locale,
                })}
              >
                <NormalFormRichText<NotificationFormData>
                  key={activeLocale}
                  control={control}
                  label={tLive("Fields.Body.Label")}
                  name={`body.${locale}`}
                  placeholder={tLive("Fields.Body.Placeholder")}
                />
              </div>
            ))}
          </form>
        </div>
        <Footer form={form} loading={isSubmitting} />
      </SheetContent>
    </Sheet>
  );
}
