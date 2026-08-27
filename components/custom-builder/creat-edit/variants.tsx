import {
  FieldErrors,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";

import { useState } from "react";
import { Plus } from "lucide-react";
import Input from "@/components/form/input";
import { Button } from "@/components/ui/button";
import { deleteVariantAction } from "@/lib/products";
// import { initialVariant } from "@/constants/products";
import { useFormLocale } from "@/hooks/use-form-locale";
import DeleteBtn from "@/components/reusable/delete-btn";
import SectionLabel from "@/components/form/section-label";
import { TemplateFormValues } from "@/types/custom-builder";

export default function Variants({
  register,
  errors,
  getValues,
  setValue,
  variants,
  tLive,
  templateId,
}: {
  register: UseFormRegister<TemplateFormValues>;
  errors: FieldErrors<TemplateFormValues>;
  setValue: UseFormSetValue<TemplateFormValues>;
  getValues: UseFormGetValues<TemplateFormValues>;
  variants: TemplateFormValues["variants"];
  tLive: ReturnType<typeof useFormLocale>["tLive"];
  templateId?: number;
}) {
  const [loadingDelete, setLoadingDelete] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 justify-between">
        <SectionLabel>{tLive("Shapes")}</SectionLabel>
        <Button
          type="button"
          variant="ghost"
          className="text-xs text-primary hover:bg-transparent hover:text-primary"
          onClick={() => {
            const updatedVariants = [
              ...getValues(`variants`),
              { sku: "", price: 0 },
            ];
            setValue(`variants`, updatedVariants);
          }}
        >
          <Plus />
          {tLive("AddShape")}
        </Button>
      </div>

      {variants.map((variant, index) => (
        <div
          key={index}
          className="grid grid-cols-1 gap-4 border border-border p-4 rounded-md"
        >
          {index > 0 && (
            <div className="md:col-span-2 flex justify-end">
              <DeleteBtn
                loading={loadingDelete}
                onDelete={async () => {
                  if (variant.id && templateId) {
                    setLoadingDelete(true);
                    await deleteVariantAction(templateId, variant.id);
                    setLoadingDelete(false);
                  }

                  const updatedVariants = variants.filter(
                    (_, i) => i !== index,
                  );

                  setValue(`variants`, updatedVariants);
                }}
              />
            </div>
          )}

          <Input<TemplateFormValues>
            label={tLive("Fields.ShapePrice.Label")}
            name={`variants.${index}.price`}
            type="number"
            register={register}
            errors={errors}
            required
            placeholder={tLive("Fields.ShapePrice.Placeholder")}
          />
        </div>
      ))}
    </div>
  );
}
