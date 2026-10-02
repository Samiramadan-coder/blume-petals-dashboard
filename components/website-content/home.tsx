"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import React from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import ImageFile from "./image-file";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { Plus, Trash2 } from "lucide-react";
import NormalFormInput from "../form/input";
import { Card, CardContent } from "../ui/card";
import NormalFormTextarea from "../form/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { availableLocales } from "@/constants/shared";
import { postHomeAction } from "@/lib/website-content";
import { useFormLocale } from "@/hooks/use-form-locale";
import LocaleFormSwitcher from "../reusable/locale-form-switcher";
import { HomePage, homePageSchema } from "@/types/website-content";
import { useTranslations } from "next-intl";
import {
  useForm,
  SubmitHandler,
  useFieldArray,
  useWatch,
} from "react-hook-form";

type UploadedImage = string | null | { path: string; url: string } | undefined;

function getImageUrl(image: UploadedImage) {
  return image instanceof Object ? image.url : "";
}

export default function Home({ home }: { home: HomePage }) {
  const { activeLocale, changeLocale, dir, isArabic, tLive } =
    useFormLocale("WebsiteContent");
  const tCommon = useTranslations("Common");

  const {
    control,
    register,
    setError,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<HomePage>({
    defaultValues: home,
    resolver: zodResolver(homePageSchema),
  });

  const howItWorksItems = useFieldArray({
    control,
    name: "how_it_works.items",
  });
  const bouquetBuilderItems = useFieldArray({
    control,
    name: "bouquet_builder.items",
  });

  const heroImage = useWatch({ control, name: "hero.image" });
  const howItWorksValues = useWatch({ control, name: "how_it_works.items" });
  const bouquetBuilderValues = useWatch({
    control,
    name: "bouquet_builder.items",
  });

  const onSubmit: SubmitHandler<HomePage> = async (data) => {
    if (data.hero.image instanceof Object) {
      data.hero.image = data.hero.image.path;
    }

    data.how_it_works.items.forEach((item) => {
      if (item.image instanceof Object) {
        item.image = item.image.path;
      }
    });

    data.bouquet_builder.items.forEach((item) => {
      if (item.icon instanceof Object) {
        item.icon = item.icon.path;
      }
    });

    const result = await postHomeAction(data);

    if (result.success) {
      toast.success(result.message);
      return;
    }

    if (result.errors) {
      Object.entries(result.errors).forEach(([field, message]) => {
        toast.error(message);
        setError(field as keyof HomePage, {
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
        console.error("Home page form is invalid:", errors);
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
                      className={loc === activeLocale ? "block" : "hidden"}
                      label={tLive("title")}
                      labelClassName="mb-1"
                    />

                    <NormalFormInput
                      register={register}
                      name={`hero.subtitle.${loc}`}
                      className={loc === activeLocale ? "block" : "hidden"}
                      label={tLive("subtitle")}
                      labelClassName="mb-1"
                    />

                    <NormalFormTextarea
                      register={register}
                      name={`hero.description.${loc}`}
                      className={
                        loc === activeLocale ? "block sm:col-span-2" : "hidden"
                      }
                      label={tLive("description")}
                      labelClassName="mb-1"
                    />
                  </React.Fragment>
                ))}

                <ImageFile
                  page="home"
                  type="images"
                  imageUrl={getImageUrl(heroImage)}
                  onFileChange={(image) => {
                    setValue("hero.image", image, { shouldDirty: true });
                  }}
                />

                {/* <SingleFormImageUploader
                  control={control}
                  name="hero.image"
                  label={tLive("image")}
                  className="sm:col-span-2"
                /> */}
              </CardContent>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>

      {/* Categories Section */}
      <Card className="ring-0! border border-primary/30 gap-0 p-0 rounded-sm">
        <Accordion type="single" collapsible>
          <AccordionItem value="categories" className="border-none">
            <AccordionTrigger className="px-4 pt-4 ring-0! font-bold uppercase text-secondary hover:no-underline">
              {tLive("categories")}
            </AccordionTrigger>

            <AccordionContent className="p-0">
              <CardContent className="py-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {availableLocales.map((loc) => (
                  <React.Fragment key={loc}>
                    <NormalFormInput
                      register={register}
                      name={`categories.title.${loc}`}
                      className={loc === activeLocale ? "block" : "hidden"}
                      label={tLive("title")}
                      labelClassName="mb-1"
                    />

                    <NormalFormInput
                      register={register}
                      name={`categories.subtitle.${loc}`}
                      className={loc === activeLocale ? "block" : "hidden"}
                      label={tLive("subtitle")}
                      labelClassName="mb-1"
                    />
                  </React.Fragment>
                ))}
              </CardContent>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>

      {/* How It Works Section */}
      <Card className="ring-0! border border-primary/30 gap-0 p-0 rounded-sm">
        <Accordion type="single" collapsible>
          <AccordionItem value="howItWorks" className="border-none">
            <AccordionTrigger className="px-4 pt-4 ring-0! font-bold uppercase text-secondary hover:no-underline">
              {tLive("howItWorks")}
            </AccordionTrigger>

            <AccordionContent className="p-0">
              <CardContent className="py-4 grid grid-cols-1 gap-4">
                {availableLocales.map((loc) => (
                  <React.Fragment key={loc}>
                    <NormalFormInput
                      register={register}
                      name={`how_it_works.title.${loc}`}
                      className={loc === activeLocale ? "block" : "hidden"}
                      label={tLive("title")}
                      labelClassName="mb-1"
                    />

                    <NormalFormInput
                      register={register}
                      name={`how_it_works.subtitle.${loc}`}
                      className={loc === activeLocale ? "block" : "hidden"}
                      label={tLive("subtitle")}
                      labelClassName="mb-1"
                    />
                  </React.Fragment>
                ))}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-secondary font-bold">
                      {tLive("items")}
                    </span>
                    {howItWorksItems.fields.length < 4 && (
                      <Button
                        type="button"
                        size="icon"
                        aria-label={tLive("addItem")}
                        onClick={() => {
                          howItWorksItems.append({
                            title: { en: "", ar: "" },
                            description: { en: "", ar: "" },
                            image: null,
                          });
                        }}
                      >
                        <Plus />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {howItWorksItems.fields.map((item, index) => (
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
                            onClick={() => howItWorksItems.remove(index)}
                          >
                            <Trash2 className="text-destructive" />
                          </Button>
                        </div>

                        {availableLocales.map((loc) => (
                          <React.Fragment key={loc}>
                            <NormalFormInput
                              register={register}
                              name={`how_it_works.items.${index}.title.${loc}`}
                              className={
                                loc === activeLocale ? "block" : "hidden"
                              }
                              label={tLive("title")}
                              labelClassName="mb-1"
                            />

                            <NormalFormInput
                              register={register}
                              name={`how_it_works.items.${index}.description.${loc}`}
                              className={
                                loc === activeLocale ? "block" : "hidden"
                              }
                              label={tLive("description")}
                              labelClassName="mb-1"
                            />
                          </React.Fragment>
                        ))}

                        <ImageFile
                          page="home"
                          type="images"
                          imageUrl={getImageUrl(
                            howItWorksValues?.[index]?.image,
                          )}
                          onFileChange={(image) => {
                            setValue(
                              `how_it_works.items.${index}.image`,
                              image,
                              {
                                shouldDirty: true,
                              },
                            );
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

      {/* Bouquet Builder Section */}
      <Card className="ring-0! border border-primary/30 gap-0 p-0 rounded-sm">
        <Accordion type="single" collapsible>
          <AccordionItem value="bouquetBuilder" className="border-none">
            <AccordionTrigger className="px-4 pt-4 ring-0! font-bold uppercase text-secondary hover:no-underline">
              {tLive("bouquetBuilder")}
            </AccordionTrigger>

            <AccordionContent className="p-0">
              <CardContent className="py-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {availableLocales.map((loc) => (
                  <React.Fragment key={loc}>
                    <NormalFormInput
                      register={register}
                      name={`bouquet_builder.title.${loc}`}
                      className={loc === activeLocale ? "block" : "hidden"}
                      label={tLive("title")}
                      labelClassName="mb-1"
                    />

                    <NormalFormInput
                      register={register}
                      name={`bouquet_builder.subtitle.${loc}`}
                      className={loc === activeLocale ? "block" : "hidden"}
                      label={tLive("subtitle")}
                      labelClassName="mb-1"
                    />

                    <NormalFormTextarea
                      register={register}
                      name={`bouquet_builder.description.${loc}`}
                      className={
                        loc === activeLocale ? "block sm:col-span-2" : "hidden"
                      }
                      label={tLive("description")}
                      labelClassName="mb-1"
                    />
                  </React.Fragment>
                ))}

                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-secondary font-bold">
                      {tLive("items")}
                    </span>
                    {bouquetBuilderItems.fields.length < 4 && (
                      <Button
                        type="button"
                        size="icon"
                        aria-label={tLive("addItem")}
                        onClick={() => {
                          bouquetBuilderItems.append({
                            title: { en: "", ar: "" },
                            subtitle: { en: "", ar: "" },
                            icon: null,
                          });
                        }}
                      >
                        <Plus />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {bouquetBuilderItems.fields.map((item, index) => (
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
                            onClick={() => bouquetBuilderItems.remove(index)}
                          >
                            <Trash2 className="text-destructive" />
                          </Button>
                        </div>

                        {availableLocales.map((loc) => (
                          <React.Fragment key={loc}>
                            <NormalFormInput
                              register={register}
                              name={`bouquet_builder.items.${index}.title.${loc}`}
                              className={
                                loc === activeLocale ? "block" : "hidden"
                              }
                              label={tLive("title")}
                              labelClassName="mb-1"
                            />

                            <NormalFormInput
                              register={register}
                              name={`bouquet_builder.items.${index}.subtitle.${loc}`}
                              className={
                                loc === activeLocale ? "block" : "hidden"
                              }
                              label={tLive("subtitle")}
                              labelClassName="mb-1"
                            />
                          </React.Fragment>
                        ))}

                        <ImageFile
                          page="home"
                          type="icons"
                          imageUrl={getImageUrl(
                            bouquetBuilderValues?.[index]?.icon,
                          )}
                          onFileChange={(icon) => {
                            setValue(
                              `bouquet_builder.items.${index}.icon`,
                              icon,
                              {
                                shouldDirty: true,
                              },
                            );
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

      {/* Shop The Moment Section */}
      <Card className="ring-0! border border-primary/30 gap-0 p-0 rounded-sm">
        <Accordion type="single" collapsible>
          <AccordionItem value="shop_the_moment" className="border-none">
            <AccordionTrigger className="px-4 pt-4 ring-0! font-bold uppercase text-secondary hover:no-underline">
              {tLive("shopTheMoment")}
            </AccordionTrigger>

            <AccordionContent className="p-0">
              <CardContent className="py-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {availableLocales.map((loc) => (
                  <React.Fragment key={loc}>
                    <NormalFormInput
                      register={register}
                      name={`shop_the_moment.title.${loc}`}
                      className={loc === activeLocale ? "block" : "hidden"}
                      label={tLive("title")}
                      labelClassName="mb-1"
                    />

                    <NormalFormInput
                      register={register}
                      name={`shop_the_moment.subtitle.${loc}`}
                      className={loc === activeLocale ? "block" : "hidden"}
                      label={tLive("subtitle")}
                      labelClassName="mb-1"
                    />
                  </React.Fragment>
                ))}
              </CardContent>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>

      {/* Our Selection Section */}
      <Card className="ring-0! border border-primary/30 gap-0 p-0 rounded-sm">
        <Accordion type="single" collapsible>
          <AccordionItem value="our_selection" className="border-none">
            <AccordionTrigger className="px-4 pt-4 ring-0! font-bold uppercase text-secondary hover:no-underline">
              {tLive("ourSelection")}
            </AccordionTrigger>

            <AccordionContent className="p-0">
              <CardContent className="py-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {availableLocales.map((loc) => (
                  <React.Fragment key={loc}>
                    <NormalFormInput
                      register={register}
                      name={`our_selection.title.${loc}`}
                      className={loc === activeLocale ? "block" : "hidden"}
                      label={tLive("title")}
                      labelClassName="mb-1"
                    />

                    <NormalFormInput
                      register={register}
                      name={`our_selection.subtitle.${loc}`}
                      className={loc === activeLocale ? "block" : "hidden"}
                      label={tLive("subtitle")}
                      labelClassName="mb-1"
                    />
                  </React.Fragment>
                ))}
              </CardContent>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>

      {/* Real Creations Section */}
      <Card className="ring-0! border border-primary/30 gap-0 p-0 rounded-sm">
        <Accordion type="single" collapsible>
          <AccordionItem value="real_creations" className="border-none">
            <AccordionTrigger className="px-4 pt-4 ring-0! font-bold uppercase text-secondary hover:no-underline">
              {tLive("realCreations")}
            </AccordionTrigger>

            <AccordionContent className="p-0">
              <CardContent className="py-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {availableLocales.map((loc) => (
                  <React.Fragment key={loc}>
                    <NormalFormInput
                      register={register}
                      name={`real_creations.title.${loc}`}
                      className={loc === activeLocale ? "block" : "hidden"}
                      label={tLive("title")}
                      labelClassName="mb-1"
                    />

                    <NormalFormInput
                      register={register}
                      name={`real_creations.subtitle.${loc}`}
                      className={loc === activeLocale ? "block" : "hidden"}
                      label={tLive("subtitle")}
                      labelClassName="mb-1"
                    />

                    <NormalFormTextarea
                      register={register}
                      name={`real_creations.description.${loc}`}
                      className={
                        loc === activeLocale ? "block sm:col-span-2" : "hidden"
                      }
                      label={tLive("description")}
                      labelClassName="mb-1"
                    />
                  </React.Fragment>
                ))}
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
