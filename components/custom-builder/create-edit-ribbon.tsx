"use client";

import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Input from "../form/input";
import Footer from "../form/footer";
import Header from "../form/header";
import { Button } from "../ui/button";
import { useEffect, useRef } from "react";
import AddButton from "../form/add-button";
import { postRibbonAction } from "@/lib/templates";
import { zodResolver } from "@hookform/resolvers/zod";
import { availableLocales } from "@/constants/shared";
import { useLocale, useTranslations } from "next-intl";
import { useFormLocale } from "@/hooks/use-form-locale";
import { useForm, SubmitHandler } from "react-hook-form";
import LocaleFormSwitcher from "../reusable/locale-form-switcher";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet";
import { Ribbon, RibbonFormValues, ribbonSchema } from "@/types/custom-builder";

export default function CreateEditRibbon({
  ribbon,
  trigger,
}: {
  ribbon?: Ribbon;
  trigger?: React.ReactNode;
}) {
  const locale = useLocale();
  const t = useTranslations("CustomBuilder.Ribbons");
  const tCommon = useTranslations("Common");
  const form = useRef<HTMLFormElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const { activeLocale, changeLocale, dir, isArabic, tLive } =
    useFormLocale("CustomBuilder");

  const {
    register,
    setError,
    trigger: triggerValidation,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitted },
  } = useForm<RibbonFormValues>({
    resolver: zodResolver(ribbonSchema((key) => tLive(key as never))),
    defaultValues: {
      name: ribbon?.name || { en: "", ar: "" },
      color_hex: ribbon?.color_hex || "#000000",
      price: Number(ribbon?.price) || 0,
      kind: "ribbon",
    },
  });

  useEffect(() => {
    if (isSubmitted) {
      void triggerValidation();
    }
  }, [isSubmitted, triggerValidation, activeLocale]);

  const onSubmit: SubmitHandler<RibbonFormValues> = async (data) => {
    const result = await postRibbonAction(data, ribbon?.id);
    if (result.success) {
      toast.success(result.message);
      form.current?.reset();
      closeBtn.current?.click();
      return;
    }
    if (result.errors) {
      Object.entries(result.errors).forEach(([field, message]) => {
        toast.error(message);
        setError(field as keyof RibbonFormValues, {
          type: "server",
          message,
        });
      });
      return;
    }
    toast.error(ribbon ? tCommon("CreationFailed") : tCommon("UpdateFailed"));
  };

  return (
    <Sheet>
      {trigger ? (
        <SheetTrigger asChild>{trigger}</SheetTrigger>
      ) : (
        <AddButton label={t("AddRibbon")} />
      )}

      <SheetContent
        showCloseButton={false}
        className="flex h-full flex-col sm:max-w-2xl"
        side={locale === "ar" ? "left" : "right"}
      >
        <SheetClose asChild>
          <Button ref={closeBtn} className="hidden"></Button>
        </SheetClose>

        <Header
          title={ribbon ? t("EditRibbon") : t("AddRibbon")}
          description={
            ribbon ? t("EditRibbonDescription") : t("AddRibbonDescription")
          }
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
              void handleSubmit(onSubmit, (errors) => {
                if (activeLocale === "en") {
                  const hasArErrors = errors.name?.ar;
                  if (hasArErrors) {
                    changeLocale("ar");
                    return;
                  }
                }

                if (activeLocale === "ar") {
                  const hasEnErrors = errors.name?.en;
                  if (hasEnErrors) {
                    changeLocale("en");
                    return;
                  }
                }
              })(e);
            }}
            className="space-y-6 relative"
          >
            {availableLocales.map((lang) => (
              <Input<RibbonFormValues>
                key={lang}
                label={tLive("Fields.Name.Label")}
                placeholder={tLive("Fields.Name.Placeholder")}
                name={`name.${lang}`}
                type="text"
                register={register}
                errors={errors}
                required
                className={`${activeLocale === lang ? "" : "hidden"}`}
              />
            ))}

            <Input<RibbonFormValues>
              label={tLive("Ribbons.Fields.Color.Label")}
              name="color_hex"
              type="color"
              register={register}
              errors={errors}
              required
            />

            <Input<RibbonFormValues>
              label={tLive("Ribbons.Fields.Price.Label")}
              name="price"
              type="number"
              register={register}
              errors={errors}
              required
            />
          </form>
        </div>
        <Footer form={form} loading={isSubmitting} />
      </SheetContent>
    </Sheet>
  );
}
