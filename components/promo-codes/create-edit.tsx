"use client";

import {
  Coupon,
  promoCodeSchema,
  PromoCodeFormValues,
} from "@/types/promo-codes";
import { useRef } from "react";
import { toast } from "sonner";
import Input from "../form/input";
import Header from "../form/header";
import Select from "../form/select";
import Footer from "../form/footer";
import Switch from "../form/switch";
import { Button } from "../ui/button";
import AddButton from "../form/add-button";
import { Separator } from "../ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet";
import { postPromoCodeAction } from "@/lib/promo-codes";

// Function to get default values for the form,
// either from an existing coupon or default values
function getDefaultValues(coupon?: Coupon): PromoCodeFormValues {
  return {
    code: coupon?.code || "",
    type: coupon?.type || "percentage",
    value: coupon?.value ? +coupon.value : 0,
    min_order_total: coupon?.min_order_total
      ? +coupon.min_order_total
      : undefined,
    usage_limit: coupon?.usage_limit || undefined,
    per_customer_limit: coupon?.per_customer_limit || undefined,
    starts_at: coupon?.starts_at || "",
    expires_at: coupon?.expires_at || "",
    scope: coupon?.scope || "all",
    is_active: coupon?.is_active || false,
  };
}

export default function CreateEdit({
  trigger,
  coupon,
}: {
  trigger?: React.ReactNode;
  coupon?: Coupon;
}) {
  const locale = useLocale();
  const t = useTranslations("PromoCodes");
  const tCommon = useTranslations("Common");
  const form = useRef<HTMLFormElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  // Initialize the form with react-hook-form and zod validation
  // The form will use default values based on whether a coupon is being edited or a new one is being created
  const {
    register,
    control,
    setError,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<PromoCodeFormValues>({
    defaultValues: getDefaultValues(coupon),
    resolver: zodResolver(promoCodeSchema(t)),
  });

  // watch Required fields to conditionally render other fields based on their values
  const type = useWatch({ control, name: "type" });

  // Handle form submission
  // This function will be called when the form is submitted
  const onSubmit: SubmitHandler<PromoCodeFormValues> = async (data) => {
    const result = await postPromoCodeAction(data, coupon?.id);

    if (result.success) {
      toast.success(
        coupon
          ? tCommon("UpdatedSuccessfully")
          : tCommon("CreatedSuccessfully"),
      );
      form.current?.reset();
      closeBtn.current?.click();
      return;
    }

    if (result.errors) {
      Object.entries(result.errors).forEach(([field, message]) => {
        toast.error(message);
        setError(field as keyof PromoCodeFormValues, {
          type: "server",
          message,
        });
      });

      return;
    }

    toast.error(coupon ? tCommon("UpdateFailed") : tCommon("CreationFailed"));
  };

  return (
    <Sheet>
      {trigger ? (
        <SheetTrigger asChild>{trigger}</SheetTrigger>
      ) : (
        <AddButton label={t("CreatePromoCode")} />
      )}

      <SheetContent
        showCloseButton={false}
        className="flex h-full flex-col sm:max-w-4xl"
        onInteractOutside={(event) => event.preventDefault()}
        side={locale === "ar" ? "left" : "right"}
      >
        <SheetClose asChild>
          <Button ref={closeBtn} className="hidden"></Button>
        </SheetClose>

        <Header
          title={coupon ? t("EditPromoCode") : t("CreatePromoCode")}
          description={t("CreatePromoCodeDescription")}
        />

        <div className="flex-1 overflow-auto px-4 pb-6 pt-2 relative">
          <form
            ref={form}
            className="relative grid grid-cols-1 sm:grid-cols-2 gap-6"
            onSubmit={(e) => handleSubmit(onSubmit)(e)}
          >
            <Input<PromoCodeFormValues>
              required
              name="code"
              errors={errors}
              register={register}
              label={t("Fields.Code.Label")}
              placeholder={t("Fields.Code.Placeholder")}
              className="sm:col-span-2"
            />

            <Select<PromoCodeFormValues>
              control={control}
              name="type"
              label={t("Fields.Type.Label")}
              placeholder={t("Fields.Type.Placeholder")}
              required
              options={[
                { value: "percentage", label: t("Fields.Type.Percentage") },
                { value: "fixed", label: t("Fields.Type.Fixed") },
              ]}
              className="sm:col-span-2"
            />

            <Input<PromoCodeFormValues>
              required
              name="value"
              type="number"
              errors={errors}
              register={register}
              label={`${t("Fields.Value.Label")} (${type === "percentage" ? "%" : tCommon("AED")})`}
              placeholder={`${t("Fields.Value.Placeholder")}`}
              className="sm:col-span-2"
              prefix={type === "percentage" ? "%" : tCommon("AED")}
            />

            <Separator className="sm:col-span-2" />

            <Input<PromoCodeFormValues>
              name="min_order_total"
              type="number"
              register={register}
              label={t("Fields.MinOrderTotal.Label")}
              placeholder={t("Fields.MinOrderTotal.Placeholder")}
              prefix={tCommon("AED")}
              className="sm:col-span-2"
            />

            <Input<PromoCodeFormValues>
              name="usage_limit"
              type="number"
              register={register}
              label={t("Fields.UsageLimit.Label")}
              placeholder={t("Fields.UsageLimit.Placeholder")}
            />

            <Input<PromoCodeFormValues>
              name="per_customer_limit"
              type="number"
              register={register}
              label={t("Fields.PerCustomerLimit.Label")}
              placeholder={t("Fields.PerCustomerLimit.Placeholder")}
            />

            <Separator className="sm:col-span-2" />

            <Input<PromoCodeFormValues>
              name="starts_at"
              type="date"
              register={register}
              label={t("Fields.StartDate.Label")}
              errors={errors}
            />

            <Input<PromoCodeFormValues>
              name="expires_at"
              type="date"
              register={register}
              label={t("Fields.ExpiresAt.Label")}
              errors={errors}
            />

            <Separator className="sm:col-span-2" />

            <Select<PromoCodeFormValues>
              control={control}
              name="scope"
              label={t("Fields.Scope.Label")}
              placeholder={t("Fields.Scope.Placeholder")}
              required
              options={[
                { value: "all", label: t("Fields.Scope.All") },
                { value: "category", label: t("Fields.Scope.Category") },
              ]}
              className="sm:col-span-2"
            />

            <Switch
              name="is_active"
              control={control}
              label={t("Fields.Active.Label")}
              description={t("Fields.Active.Description")}
              className="sm:col-span-2"
            />
          </form>
        </div>

        <Footer form={form} loading={isSubmitting} />
      </SheetContent>
    </Sheet>
  );
}
