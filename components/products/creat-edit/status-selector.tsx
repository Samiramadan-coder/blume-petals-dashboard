import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ProductFormValues } from "@/types/products";
import { Control, Controller } from "react-hook-form";
import { productStatuses } from "@/constants/products";
import { useFormLocale } from "@/hooks/use-form-locale";

export default function StatusSelector({
  control,
  tLive,
}: {
  control: Control<ProductFormValues>;
  tLive: ReturnType<typeof useFormLocale>["tLive"];
}) {
  return (
    <Controller
      name="status"
      control={control}
      render={({ field }) => {
        const selectedStatus = field.value ?? "active";

        return (
          <div className="flex gap-2">
            {productStatuses((key) => tLive(key as never)).map((status) => {
              return (
                <Button
                  className={cn(`flex-1 h-10 bg-white`, {
                    "bg-primary/20 border-2": selectedStatus === status.value,
                  })}
                  onClick={() => field.onChange(status.value)}
                  type="button"
                  variant="outline"
                  key={status.value}
                >
                  {status.label}
                </Button>
              );
            })}
          </div>
        );
      }}
    />
  );
}
