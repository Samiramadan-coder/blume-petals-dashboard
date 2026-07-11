"use client";

import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/form/header";
import Footer from "@/components/form/footer";
import SectionLabel from "@/components/form/section-label";
import AddButton from "@/components/form/add-button";
import NormalFormInput from "@/components/form/normal-form-input";
import FormSwitch from "@/components/form/form-switch";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Ribbon, RibbonFormValues, ribbonSchema } from "@/types/custom-builder";

export default function CreateEditRibbons({
  ribbon,
  trigger,
}: {
  ribbon?: Ribbon;
  trigger?: React.ReactNode;
}) {
  const form = useRef<HTMLFormElement>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RibbonFormValues>({
    resolver: zodResolver(ribbonSchema),
    defaultValues: {
      name: ribbon?.name || "",
      color: ribbon?.color || "",
      price: ribbon?.price || 0,
      active: ribbon?.active ?? true,
    },
  });

  const onSubmit = (values: RibbonFormValues) => {
    console.log("Ribbon form values:", values);
  };

  return (
    <Sheet>
      {trigger ? (
        <SheetTrigger asChild>{trigger}</SheetTrigger>
      ) : (
        <AddButton label="Add Ribbon" />
      )}

      <SheetContent
        showCloseButton={false}
        className="flex h-full flex-col sm:max-w-2xl"
        onInteractOutside={(event) => event.preventDefault()}
      >
        <Header title={ribbon ? "Edit Ribbon" : "Add Ribbon"} />

        <div className="flex-1 overflow-auto px-4 pb-6 pt-2">
          <form
            ref={form}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 relative"
          >
            <SectionLabel>Details</SectionLabel>
            <NormalFormInput<RibbonFormValues>
              label="Ribbon Name"
              placeholder="e.g. Rose"
              name="name"
              type="text"
              register={register}
              errors={errors}
              required
            />

            <NormalFormInput<RibbonFormValues>
              label="Color"
              placeholder="e.g. Red"
              name="color"
              type="color"
              register={register}
              errors={errors}
              required
            />

            <NormalFormInput<RibbonFormValues>
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
            <FormSwitch<RibbonFormValues>
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
