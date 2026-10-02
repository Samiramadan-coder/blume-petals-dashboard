"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Plus, Trash2 } from "lucide-react";
import NormalFormInput from "../form/input";
import { Card, CardContent } from "../ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { availableLocales } from "@/constants/shared";
import { postAboutAction } from "@/lib/website-content";
import { useFormLocale } from "@/hooks/use-form-locale";
import LocaleFormSwitcher from "../reusable/locale-form-switcher";
import { useTranslations } from "next-intl";
import {
  useForm,
  SubmitHandler,
  useFieldArray,
  useWatch,
} from "react-hook-form";
import { AboutPage, aboutPageSchema } from "@/types/website-content";
import { Spinner } from "../ui/spinner";
import { toast } from "sonner";
import NormalFormRichText from "../form/rich-text";
import ImageFile from "./image-file";

type UploadedImage = string | null | { path: string; url: string } | undefined;

function getImageUrl(image: UploadedImage) {
  return image instanceof Object ? image.url : "";
}

export default function About({ about }: { about: AboutPage }) {
  const { activeLocale, changeLocale, dir, isArabic, tLive } =
    useFormLocale("WebsiteContent");
  const tCommon = useTranslations("Common");

  const {
    control,
    setError,
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<AboutPage>({
    defaultValues: about,
    resolver: zodResolver(aboutPageSchema),
  });

  const ourPromiseItems = useFieldArray({
    control,
    name: "our_promise.items",
  });

  const heroImage = useWatch({ control, name: "hero.image" });
  const whoWeAreImage = useWatch({ control, name: "who_we_are.image" });
  const ourPromiseValues = useWatch({ control, name: "our_promise.items" });

  const onSubmit: SubmitHandler<AboutPage> = async (data) => {
    if (data.hero.image instanceof Object) {
      data.hero.image = data.hero.image.path;
    }

    if (data.who_we_are.image instanceof Object) {
      data.who_we_are.image = data.who_we_are.image.path;
    }

    data.our_promise.items.forEach((item) => {
      if (item.icon instanceof Object) {
        item.icon = item.icon.path;
      }
    });

    const result = await postAboutAction(data);

    if (result.success) {
      toast.success(result.message);
      return;
    }

    if (result.errors) {
      Object.entries(result.errors).forEach(([field, message]) => {
        toast.error(message);
        setError(field as keyof AboutPage, {
          type: "server",
          message,
        });
      });

      return;
    }

    toast.error(result.message ?? tCommon("UpdateFailed"));
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, (errors) => {
        console.error("About page form is invalid:", errors);
        toast.error(tCommon("UpdateFailed"));
      })}
      className={cn("space-y-4", isArabic && "font-cairo")}
      dir={dir}
    >
      <div className="flex">
        <LocaleFormSwitcher
          locale={activeLocale}
          className="px-0"
          onChange={(locale) => {
            changeLocale(locale);
          }}
        />
      </div>

      {/* Hero Section */}
      <Card className="ring-0! border border-primary/30 gap-0 p-0 rounded-sm">
        <Accordion type="single" collapsible>
          <AccordionItem value="hero" className="border-none">
            <AccordionTrigger className="px-4 pt-4 ring-0! font-bold uppercase text-secondary hover:no-underline">
              {tLive("hero")}
            </AccordionTrigger>

            <AccordionContent className="p-0">
              <CardContent className="py-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {availableLocales.map((loc) => (
                  <React.Fragment key={loc}>
                    <NormalFormInput
                      register={register}
                      name={`hero.title.${loc}`}
                      id={`about.hero.title.${loc}`}
                      className={loc === activeLocale ? "block" : "hidden"}
                      label={tLive("title")}
                      labelClassName="mb-1"
                    />

                    <NormalFormInput
                      register={register}
                      name={`hero.subtitle.${loc}`}
                      id={`about.hero.subtitle.${loc}`}
                      className={loc === activeLocale ? "block" : "hidden"}
                      label={tLive("subtitle")}
                      labelClassName="mb-1"
                    />
                  </React.Fragment>
                ))}

                <ImageFile
                  page="about"
                  type="images"
                  imageUrl={getImageUrl(heroImage)}
                  onFileChange={(image) => {
                    setValue("hero.image", image, { shouldDirty: true });
                  }}
                />
              </CardContent>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>

      {/* Who We Are Section */}
      <Card className="ring-0! border border-primary/30 gap-0 p-0 rounded-sm">
        <Accordion type="single" collapsible>
          <AccordionItem value="whoWeAre" className="border-none">
            <AccordionTrigger className="px-4 pt-4 ring-0! font-bold uppercase text-secondary hover:no-underline">
              {tLive("whoWeAre")}
            </AccordionTrigger>

            <AccordionContent className="p-0">
              <CardContent className="py-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {availableLocales.map((loc) => (
                  <React.Fragment key={loc}>
                    <NormalFormInput
                      register={register}
                      name={`who_we_are.title.${loc}`}
                      className={loc === activeLocale ? "block" : "hidden"}
                      label={tLive("title")}
                      labelClassName="mb-1"
                    />

                    <NormalFormInput
                      register={register}
                      name={`who_we_are.subtitle.${loc}`}
                      className={loc === activeLocale ? "block" : "hidden"}
                      label={tLive("subtitle")}
                      labelClassName="mb-1"
                    />

                    <NormalFormRichText
                      key={loc}
                      control={control}
                      label={tLive("description")}
                      name={`who_we_are.description.${loc}`}
                      labelClassName="mb-1"
                      className={
                        loc === activeLocale ? "block sm:col-span-2" : "hidden"
                      }
                    />
                  </React.Fragment>
                ))}

                <ImageFile
                  type="images"
                  page="about"
                  imageUrl={getImageUrl(whoWeAreImage)}
                  onFileChange={(image) => {
                    setValue("who_we_are.image", image, { shouldDirty: true });
                  }}
                />
              </CardContent>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>

      {/* Our Promise Section */}
      <Card className="ring-0! border border-primary/30 gap-0 p-0 rounded-sm">
        <Accordion type="single" collapsible>
          <AccordionItem value="bouquetBuilder" className="border-none">
            <AccordionTrigger className="px-4 pt-4 ring-0! font-bold uppercase text-secondary hover:no-underline">
              {tLive("ourPromise")}
            </AccordionTrigger>

            <AccordionContent className="p-0">
              <CardContent className="py-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {availableLocales.map((loc) => (
                  <React.Fragment key={loc}>
                    <NormalFormInput
                      register={register}
                      name={`our_promise.title.${loc}`}
                      className={loc === activeLocale ? "block" : "hidden"}
                      label={tLive("title")}
                      labelClassName="mb-1"
                    />

                    <NormalFormInput
                      register={register}
                      name={`our_promise.subtitle.${loc}`}
                      className={loc === activeLocale ? "block" : "hidden"}
                      label={tLive("subtitle")}
                      labelClassName="mb-1"
                    />
                  </React.Fragment>
                ))}

                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-secondary font-bold">
                      {tLive("items")}
                    </span>
                    {ourPromiseItems.fields.length < 4 && (
                      <Button
                        type="button"
                        size="icon"
                        aria-label={tLive("addItem")}
                        onClick={() => {
                          ourPromiseItems.append({
                            title: { en: "", ar: "" },
                            description: { en: "", ar: "" },
                            icon: null,
                          });
                        }}
                      >
                        <Plus />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {ourPromiseItems.fields.map((item, index) => (
                      <div
                        key={item.id}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 border border-primary/20 mb-4 rounded-sm"
                      >
                        <div className="flex justify-end sm:col-span-2">
                          <Button
                            variant="ghost"
                            type="button"
                            size="icon"
                            aria-label={tLive("removeItem")}
                            onClick={() => ourPromiseItems.remove(index)}
                          >
                            <Trash2 className="text-destructive" />
                          </Button>
                        </div>

                        {availableLocales.map((loc) => (
                          <React.Fragment key={loc}>
                            <NormalFormInput
                              register={register}
                              name={`our_promise.items.${index}.title.${loc}`}
                              className={
                                loc === activeLocale ? "block" : "hidden"
                              }
                              label={tLive("title")}
                              labelClassName="mb-1"
                            />

                            <NormalFormInput
                              register={register}
                              name={`our_promise.items.${index}.description.${loc}`}
                              className={
                                loc === activeLocale ? "block" : "hidden"
                              }
                              label={tLive("description")}
                              labelClassName="mb-1"
                            />
                          </React.Fragment>
                        ))}

                        <ImageFile
                          page="about"
                          type="icons"
                          imageUrl={getImageUrl(
                            ourPromiseValues?.[index]?.icon,
                          )}
                          onFileChange={(icon) => {
                            setValue(`our_promise.items.${index}.icon`, icon, {
                              shouldDirty: true,
                            });
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" className="px-6 py-5" disabled={isSubmitting}>
          {isSubmitting && <Spinner />}
          {tLive("submit")}
        </Button>
      </div>
    </form>
  );
}
