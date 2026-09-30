"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import NormalFormInput from "../form/input";
import NormalFormTextarea from "../form/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { availableLocales } from "@/constants/shared";
import { postHomeAction } from "@/lib/website-content";
import { useFormLocale } from "@/hooks/use-form-locale";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { Card, CardContent } from "../ui/card";
import LocaleFormSwitcher from "../reusable/locale-form-switcher";
import { HomePage, homePageSchema } from "@/types/website-content";
import SingleFormImageUploader from "../form/single-image-uploader";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Plus, Trash2 } from "lucide-react";

export default function Home({ home }: { home: HomePage }) {
  const { activeLocale, changeLocale, dir, isArabic, tLive } =
    useFormLocale("WebsiteContent");

  const {
    control,
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<HomePage>({
    defaultValues: home,
    resolver: zodResolver(homePageSchema),
  });

  const onSubmit: SubmitHandler<HomePage> = async (data) => {
    const result = await postHomeAction(data);

    console.log(result);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("space-y-4", isArabic && "font-cairo")}
      dir={dir}
    >
      <div className="max-w-100">
        <LocaleFormSwitcher
          locale={activeLocale}
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

                <SingleFormImageUploader
                  control={control}
                  name="hero.image"
                  label={tLive("image")}
                  accept=".svg"
                  required
                  className="sm:col-span-2"
                />
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

                                    <SingleFormImageUploader
                                      control={control}
                                      name={`how_it_works.items.${index}.image`}
                                      label={tLive("image")}
                                      accept=".svg"
                                      className="sm:col-span-2"
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
                                      name={`bouquet_builder.items.${index}.description.${loc}`}
                                      label={tLive("description")}
                                      labelClassName="mb-1"
                                    />

                                    <SingleFormImageUploader
                                      control={control}
                                      name={`bouquet_builder.items.${index}.icon`}
                                      label={tLive("icon")}
                                      accept=".svg"
                                      className="sm:col-span-2"
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

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
}
