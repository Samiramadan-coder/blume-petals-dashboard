"use client";

import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { useRef } from "react";
import { Check, Flower2 } from "lucide-react";
import FormFooter from "../form/form-footer";
import SectionLabel from "../form/section-label";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import NormalFormInput from "../form/normal-form-input";
import FormHeader from "../form/form-header";
import {
  Category,
  CategoryFormValues,
  categorySchema,
} from "@/types/categories";
import FormAddButton from "../form/form-add-button";
import { Card, CardContent } from "../ui/card";
import NormalFormSwitch from "../form/normal-form-switch";
import { FieldError } from "../ui/field";
import { Button } from "../ui/button";
import { colors, icons } from "@/constants/categories";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";

export default function CreateEdit({
  category,
  trigger,
}: {
  category?: Category;
  trigger?: React.ReactNode;
}) {
  const form = useRef<HTMLFormElement>(null);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || "",
      visibility: category?.visibility ?? true,
      icon: category?.icon || 0,
      color: category?.color || "",
    },
  });

  const watchName = useWatch({
    control,
    name: "name",
  });

  const watchColor = useWatch({
    control,
    name: "color",
  });

  const onSubmit = (values: CategoryFormValues) => {
    console.log("Category form values:", values);
  };

  return (
    <Sheet>
      {trigger ? (
        <SheetTrigger asChild>{trigger}</SheetTrigger>
      ) : (
        <FormAddButton label="Add Category" />
      )}

      <SheetContent
        showCloseButton={false}
        className="flex h-full flex-col sm:max-w-2xl"
        onInteractOutside={(event) => event.preventDefault()}
      >
        <FormHeader
          title="Add Category"
          description="Create a new product category"
        />

        <div className="flex-1 overflow-auto px-4 pb-6 pt-2">
          <form
            ref={form}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 relative"
          >
            <Card>
              <CardContent className="flex items-center gap-2">
                <div className="bg-primary/20 p-2.5 rounded-lg">
                  <Flower2 className="size-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">
                    {watchName || "Category Name"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Separator className="bg-border" />
            <SectionLabel>Details</SectionLabel>
            <NormalFormInput<CategoryFormValues>
              label="Category Name"
              placeholder="Enter Category Name"
              name="name"
              type="text"
              register={register}
              errors={errors}
              required
            />

            <Separator className="bg-border" />
            <SectionLabel>Icon</SectionLabel>
            <Controller
              name="icon"
              control={control}
              render={({ field }) => {
                const selectedIcon = field.value ?? "";

                return (
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap gap-2">
                      {icons.map((icon) => {
                        const isSelected = selectedIcon === icon.id;
                        const selectedColor = watchColor;

                        return (
                          <div
                            key={icon.id}
                            className="cursor-pointer"
                            onClick={() => {
                              const nextIcon = isSelected ? undefined : icon.id;
                              field.onChange(nextIcon);
                            }}
                          >
                            <Card
                              className={cn(
                                "w-25 h-25 border-2 grid place-content-center",
                                { "border-2 border-primary": isSelected },
                              )}
                            >
                              <CardContent
                                className={cn(
                                  "w-15 h-15 grid place-content-center rounded-full",
                                  !selectedColor &&
                                    "text-primary bg-primary/20",
                                )}
                                style={
                                  selectedColor
                                    ? {
                                        color: selectedColor,
                                        backgroundColor: `${selectedColor}20`,
                                      }
                                    : undefined
                                }
                              >
                                {icon.icon}
                              </CardContent>
                            </Card>
                          </div>
                        );
                      })}
                    </div>

                    <FieldError errors={[errors.icon]} />
                  </div>
                );
              }}
            />

            <Separator className="bg-border" />
            <SectionLabel>Color</SectionLabel>
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

            <Separator className="bg-border" />
            <SectionLabel>Visibility</SectionLabel>
            <NormalFormSwitch<CategoryFormValues>
              name="visibility"
              control={control}
              label="Show on storefront"
              description="Category is visible to customers"
            />
          </form>
        </div>
        <FormFooter form={form} />
      </SheetContent>
    </Sheet>
  );
}
