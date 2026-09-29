"use client";

import { Button } from "../ui/button";
import { useLocale } from "next-intl";
import NormalFormInput from "../form/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { availableLocales } from "@/constants/shared";
import { postHomeAction } from "@/lib/website-content";
import { useForm, SubmitHandler } from "react-hook-form";
import { Card, CardContent, CardHeader } from "../ui/card";
import { HomePage, homePageSchema } from "@/types/website-content";
import React from "react";
import NormalFormTextarea from "../form/textarea";

export default function Home({ home }: { home: HomePage }) {
  const locale = useLocale();

  const {
    handleSubmit,
    register,
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Card className="ring-0! border border-primary/30 gap-0 p-0">
        <CardHeader className="py-4 border-b border-primary/30 font-semibold uppercase">
          Hero
        </CardHeader>
        <CardContent className="py-4 space-y-4">
          {availableLocales.map((loc) => (
            <React.Fragment key={loc}>
              <NormalFormInput
                register={register}
                name={`hero.title.${loc}`}
                className={loc === locale ? "block" : "hidden"}
                label="Title"
                labelClassName="mb-1"
              />

              <NormalFormInput
                register={register}
                name={`hero.subtitle.${loc}`}
                className={loc === locale ? "block" : "hidden"}
                label="Subtitle"
                labelClassName="mb-1"
              />

              <NormalFormTextarea
                register={register}
                name={`hero.description.${loc}`}
                className={loc === locale ? "block" : "hidden"}
                label="Description"
                labelClassName="mb-1"
              />
            </React.Fragment>
          ))}
        </CardContent>
      </Card>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
}
