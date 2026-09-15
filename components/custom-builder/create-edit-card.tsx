"use client";

import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Input from "../form/input";
import Footer from "../form/footer";
import Header from "../form/header";
import { Button } from "../ui/button";
import { useEffect, useRef } from "react";
import AddButton from "../form/add-button";
import { postCardAction } from "@/lib/templates";
import NormalFormTextarea from "../form/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { availableLocales } from "@/constants/shared";
import { useLocale, useTranslations } from "next-intl";
import { useFormLocale } from "@/hooks/use-form-locale";
import { useForm, SubmitHandler } from "react-hook-form";
import LocaleFormSwitcher from "../reusable/locale-form-switcher";
import SingleFormImageUploader from "../form/single-image-uploader";
import { Card, CardFormValues, cardSchema } from "@/types/custom-builder";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet";

export default function CreateEditCard({
  card,
  trigger,
}: {
  card?: Card;
  trigger?: React.ReactNode;
}) {
  const locale = useLocale();
  const t = useTranslations("CustomBuilder.Cards");
  const tCommon = useTranslations("Common");
  const form = useRef<HTMLFormElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const { activeLocale, changeLocale, dir, isArabic, tLive } =
    useFormLocale("CustomBuilder");

  const {
    control,
    register,
    setError,
    trigger: triggerValidation,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitted },
  } = useForm<CardFormValues>({
    resolver: zodResolver(cardSchema((key) => tLive(key as never))),
    defaultValues: {
      name: card?.name || { en: "", ar: "" },
      description: card?.description || { en: "", ar: "" },
      price: Number(card?.price) || 0,
      kind: "card_style",
      image: card?.image_url || "",
    },
  });

  useEffect(() => {
    if (isSubmitted) {
      void triggerValidation();
    }
  }, [isSubmitted, triggerValidation, activeLocale]);

  const onSubmit: SubmitHandler<CardFormValues> = async (data) => {
    const result = await postCardAction(data, card?.id);

    if (result.success) {
      toast.success(
        card ? tCommon("UpdatedSuccessfully") : tCommon("CreatedSuccessfully"),
      );
      form.current?.reset();
      closeBtn.current?.click();
      return;
    }

    if (result.errors) {
      Object.entries(result.errors).forEach(([field, message]) => {
        toast.error(message);
        setError(field as keyof CardFormValues, {
          type: "server",
          message,
        });
      });
      return;
    }

    toast.error(card ? tCommon("CreationFailed") : tCommon("UpdateFailed"));
  };

  return (
    <Sheet>
      {trigger ? (
        <SheetTrigger asChild>{trigger}</SheetTrigger>
      ) : (
        <AddButton label={t("AddCard")} />
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
          title={card ? t("EditCard") : t("AddCard")}
          description={
            card ? t("EditCardDescription") : t("AddCardDescription")
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
            <SingleFormImageUploader
              control={control}
              name="image"
              label={tLive("Cards.Fields.Image.Label")}
              required
            />

            {availableLocales.map((lang) => (
              <Input<CardFormValues>
                key={lang}
                label={tLive("Cards.Fields.Name.Label")}
                placeholder={tLive("Cards.Fields.Name.Placeholder")}
                name={`name.${lang}`}
                type="text"
                register={register}
                errors={errors}
                required
                className={`${activeLocale === lang ? "" : "hidden"}`}
              />
            ))}

            {availableLocales.map((lang) => (
              <NormalFormTextarea<CardFormValues>
                key={lang}
                label={tLive("Cards.Fields.Description.Label")}
                placeholder={tLive("Cards.Fields.Description.Placeholder")}
                name={`description.${lang}`}
                register={register}
                errors={errors}
                required
                className={`${activeLocale === lang ? "" : "hidden"}`}
              />
            ))}

            <Input<CardFormValues>
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
