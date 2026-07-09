"use client";

import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";

import { Field, FieldContent, FieldError, FieldLabel } from "../ui/field";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { cn } from "@/lib/utils";

type SelectOption = {
  label: string;
  value: string;
};

type NormalFormSelectProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  placeholder?: string;
  required?: boolean;
  control: Control<T>;
  options: SelectOption[];
  groupLabel?: string;
  className?: string;
  triggerClassName?: string;
};

export default function NormalFormSelect<T extends FieldValues>({
  name,
  label,
  placeholder = "Choose",
  required,
  control,
  options,
  groupLabel,
  className,
  triggerClassName,
}: NormalFormSelectProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field className={className} data-invalid={fieldState.invalid}>
          <FieldLabel
            htmlFor={name}
            className={cn(
              "text-xs font-semibold",
              required &&
                "after:ms-1 after:text-destructive after:content-['*']",
            )}
          >
            {label}
          </FieldLabel>

          <FieldContent>
            <div className="space-y-1.5">
              <Select value={field.value ?? ""} onValueChange={field.onChange}>
                <SelectTrigger
                  id={name}
                  aria-invalid={fieldState.invalid}
                  className={cn(
                    "h-10 min-h-10 w-full border-border bg-background",
                    triggerClassName,
                  )}
                >
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    {groupLabel && <SelectLabel>{groupLabel}</SelectLabel>}

                    {options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <FieldError errors={[fieldState.error]} />
            </div>
          </FieldContent>
        </Field>
      )}
    />
  );
}
