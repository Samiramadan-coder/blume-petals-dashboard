"use client";

import {
  Category,
  CategoryFormValues,
  categorySchema,
} from "@/types/categories";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { FieldError } from "../ui/field";
import { Separator } from "../ui/separator";
import Footer from "../form/footer";
import Header from "../form/header";
import { Check, Flower2 } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import SectionLabel from "../form/section-label";
import AddButton from "../form/add-button";
import { zodResolver } from "@hookform/resolvers/zod";
import { availableLocales } from "@/constants/shared";
import { useLocale, useTranslations } from "next-intl";
import { colors, icons } from "@/constants/categories";
import NormalFormInput from "../form/normal-form-input";
import { useFormLocale } from "@/hooks/use-form-locale";
import Switch from "../form/switch";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Controller, useForm, useWatch } from "react-hook-form";
import LocaleFormSwitcher from "../reusable/locale-form-switcher";

export default function CreateEdit({
  category,
  trigger,
}: {
  category?: Category;
  trigger?: React.ReactNode;
}) {
  const locale = useLocale();
  const t = useTranslations("Categories");
  const form = useRef<HTMLFormElement>(null);
  const { activeLocale, changeLocale, dir, isArabic, tLive } =
    useFormLocale("Categories");

  const {
    register,
    control,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema((key) => tLive(key as never))),
    defaultValues: {
      name: category?.name || { en: "", ar: "" },
      visibility: category?.visibility ?? true,
      icon: category?.icon || 0,
      color: category?.color || "",
    },
  });

  const watchName = useWatch({
    control,
    name: "name",
  });

  const watchColor = useWatch({
    control,
    name: "color",
  });

  const onSubmit = (values: CategoryFormValues) => {
    console.log("Category form values:", values);
  };

  return (
    <Sheet>
      {trigger ? (
        <SheetTrigger asChild>{trigger}</SheetTrigger>
      ) : (
        <AddButton label={t("AddCategory")} />
      )}

      <SheetContent
        showCloseButton={false}
        className="flex h-full flex-col sm:max-w-2xl"
        side={locale === "ar" ? "left" : "right"}
      >
        <Header
          title={t("AddCategory")}
          description={t("CreateCategoryDescription")}
        />

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
          })}
          dir={dir}
        >
          <form
            ref={form}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 relative"
          >
            <Card>
              <CardContent className="flex items-center gap-2">
                <div className="bg-[#f4c2c233] p-2.5 rounded-lg">
                  <Flower2 className="size-5 text-[#b88686]" />
                </div>
                <div>
                  <p className="font-semibold text-sm">
                    {watchName?.[activeLocale] || tLive("Placeholder")}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Separator className="bg-border" />
            <SectionLabel>{tLive("Details")}</SectionLabel>
            {availableLocales.map((lang) => (
              <NormalFormInput<CategoryFormValues>
                key={lang}
                label={tLive("CategoryName")}
                placeholder={tLive("EnterCategoryName")}
                name={`name.${lang}`}
                type="text"
                register={register}
                errors={errors}
                required
                className={`${activeLocale === lang ? "" : "hidden"}`}
              />
            ))}

            <Separator className="bg-border" />
            <SectionLabel>{tLive("Icon")}</SectionLabel>
            <Controller
              name="icon"
              control={control}
              render={({ field }) => {
                const selectedIcon = field.value ?? "";

                return (
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap gap-3">
                      {icons((key) => tLive(key as never)).map((icon) => {
                        const isSelected = selectedIcon === icon.id;
                        const selectedColor = watchColor;

                        return (
                          <div
                            key={icon.id}
                            className="cursor-pointer"
                            onClick={() => {
                              const nextIcon = isSelected ? undefined : icon.id;
                              field.onChange(nextIcon);
                            }}
                          >
                            <Card
                              className={cn(
                                "w-25 h-25 border grid place-content-center",
                                { "border-2 border-primary": isSelected },
                              )}
                            >
                              <CardContent>
                                <div
                                  className={cn(
                                    "w-13 h-13 grid place-content-center rounded-full",
                                    !selectedColor &&
                                      "text-[#b88686] bg-[#f4c2c233]",
                                  )}
                                  style={
                                    selectedColor
                                      ? {
                                          color: selectedColor,
                                          backgroundColor: `${selectedColor}20`,
                                        }
                                      : undefined
                                  }
                                >
                                  {icon.icon}
                                </div>
                                <p className="text-xs text-center mt-1">
                                  {icon.label}
                                </p>
                              </CardContent>
                            </Card>
                          </div>
                        );
                      })}
                    </div>

                    <FieldError errors={[errors.icon]} />
                  </div>
                );
              }}
            />

            <Separator className="bg-border" />
            <SectionLabel>{tLive("Color")}</SectionLabel>
            <Controller
              name="color"
              control={control}
              render={({ field }) => {
                const selectedColors = field.value ?? "";

                return (
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap gap-2">
                      {colors.map((color) => {
                        const isSelected = selectedColors === color;

                        return (
                          <Button
                            key={color}
                            type="button"
                            variant="outline"
                            className={cn(
                              "h-8 w-8 rounded-full border border-border cursor-pointer",
                              { "border-2 border-primary": isSelected },
                            )}
                            style={{ backgroundColor: color }}
                            onClick={() => {
                              const nextColors = isSelected ? "" : color;
                              field.onChange(nextColors);
                            }}
                          >
                            {isSelected && <Check />}
                          </Button>
                        );
                      })}

                      <div className="relative h-8 w-8">
                        <Button
                          variant="outline"
                          className="w-8 h-8 rounded-full border-2 border-dashed bg-white cursor-pointer"
                        ></Button>
                        <input
                          type="color"
                          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                          onChange={(event) => {
                            field.onChange(event.target.value);
                          }}
                        />
                      </div>
                    </div>

                    <FieldError errors={[errors.color]} />
                  </div>
                );
              }}
            />

            <Separator className="bg-border" />
            <SectionLabel>{tLive("Visibility")}</SectionLabel>
            <Switch<CategoryFormValues>
              name="visibility"
              control={control}
              label={tLive("VisibilityLabel")}
              description={tLive("VisibilityDescription")}
            />
          </form>
        </div>
        <Footer form={form} />
      </SheetContent>
    </Sheet>
  );
}
