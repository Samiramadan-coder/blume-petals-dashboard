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
// import NormalFormTextarea from "../form/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { availableLocales } from "@/constants/shared";
import { postAboutAction } from "@/lib/website-content";
import { useFormLocale } from "@/hooks/use-form-locale";
import LocaleFormSwitcher from "../reusable/locale-form-switcher";
import SingleFormImageUploader from "../form/single-image-uploader";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { AboutPage, aboutPageSchema } from "@/types/website-content";
import { Spinner } from "../ui/spinner";
import { toast } from "sonner";
import NormalFormRichText from "../form/rich-text";

export default function About({ about }: { about: AboutPage }) {
  const { activeLocale, changeLocale, dir, isArabic, tLive } =
    useFormLocale("WebsiteContent");

  const {
    control,
    setError,
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<AboutPage>({
    defaultValues: about,
    resolver: zodResolver(aboutPageSchema),
  });

  const onSubmit: SubmitHandler<AboutPage> = async (data) => {
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
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
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
                  </React.Fragment>
                ))}

                <SingleFormImageUploader
                  control={control}
                  name="hero.image"
                  label={tLive("image")}
                  className="sm:col-span-2"
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

                    {/* <NormalFormTextarea
                      register={register}
                      name={`who_we_are.description.${loc}`}
                      className={
                        loc === activeLocale ? "block sm:col-span-2" : "hidden"
                      }
                      label={tLive("description")}
                      labelClassName="mb-1"
                    /> */}
                  </React.Fragment>
                ))}

                <SingleFormImageUploader
                  control={control}
                  name="who_we_are.image"
                  label={tLive("image")}
                  className="sm:col-span-2"
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

                    <div
                      className={
                        loc === activeLocale ? "block sm:col-span-2" : "hidden"
                      }
                    >
                      <Controller
                        control={control}
                        name="our_promise.items"
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
                                      name={`our_promise.items.${index}.title.${loc}`}
                                      label={tLive("title")}
                                      labelClassName="mb-1"
                                    />

                                    <NormalFormInput
                                      register={register}
                                      name={`our_promise.items.${index}.description.${loc}`}
                                      label={tLive("description")}
                                      labelClassName="mb-1"
                                    />

                                    <SingleFormImageUploader
                                      control={control}
                                      name={`our_promise.items.${index}.icon`}
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

      <div className="flex justify-end">
        <Button type="submit" className="px-6 py-5" disabled={isSubmitting}>
          {isSubmitting && <Spinner />}
          {tLive("submit")}
        </Button>
      </div>
    </form>
  );
}
