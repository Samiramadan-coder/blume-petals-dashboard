"use client";

import {
  OccasionCollection,
  occasionCollectionSchema,
  OccasionCollectionFormValues,
} from "@/types/occasions";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import Input from "../form/input";
import Footer from "../form/footer";
import Header from "../form/header";
import Switch from "../form/switch";
import { Check } from "lucide-react";
import { Button } from "../ui/button";
import { FieldError } from "../ui/field";
import AddButton from "../form/add-button";
import { Separator } from "../ui/separator";
import NormalFormSelect from "../form/select";
import SectionLabel from "../form/section-label";
import { zodResolver } from "@hookform/resolvers/zod";
// import DayMonthPicker from "../form/day-month-picker";
import { availableLocales } from "@/constants/shared";
import { useLocale, useTranslations } from "next-intl";
import { useFormLocale } from "@/hooks/use-form-locale";
import { colors, occasionTypes } from "@/constants/occasions";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import SingleImageUploader from "../form/single-image-uploader";
import LocaleFormSwitcher from "../reusable/locale-form-switcher";

// Get default values for the form based on the occasion collection data
function getDefaultValues(occasion?: OccasionCollection) {
  return {
    banner: occasion?.banner || "",
    name: occasion?.name || { en: "", ar: "" },
    // startDate: occasion?.startDate || "",
    // endDate: occasion?.endDate || "",
    // visibility: occasion?.visibility ?? true,
    color: occasion?.color || "",
  };
}

// Get a list of colors, including the occasion's color if it's not already in the predefined list
function getListOfColors(color?: string): string[] {
  return [...colors, ...(color && !colors.includes(color) ? [color] : [])];
}

export default function CreateEdit({
  occasion,
  trigger,
}: {
  occasion?: OccasionCollection;
  trigger?: React.ReactNode;
}) {
  const form = useRef<HTMLFormElement>(null);
  const locale = useLocale();
  const t = useTranslations("Occasions");
  const { tLive: tLiveCommon, changeLocale: changeLocaleCommon } =
    useFormLocale("Common");
  const { tLive, changeLocale, activeLocale, dir, isArabic } =
    useFormLocale("Occasions");

  const {
    register,
    control,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm<OccasionCollectionFormValues>({
    defaultValues: getDefaultValues(occasion),
    resolver: zodResolver(
      occasionCollectionSchema((key) => tLive(key as never)),
    ),
  });

  const watchColor = useWatch({ control, name: "color" });

  const onSubmit = (values: OccasionCollectionFormValues) => {
    console.log("Occasion collection form values:", values);
  };

  return (
    <Sheet>
      {trigger ? (
        <SheetTrigger asChild>{trigger}</SheetTrigger>
      ) : (
        <AddButton label={t("Labels.AddOccasionCollection")} />
      )}

      <SheetContent
        showCloseButton={false}
        className="flex h-full flex-col sm:max-w-2xl"
        side={locale === "ar" ? "left" : "right"}
        onInteractOutside={(event) => event.preventDefault()}
      >
        <Header
          title={
            occasion
              ? t("Labels.EditOccasionCollection")
              : t("Labels.AddOccasionCollection")
          }
          description={t("Labels.OccasionCollectionDescription")}
        />

        <LocaleFormSwitcher
          locale={activeLocale}
          onChange={(locale) => {
            changeLocale(locale);
            changeLocaleCommon(locale);
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
            className="space-y-4 relative"
          >
            <SingleImageUploader
              control={control}
              name="banner"
              label={tLive("Fields.Banner")}
            />

            <SectionLabel>{tLive("Labels.Details")}</SectionLabel>
            {availableLocales.map((lang) => (
              <Input<OccasionCollectionFormValues>
                key={lang}
                label={tLive("Fields.Name")}
                placeholder={tLive("Placeholders.Name")}
                name={`name.${lang}` as const}
                type="text"
                className={`${activeLocale === lang ? "" : "hidden"}`}
                register={register}
                errors={errors}
                required
              />
            ))}

            <NormalFormSelect<OccasionCollectionFormValues>
              control={control}
              name="type"
              label={tLive("Fields.Type")}
              options={occasionTypes((key) => tLiveCommon(key as never))}
              required
              placeholder={tLive("Labels.SelectType")}
              dir={dir}
            />

            {/* <Separator className="bg-border" />
            <SectionLabel>Promotional Date Range</SectionLabel>
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">
                Optional — occasion will only appear during this window each
                year. Leave blank to show year-round.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DayMonthPicker
                  label="Start Date"
                  control={control}
                  name="startDate"
                  required
                />

                <DayMonthPicker
                  label="End Date"
                  control={control}
                  name="endDate"
                  required
                />
              </div>
            </div> */}

            <Separator className="bg-border" />
            <SectionLabel>{tLive("Labels.Color")}</SectionLabel>
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">
                {tLive("Labels.ColorDescription")}
              </p>
              <Controller
                name="color"
                control={control}
                render={({ field }) => {
                  const selectedColors = field.value ?? "";

                  return (
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap gap-2">
                        {getListOfColors(occasion?.color || watchColor).map(
                          (color) => {
                            const isSelected = selectedColors === color;

                            return (
                              <Button
                                key={color}
                                type="button"
                                variant="outline"
                                className={cn(
                                  "h-8 w-8 rounded-full border border-border",
                                  {
                                    "border-2 border-primary": isSelected,
                                  },
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
                          },
                        )}

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
            </div>

            <Separator className="bg-border" />
            <SectionLabel>{tLive("Labels.Visibility")}</SectionLabel>
            <Switch<OccasionCollectionFormValues>
              name="is_visible"
              control={control}
              label={tLive("Labels.VisibilityLabel")}
              description={tLive("Labels.VisibilityDescription")}
            />
          </form>
        </div>
        <Footer form={form} />
      </SheetContent>
    </Sheet>
  );
}
