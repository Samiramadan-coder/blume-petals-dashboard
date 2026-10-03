"use client";

import {
  Coupon,
  promoCodeSchema,
  PromoCodeFormValues,
} from "@/types/promo-codes";
import { useEffect, useRef } from "react";
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
import { useForm, SubmitHandler, useWatch, Controller } from "react-hook-form";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet";
import { postPromoCodeAction } from "@/lib/promo-codes";
import { Category } from "@/types/categories";
import { Field, FieldContent, FieldError, FieldLabel } from "../ui/field";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

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
    // Date inputs only accept YYYY-MM-DD
    starts_at: coupon?.starts_at?.split("T")[0] || "",
    expires_at: coupon?.expires_at?.split("T")[0] || "",
    scope: coupon?.scope || "all",
    category_ids: coupon?.category_ids || [],
    is_active: coupon?.is_active || false,
  };
}

export default function CreateEdit({
  trigger,
  coupon,
  categories,
}: {
  categories: Category[];
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
    reset,
    setError,
    setValue,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<PromoCodeFormValues>({
    defaultValues: getDefaultValues(coupon),
    resolver: zodResolver(promoCodeSchema(t)),
  });

  // watch Required fields to conditionally render other fields based on their values
  const type = useWatch({ control, name: "type" });
  const scope = useWatch({ control, name: "scope" });

  // Reset category_ids if scope is set to "all"
  useEffect(() => {
    if (scope === "all") {
      setValue("category_ids", []);
    }
  }, [scope, setValue]);

  // Handle form submission
  // This function will be called when the form is submitted
  const onSubmit: SubmitHandler<PromoCodeFormValues> = async (data) => {
    const failedMessage = coupon
      ? tCommon("UpdateFailed")
      : tCommon("CreationFailed");

    let result: Awaited<ReturnType<typeof postPromoCodeAction>>;

    try {
      result = await postPromoCodeAction(data, coupon?.id);
    } catch (error) {
      // The request itself failed (e.g. offline)
      console.error("Error submitting promo code:", error);
      toast.error(failedMessage);
      return;
    }

    if (result.success) {
      toast.success(result.message);
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

    toast.error(result.message ?? failedMessage);
  };

  return (
    <Sheet
      onOpenChange={(open) => {
        // Start from the latest saved values every time the sheet opens
        if (open) reset(getDefaultValues(coupon));
      }}
    >
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
            onSubmit={(e) => {
              if (isSubmitting) {
                e.preventDefault();
                return;
              }

              void handleSubmit(onSubmit)(e);
            }}
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
              step="any"
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
              min={0}
              step="any"
              errors={errors}
              register={register}
              label={t("Fields.MinOrderTotal.Label")}
              placeholder={t("Fields.MinOrderTotal.Placeholder")}
              prefix={tCommon("AED")}
              className="sm:col-span-2"
            />

            <Input<PromoCodeFormValues>
              name="usage_limit"
              type="number"
              min={0}
              errors={errors}
              register={register}
              label={t("Fields.UsageLimit.Label")}
              placeholder={t("Fields.UsageLimit.Placeholder")}
            />

            <Input<PromoCodeFormValues>
              name="per_customer_limit"
              type="number"
              min={0}
              errors={errors}
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
              required
              name="scope"
              control={control}
              className="sm:col-span-2"
              label={t("Fields.Scope.Label")}
              placeholder={t("Fields.Scope.Placeholder")}
              options={[
                { value: "all", label: t("Fields.Scope.All") },
                { value: "categories", label: t("Fields.Scope.Category") },
              ]}
            />

            {scope === "categories" && (
              <div className="sm:col-span-2">
                <Field>
                  <FieldLabel
                    id="promo-code-categories"
                    className="text-sm font-semibold"
                  >
                    {t("Fields.Category.Label")}
                  </FieldLabel>

                  <FieldContent>
                    <Controller
                      name="category_ids"
                      control={control}
                      render={({ field }) => {
                        const selectedCategories = field.value ?? [];

                        return (
                          <>
                            <div className="space-y-1.5">
                              <div
                                role="group"
                                aria-labelledby="promo-code-categories"
                                className="flex flex-wrap gap-2"
                              >
                                {categories.map((category) => {
                                  const isSelected =
                                    selectedCategories.includes(category.id);

                                  return (
                                    <Badge
                                      key={category.id}
                                      asChild
                                      variant="outline"
                                      className={cn(
                                        `h-6 text-xs px-4 cursor-pointer`,
                                        { "bg-primary/20 border": isSelected },
                                      )}
                                    >
                                      <button
                                        type="button"
                                        aria-pressed={isSelected}
                                        onClick={() => {
                                          const nextCategories = isSelected
                                            ? selectedCategories.filter(
                                                (i) => i !== category.id,
                                              )
                                            : [
                                                ...selectedCategories,
                                                category.id,
                                              ];
                                          field.onChange(nextCategories);
                                        }}
                                      >
                                        {category.name[locale]}
                                      </button>
                                    </Badge>
                                  );
                                })}
                              </div>
                            </div>

                            <FieldError errors={[errors.category_ids]} />
                          </>
                        );
                      }}
                    />
                  </FieldContent>
                </Field>
              </div>
            )}

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
