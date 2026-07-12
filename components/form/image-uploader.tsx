"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { Image as ImageIcon, Star } from "lucide-react";

import { Badge } from "../ui/badge";
import { Field, FieldContent, FieldError, FieldLabel } from "../ui/field";
import { cn } from "@/lib/utils";

type ImageValue = string | Blob;

type NormalFormImageUploaderProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  required?: boolean;
  className?: string;
  buttonLabel: string;
  mainLabel: string;
};

export default function NormalFormImageUploader<T extends FieldValues>({
  name,
  control,
  label = "Product Photos",
  required,
  className,
  buttonLabel,
  mainLabel,
}: NormalFormImageUploaderProps<T>) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(
    null,
  );

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const selectedImages = (field.value ?? []) as ImageValue[];

        const handleImageDrop = (targetIndex: number) => {
          if (draggedImageIndex === null || draggedImageIndex === targetIndex) {
            return;
          }

          const reorderedImages = [...selectedImages];
          const [movedImage] = reorderedImages.splice(draggedImageIndex, 1);

          reorderedImages.splice(targetIndex, 0, movedImage);

          field.onChange(reorderedImages);
          setDraggedImageIndex(null);
        };

        return (
          <Field className={className} data-invalid={fieldState.invalid}>
            <FieldLabel
              className={cn(
                "text-sm font-semibold",
                required &&
                  "after:ms-1 after:text-destructive after:content-['*']",
              )}
            >
              {label}
            </FieldLabel>

            <FieldContent>
              <div className="space-y-2">
                <div className="rounded-lg border border-dashed border-border bg-primary/10 p-4">
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
                    {selectedImages.map((image, index) => {
                      const imageUrl =
                        typeof image === "string"
                          ? image
                          : URL.createObjectURL(image);

                      return (
                        <div
                          key={index}
                          draggable
                          onDragStart={() => setDraggedImageIndex(index)}
                          onDragOver={(event) => event.preventDefault()}
                          onDrop={() => handleImageDrop(index)}
                          onDragEnd={() => setDraggedImageIndex(null)}
                          className={cn(
                            "relative overflow-hidden rounded-lg border border-border",
                            draggedImageIndex === index && "opacity-60",
                          )}
                        >
                          <Image
                            src={imageUrl}
                            alt={`Product Image ${index + 1}`}
                            width={300}
                            height={300}
                            className="h-24 w-full object-cover"
                          />

                          {index === 0 && (
                            <Badge className="absolute bottom-2 rounded-sm inset-s-2 text-[10px] uppercase text-foreground">
                              <Star className="size-3" />
                              {mainLabel}
                            </Badge>
                          )}
                        </div>
                      );
                    })}

                    <div
                      className="flex h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border p-3 text-muted-foreground transition duration-150 hover:border-2 hover:border-primary"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <ImageIcon className="size-5" />
                      <span className="text-xs">{buttonLabel}</span>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        multiple
                        onChange={(event) => {
                          const files = Array.from(event.target.files ?? []);

                          if (!files.length) return;

                          field.onChange([...selectedImages, ...files]);
                          event.target.value = "";
                        }}
                      />
                    </div>
                  </div>
                </div>

                <FieldError errors={[fieldState.error]} />
              </div>
            </FieldContent>
          </Field>
        );
      }}
    />
  );
}
