"use client";

import { toast } from "sonner";
import { useRef } from "react";
import Input from "../form/input";
import Header from "../form/header";
import Footer from "../form/footer";
import AddButton from "../form/add-button";
import { Product } from "@/types/products";
import { Sheet, SheetClose, SheetContent } from "../ui/sheet";
import { restockFlowerAction } from "@/lib/flower";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { SubmitHandler, useForm } from "react-hook-form";
import { RestockFormValues, restockSchema } from "@/types/flower";
import { Button } from "../ui/button";

export default function Restock({ flower }: { flower: Product }) {
  const locale = useLocale();
  const t = useTranslations("Flower");
  const form = useRef<HTMLFormElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RestockFormValues>({
    resolver: zodResolver(restockSchema(t)),
    defaultValues: {
      mode: "increment",
      value: 1,
    },
  });

  // Form Submission Handler
  const onSubmit: SubmitHandler<RestockFormValues> = async (values) => {
    if (!flower?.id || !flower?.variants?.[0]?.id) {
      return;
    }

    const result = await restockFlowerAction(
      values,
      flower?.id,
      flower?.variants[0].id,
    );

    if (result.success) {
      toast.success(t("Restock.StockUpdated"));
      closeBtn.current?.click();
      return;
    }

    if (result.errors) {
      Object.entries(result.errors).forEach(([field, message]) => {
        toast.error(message);
        setError(field as keyof RestockFormValues, {
          type: "server",
          message,
        });
      });
      return;
    }

    toast.error(t("Restock.UpdateFailed"));
  };

  return (
    <Sheet>
      <AddButton label={t("Restock.Title", { flower: "" })} />

      <SheetContent
        showCloseButton={false}
        className="flex h-full flex-col sm:max-w-4xl"
        side={locale === "ar" ? "left" : "right"}
      >
        <SheetClose asChild>
          <Button ref={closeBtn} className="hidden"></Button>
        </SheetClose>

        <Header
          title={t("Restock.Title", { flower: flower?.name[locale] ?? "" })}
          description={t("Restock.Description")}
        />

        <div className="flex-1 overflow-auto px-4 pb-6 pt-2 relative">
          <form
            ref={form}
            onSubmit={(e) => handleSubmit(onSubmit)(e)}
            className="space-y-6 relative"
          >
            <Input<RestockFormValues>
              label={t("Restock.AddStems")}
              name={`value`}
              type="number"
              register={register}
              errors={errors}
              required
              placeholder={t("Restock.AddStemsPlaceholder")}
            />
          </form>
        </div>

        <Footer form={form} loading={isSubmitting} />
      </SheetContent>
    </Sheet>
  );
}
