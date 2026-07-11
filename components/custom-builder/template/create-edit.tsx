"use client";

import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import AddButton from "@/components/form/add-button";
import FormHeader from "@/components/form/form-header";
import { Separator } from "@/components/ui/separator";
import SectionLabel from "@/components/form/section-label";
import NormalFormInput from "@/components/form/normal-form-input";
import FormSwitch from "@/components/form/form-switch";
import FormFooter from "@/components/form/form-footer";
import {
  Template,
  TemplateFormValues,
  templateSchema,
} from "@/types/custom-builder";
import SingleFormImageUploader from "@/components/form/form-single-image-uploader";

const priceSizes: Array<{ size: "S" | "M" | "L" | "XL"; flowers: number }> = [
  { size: "S", flowers: 8 },
  { size: "M", flowers: 12 },
  { size: "L", flowers: 18 },
  { size: "XL", flowers: 24 },
];

export default function CreateEdit({
  template,
  trigger,
}: {
  template?: Template;
  trigger?: React.ReactNode;
}) {
  const defaultPrices = priceSizes.map((item, index) => ({
    size: item.size,
    price: template?.prices?.[index]?.price ?? 0,
    flowers: template?.prices?.[index]?.flowers ?? item.flowers,
  }));

  const form = useRef<HTMLFormElement>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: template?.name || "",
      icon: template?.icon || "",
      emoji: template?.emoji || "",
      prices: defaultPrices,
      active: template?.active ?? true,
    },
  });

  const onSubmit = (values: TemplateFormValues) => {
    console.log("Template form values:", values);
  };

  return (
    <Sheet>
      {trigger ? (
        <SheetTrigger asChild>{trigger}</SheetTrigger>
      ) : (
        <AddButton label="Add Template" />
      )}

      <SheetContent
        showCloseButton={false}
        className="flex h-full flex-col sm:max-w-2xl"
        onInteractOutside={(event) => event.preventDefault()}
      >
        <FormHeader
          title={template ? "Edit Template" : "Add Template"}
          description="Define template details and flower-based pricing"
        />

        <div className="flex-1 overflow-auto px-4 pb-6 pt-2">
          <form
            ref={form}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 relative"
          >
            <SectionLabel>Details</SectionLabel>
            <NormalFormInput<TemplateFormValues>
              label="Template Name"
              placeholder="e.g. Circular"
              name="name"
              type="text"
              register={register}
              errors={errors}
              required
            />

            <Separator className="bg-border" />
            <SectionLabel>Icon & Emoji</SectionLabel>
            <div className="space-y-4">
              <p className="text-muted-foreground text-xs">
                Upload an image or paste an emoji as placeholder
              </p>

              <SingleFormImageUploader
                control={control}
                name="icon"
                label="Icon"
              />

              <NormalFormInput<TemplateFormValues>
                label="Emoji"
                placeholder="e.g. 💐"
                name="emoji"
                type="text"
                register={register}
                errors={errors}
              />
            </div>

            <Separator className="bg-border" />
            <SectionLabel>Prices</SectionLabel>
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground">
                Base Prices (AED) & Flower Counts per Size
              </p>

              <div className="overflow-hidden rounded-xl border border-border">
                <div className="grid grid-cols-[72px_1fr_120px] items-center gap-3 border-b border-border bg-muted/40 px-3 py-2 text-xs font-semibold text-muted-foreground">
                  <span>Size</span>
                  <span>Base Price (AED)</span>
                  <span>~Flowers</span>
                </div>

                {priceSizes.map((item, index) => (
                  <div
                    key={item.size}
                    className="grid grid-cols-[72px_1fr_120px] items-center gap-3 border-b border-border px-3 py-2 last:border-b-0"
                  >
                    <span className="text-sm font-semibold text-primary/80">
                      {item.size}
                    </span>

                    <div>
                      <input
                        type="hidden"
                        {...register(`prices.${index}.size`)}
                        value={item.size}
                      />
                      <NormalFormInput<TemplateFormValues>
                        label=""
                        placeholder="0"
                        name={`prices.${index}.price`}
                        type="number"
                        register={register}
                        errors={errors}
                        inputClassName="h-10"
                      />
                    </div>

                    <NormalFormInput<TemplateFormValues>
                      label=""
                      placeholder="0"
                      name={`prices.${index}.flowers`}
                      type="number"
                      register={register}
                      errors={errors}
                      inputClassName="h-10"
                    />
                  </div>
                ))}
              </div>
            </div>

            <Separator className="bg-border" />
            <SectionLabel>Status</SectionLabel>
            <FormSwitch<TemplateFormValues>
              name="active"
              control={control}
              label="Template is active"
              description="Active templates are available in custom builder"
            />
          </form>
        </div>
        <FormFooter form={form} />
      </SheetContent>
    </Sheet>
  );
}
