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
import { useForm, SubmitHandler, Controller, useWatch } from "react-hook-form";

export default function Home({ home }: { home: HomePage }) {
  const { activeLocale, changeLocale, dir, isArabic, tLive } =
    useFormLocale("WebsiteContent");

  const {
    control,
    register,
    setError,
    setValue,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<HomePage>({
    defaultValues: home,
    resolver: zodResolver(homePageSchema),
  });

  const heroImage = useWatch({ control, name: "hero.image" });

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
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, (errors) => {
        console.log(errors);
      })}
      className={cn("space-y-4", isArabic && "font-cairo")}
      dir={dir}
    >
      {errors && Object.keys(errors).length > 0 && (
        <div className="mb-4 text-red-600">
          {Object.values(errors).map((error, index) => (
            <p key={index}>{error.message}</p>
          ))}
        </div>
      )}

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
                  imageUrl={heroImage instanceof Object ? heroImage.url : ""}
                  onFileChange={(image) => {
                    setValue("hero.image", image);
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

                    <div className={loc === activeLocale ? "block" : "hidden"}>
                      <Controller
                        control={control}
                        name="how_it_works.items"
                        render={({ field }) => {
                          const value = field.value || [];

                          return (
                            <div>
                              <div className="flex items-center justify-between mb-4">
                                <span className="text-secondary font-bold">
                                  {tLive("items")}
                                </span>
                                {value.length < 4 && (
                                  <Button
                                    type="button"
                                    size="icon"
                                    onClick={() => {
                                      field.onChange([
                                        ...value,
                                        {
                                          title: { [loc]: "" },
                                          description: { [loc]: "" },
                                          image: null,
                                        },
                                      ]);
                                    }}
                                  >
                                    <Plus />
                                  </Button>
                                )}
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {value.map((item, index) => (
                                  <div
                                    key={index}
                                    className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 border border-primary/20 mb-4 rounded-sm"
                                  >
                                    <div className="flex justify-end sm:col-span-2">
                                      <Button
                                        variant="ghost"
                                        type="button"
                                        size="icon"
                                        onClick={() => {
                                          const newValue = [...value];
                                          newValue.splice(index, 1);
                                          field.onChange(newValue);
                                        }}
                                      >
                                        <Trash2 className="text-destructive" />
                                      </Button>
                                    </div>

                                    <NormalFormInput
                                      register={register}
                                      name={`how_it_works.items.${index}.title.${loc}`}
                                      label={tLive("title")}
                                      labelClassName="mb-1"
                                    />

                                    <NormalFormInput
                                      register={register}
                                      name={`how_it_works.items.${index}.description.${loc}`}
                                      label={tLive("description")}
                                      labelClassName="mb-1"
                                    />

                                    <ImageFile
                                      page="home"
                                      type="images"
                                      imageUrl={
                                        value[index].image instanceof Object
                                          ? value[index].image.url
                                          : ""
                                      }
                                      onFileChange={(image) => {
                                        const newValue = [...value];
                                        newValue[index].image = image;
                                        field.onChange(newValue);
                                      }}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        }}
                      />
                    </div>
                  </React.Fragment>
                ))}
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

                    <div
                      className={
                        loc === activeLocale ? "block sm:col-span-2" : "hidden"
                      }
                    >
                      <Controller
                        control={control}
                        name="bouquet_builder.items"
                        render={({ field }) => {
                          const value = field.value || [];

                          return (
                            <div>
                              <div className="flex items-center justify-between mb-4">
                                <span className="text-secondary font-bold">
                                  {tLive("items")}
                                </span>
                                {value.length < 4 && (
                                  <Button
                                    type="button"
                                    size="icon"
                                    onClick={() => {
                                      field.onChange([
                                        ...value,
                                        {
                                          title: { [loc]: "" },
                                          description: { [loc]: "" },
                                          icon: null,
                                        },
                                      ]);
                                    }}
                                  >
                                    <Plus />
                                  </Button>
                                )}
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {value.map((item, index) => (
                                  <div
                                    key={index}
                                    className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 border border-primary/20 mb-4 rounded-sm"
                                  >
                                    <div className="flex justify-end sm:col-span-2">
                                      <Button
                                        variant="ghost"
                                        type="button"
                                        size="icon"
                                        onClick={() => {
                                          const newValue = [...value];
                                          newValue.splice(index, 1);
                                          field.onChange(newValue);
                                        }}
                                      >
                                        <Trash2 className="text-destructive" />
                                      </Button>
                                    </div>

                                    <NormalFormInput
                                      register={register}
                                      name={`bouquet_builder.items.${index}.title.${loc}`}
                                      label={tLive("title")}
                                      labelClassName="mb-1"
                                    />

                                    <NormalFormInput
                                      register={register}
                                      name={`bouquet_builder.items.${index}.subtitle.${loc}`}
                                      label={tLive("subtitle")}
                                      labelClassName="mb-1"
                                    />

                                    <ImageFile
                                      page="home"
                                      type="icons"
                                      imageUrl={
                                        value[index].icon instanceof Object
                                          ? value[index].icon.url
                                          : ""
                                      }
                                      onFileChange={(icon) => {
                                        const newValue = [...value];
                                        newValue[index].icon = icon;
                                        field.onChange(newValue);
                                      }}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        }}
                      />
                    </div>
                  </React.Fragment>
                ))}
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
