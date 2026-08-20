import { Badge } from "@/components/ui/badge";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { useFormLocale } from "@/hooks/use-form-locale";
import { cn } from "@/lib/utils";
import { Occasion } from "@/types/occasions";
import { ProductFormValues } from "@/types/products";
import { Control, Controller } from "react-hook-form";

export default function Occasions({
  tLive,
  control,
  occasions,
  activeLocale,
}: {
  tLive: ReturnType<typeof useFormLocale>["tLive"];
  control: Control<ProductFormValues>;
  occasions: Occasion[];
  activeLocale: "ar" | "en";
}) {
  return (
    <>
      <Separator className="bg-border" />
      <Field>
        <FieldLabel htmlFor="occasions" className="text-xs font-semibold">
          {tLive("Fields.OccasionTags")}
        </FieldLabel>

        <FieldContent>
          <Controller
            name="occasion_ids"
            control={control}
            render={({ field }) => {
              const selectedOccasions = field.value ?? [];

              return (
                <div className="flex flex-wrap gap-1.5">
                  {occasions.map((occasion) => {
                    const isSelected = selectedOccasions.includes(occasion.id);

                    return (
                      <Badge
                        key={occasion.id}
                        variant="outline"
                        className={cn(
                          `h-7 text-xs text-muted-foreground px-2.5 cursor-pointer`,
                          {
                            "bg-primary/20 border": isSelected,
                          },
                        )}
                        onClick={() => {
                          const nextOccasions = isSelected
                            ? selectedOccasions.filter((i) => i !== occasion.id)
                            : [...selectedOccasions, occasion.id];
                          field.onChange(nextOccasions);
                        }}
                      >
                        {occasion.name_translations[activeLocale]}
                      </Badge>
                    );
                  })}
                </div>
              );
            }}
          />
        </FieldContent>
      </Field>
    </>
  );
}
