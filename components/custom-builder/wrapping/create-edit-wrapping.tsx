"use client";

import {
  Wrapping,
  WrappingFormValues,
  wrappingSchema,
} from "@/types/custom-builder";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/form/header";
import Footer from "@/components/form/footer";
import SectionLabel from "@/components/form/section-label";
import AddButton from "@/components/form/add-button";
import NormalFormInput from "@/components/form/normal-form-input";
import Switch from "@/components/form/switch";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import SingleFormImageUploader from "@/components/form/form-single-image-uploader";

export default function CreateEditWrapping({
  wrapping,
  trigger,
}: {
  wrapping?: Wrapping;
  trigger?: React.ReactNode;
}) {
  const form = useRef<HTMLFormElement>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<WrappingFormValues>({
    resolver: zodResolver(wrappingSchema),
    defaultValues: {
      icon: wrapping?.icon || "",
      emoji: wrapping?.emoji || "",
      name: wrapping?.name || "",
      price: wrapping?.price || 0,
      active: wrapping?.active ?? true,
    },
  });

  const onSubmit = (values: WrappingFormValues) => {
    console.log("Wrapping Option form values:", values);
  };

  return (
    <Sheet>
      {trigger ? (
        <SheetTrigger asChild>{trigger}</SheetTrigger>
      ) : (
        <AddButton label="Add Wrapping Option" />
      )}

      <SheetContent
        showCloseButton={false}
        className="flex h-full flex-col sm:max-w-2xl"
        onInteractOutside={(event) => event.preventDefault()}
      >
        <Header
          title={wrapping ? "Edit Wrapping Option" : "Add Wrapping Option"}
        />

        <div className="flex-1 overflow-auto px-4 pb-6 pt-2">
          <form
            ref={form}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 relative"
          >
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

              <NormalFormInput<WrappingFormValues>
                label="Emoji"
                placeholder="e.g. 💐"
                name="emoji"
                type="text"
                register={register}
                errors={errors}
              />
            </div>

            <Separator className="bg-border" />
            <SectionLabel>Details</SectionLabel>
            <NormalFormInput<WrappingFormValues>
              label="Wrapping Option Name"
              placeholder="e.g. Rose"
              name="name"
              type="text"
              register={register}
              errors={errors}
              required
            />

            <NormalFormInput<WrappingFormValues>
              label="Price (AED)"
              placeholder="e.g. 10"
              name="price"
              type="number"
              register={register}
              errors={errors}
              required
            />

            <Separator className="bg-border" />
            <SectionLabel>Status</SectionLabel>
            <Switch<WrappingFormValues>
              name="active"
              control={control}
              label="Active"
            />
          </form>
        </div>
        <Footer form={form} />
      </SheetContent>
    </Sheet>
  );
}
