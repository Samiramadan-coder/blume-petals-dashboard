"use client";

import { Flower, FlowerFormValues, flowerSchema } from "@/types/custom-builder";
import { useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@/components/ui/separator";
import FormHeader from "@/components/form/form-header";
import FormFooter from "@/components/form/form-footer";
import SectionLabel from "@/components/form/section-label";
import AddButton from "@/components/form/add-button";
import NormalFormInput from "@/components/form/normal-form-input";
import FormSwitch from "@/components/form/form-switch";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import SingleFormImageUploader from "@/components/form/form-single-image-uploader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldError } from "@/components/ui/field";
import { Plus, X } from "lucide-react";
import { normalizeHexColor } from "@/lib/utils";

export default function CreateEdit({
  flower,
  trigger,
}: {
  flower?: Flower;
  trigger?: React.ReactNode;
}) {
  const form = useRef<HTMLFormElement>(null);
  const [nextColor, setNextColor] = useState("#b4a683");

  const {
    register,
    control,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FlowerFormValues>({
    resolver: zodResolver(flowerSchema),
    defaultValues: {
      icon: flower?.icon || "",
      emoji: flower?.emoji || "",
      name: flower?.name || "",
      price: flower?.price || 0,
      colors: flower?.colors?.length ? flower.colors : [],
      startingStock: flower?.startingStock || 0,
      lowStockThreshold: flower?.lowStockThreshold || 0,
      active: flower?.active ?? true,
    },
  });

  const colors =
    useWatch({
      control,
      name: "colors",
    }) ?? [];

  const handleAddColor = () => {
    const normalizedColor = normalizeHexColor(nextColor);

    if (!normalizedColor) {
      setError("colors", {
        type: "manual",
        message: "Use a valid hex color like #b4a683",
      });
      return;
    }

    if (colors.includes(normalizedColor)) {
      setError("colors", {
        type: "manual",
        message: "This color is already added",
      });
      return;
    }

    setValue("colors", [...colors, normalizedColor], {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    clearErrors("colors");
    setNextColor("#b4a683");
  };

  const handleRemoveColor = (colorToRemove: string) => {
    setValue(
      "colors",
      colors.filter((color) => color !== colorToRemove),
      {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      },
    );
  };

  const onSubmit = (values: FlowerFormValues) => {
    console.log("Flower Type form values:", values);
  };

  return (
    <Sheet>
      {trigger ? (
        <SheetTrigger asChild>{trigger}</SheetTrigger>
      ) : (
        <AddButton label="Add Flower Type" />
      )}

      <SheetContent
        showCloseButton={false}
        className="flex h-full flex-col sm:max-w-2xl"
        onInteractOutside={(event) => event.preventDefault()}
      >
        <FormHeader title={flower ? "Edit Flower Type" : "Add Flower Type"} />

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

              <NormalFormInput<FlowerFormValues>
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
            <NormalFormInput<FlowerFormValues>
              label="Flower Name"
              placeholder="e.g. Rose"
              name="name"
              type="text"
              register={register}
              errors={errors}
              required
            />

            <NormalFormInput<FlowerFormValues>
              label="Price per Stem (AED)"
              placeholder="e.g. 10"
              name="price"
              type="number"
              register={register}
              errors={errors}
              required
            />

            <NormalFormInput<FlowerFormValues>
              label="Starting Stock"
              placeholder="e.g. 10"
              name="startingStock"
              type="number"
              register={register}
              errors={errors}
              required
            />

            <NormalFormInput<FlowerFormValues>
              label="Low Stock Threshold"
              placeholder="e.g. 10"
              name="lowStockThreshold"
              type="number"
              register={register}
              errors={errors}
              required
            />

            <Separator className="bg-border" />
            <SectionLabel>Color Variants</SectionLabel>
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">
                Add one or more hex colors used for this flower (for example,
                #b4a683)
              </p>

              {colors.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <Badge
                      key={color}
                      variant="outline"
                      className="h-7 gap-2 border-border"
                    >
                      <span
                        className="h-3 w-3 rounded-full border border-border"
                        style={{ backgroundColor: color }}
                      />
                      {color}
                      <button
                        type="button"
                        className="cursor-pointer text-muted-foreground hover:text-foreground"
                        onClick={() => handleRemoveColor(color)}
                        aria-label={`Remove ${color}`}
                      >
                        <X className="size-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Input
                  type="color"
                  value={normalizeHexColor(nextColor) ?? "#b4a683"}
                  onChange={(event) => setNextColor(event.target.value)}
                  className="h-10 w-full cursor-pointer p-1 sm:w-16"
                  aria-label="Pick color"
                />
                <Input
                  type="text"
                  value={nextColor}
                  onChange={(event) => setNextColor(event.target.value)}
                  placeholder="#b4a683"
                  className="h-10"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 cursor-pointer"
                  onClick={handleAddColor}
                >
                  <Plus className="size-4" />
                  Add Color
                </Button>
              </div>

              <FieldError errors={[errors.colors]} />
            </div>

            <Separator className="bg-border" />
            <SectionLabel>Status</SectionLabel>
            <FormSwitch<FlowerFormValues>
              name="active"
              control={control}
              label="Active on Custom Builder"
              description="Active flowers are available in custom builder"
            />
          </form>
        </div>
        <FormFooter form={form} />
      </SheetContent>
    </Sheet>
  );
}
