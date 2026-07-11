"use client";

import {
  OccasionCollection,
  OccasionCollectionFormValues,
  occasionCollectionSchema,
} from "@/types/occasions-collections";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { Button } from "../ui/button";
import { FieldError } from "../ui/field";
import { Separator } from "../ui/separator";
import FormFooter from "../form/form-footer";
import FormHeader from "../form/form-header";
import SectionLabel from "../form/section-label";
import AddButton from "../form/add-button";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import NormalFormInput from "../form/normal-form-input";
import FormSwitch from "../form/form-switch";
import { colors } from "@/constants/occasions-collections";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import SingleFormImageUploader from "../form/form-single-image-uploader";
import DayMonthPicker from "../form/day-month-picker";

export default function CreateEdit({
  occasion,
  trigger,
}: {
  occasion?: OccasionCollection;
  trigger?: React.ReactNode;
}) {
  const form = useRef<HTMLFormElement>(null);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<OccasionCollectionFormValues>({
    resolver: zodResolver(occasionCollectionSchema),
    defaultValues: {
      banner: occasion?.banner || "",
      name: occasion?.name || "",
      startDate: occasion?.startDate || "",
      endDate: occasion?.endDate || "",
      visibility: occasion?.visibility ?? true,
      color: occasion?.color || "",
    },
  });

  const onSubmit = (values: OccasionCollectionFormValues) => {
    console.log("Occasion collection form values:", values);
  };

  return (
    <Sheet>
      {trigger ? (
        <SheetTrigger asChild>{trigger}</SheetTrigger>
      ) : (
        <AddButton label="Add Occasion Collection" />
      )}

      <SheetContent
        showCloseButton={false}
        className="flex h-full flex-col sm:max-w-2xl"
        onInteractOutside={(event) => event.preventDefault()}
      >
        <FormHeader
          title="Add Occasion"
          description="Create a new occasion or collection"
        />

        <div className="flex-1 overflow-auto px-4 pb-6 pt-2">
          <form
            ref={form}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 relative"
          >
            <SingleFormImageUploader
              control={control}
              name="banner"
              label="Banner"
            />

            <SectionLabel>Details</SectionLabel>
            <NormalFormInput<OccasionCollectionFormValues>
              label="Occasion Name"
              placeholder="Enter Occasion Name"
              name="name"
              type="text"
              register={register}
              errors={errors}
              required
            />

            <Separator className="bg-border" />
            <SectionLabel>Promotional Date Range</SectionLabel>
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">
                Optional — occasion will only appear during this window each
                year. Leave blank to show year-round.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DayMonthPicker
                  label="Start Date"
                  control={control}
                  name="startDate"
                  required
                />

                <DayMonthPicker
                  label="End Date"
                  control={control}
                  name="endDate"
                  required
                />
              </div>
            </div>

            <Separator className="bg-border" />
            <SectionLabel>Accent Color</SectionLabel>
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">
                Used for banners, overlays, and CTAs for this occasion.
              </p>
              <Controller
                name="color"
                control={control}
                render={({ field }) => {
                  const selectedColors = field.value ?? "";

                  return (
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap gap-2">
                        {colors.map((color) => {
                          const isSelected = selectedColors === color;

                          return (
                            <Button
                              key={color}
                              type="button"
                              variant="outline"
                              className={cn(
                                "h-8 w-8 rounded-full border border-border cursor-pointer",
                                {
                                  "border-2 border-primary": isSelected,
                                },
                              )}
                              style={{ backgroundColor: color }}
                              onClick={() => {
                                const nextColors = isSelected ? "" : color;

                                field.onChange(nextColors);
                              }}
                            >
                              {isSelected && <Check />}
                            </Button>
                          );
                        })}
                      </div>

                      <FieldError errors={[errors.color]} />
                    </div>
                  );
                }}
              />
            </div>

            <Separator className="bg-border" />
            <SectionLabel>Visibility</SectionLabel>
            <FormSwitch<OccasionCollectionFormValues>
              name="visibility"
              control={control}
              label="Show on storefront"
              description="Occasion is visible to customers"
            />
          </form>
        </div>
        <FormFooter form={form} />
      </SheetContent>
    </Sheet>
  );
}
