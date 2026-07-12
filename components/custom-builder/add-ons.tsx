"use client";

import { TableCell } from "../ui/table";
import { ExternalLink, MessageCircle, Save } from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Card, CardContent } from "../ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import Switch from "../form/switch";
import { addOnsSchema, AddOnsFormData } from "@/types/custom-builder";
import { ReorderableDataTable } from "../reusable/date-sortable-table";
import { addOnsColumns } from "@/constants/custom-builder";
import { useRouter } from "@/i18n/navigation";
import Input from "../form/input";
import SectionLabel from "../form/section-label";
import SingleImageUploader from "../form/single-image-uploader";

export default function AddOns() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isDirty },
  } = useForm<AddOnsFormData>({
    resolver: zodResolver(addOnsSchema),
    defaultValues: {
      addOns: [
        {
          name: "Helium Balloon",
          price: 25,
          stock: 40,
          active: true,
        },
        {
          name: "Teddy Bear Small",
          price: 49,
          stock: 23,
          active: true,
        },
        {
          name: "Scented Candle",
          price: 55,
          stock: 12,
          active: true,
        },
        {
          name: "Chocolate Box",
          price: 35,
          stock: 18,
          active: true,
        },
      ],
      price: 5,
      floral: "",
      handwritten: "",
      minimal: "",
    },
  });

  const addOns = useWatch({
    control,
    name: "addOns",
  });

  const onSubmit: SubmitHandler<AddOnsFormData> = (data) => {
    console.log(data);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <Card className="p-0">
        <CardContent className="flex flex-col p-0">
          <div className="p-4 flex items-center justify-between w-full">
            <p className="text-sm font-semibold text-foreground ">Add-ons</p>
            <Button
              variant="outline"
              className="text-xs"
              onClick={() => router.push("/products")}
            >
              <ExternalLink />
              Manage in Products
            </Button>
          </div>

          <Separator />
          <ReorderableDataTable
            data={addOns}
            getRowId={(row) => row.name}
            onReorder={(newAddOns) => {
              setValue("addOns", newAddOns);
            }}
            countUnit="add-ons"
            className="border-0"
            columns={addOnsColumns}
            renderCells={(addOn, index) => (
              <>
                <TableCell className="px-4 py-3 flex items-center gap-2">
                  <div className="w-8 h-8 grid place-content-center rounded-md bg-primary/10">
                    ?
                  </div>
                  {addOn.name}
                </TableCell>
                <TableCell className="px-4 py-3">{addOn.price}</TableCell>
                <TableCell className="px-4 py-3">{addOn.stock}</TableCell>
                <TableCell className="px-4 py-3">
                  <Switch
                    name={`addOns.${index}.active`}
                    control={control}
                    label=""
                    description=""
                  />
                </TableCell>
              </>
            )}
          />
        </CardContent>
      </Card>

      <Card className="p-0">
        <CardContent className="p-0">
          <div className="p-4 flex items-center gap-4">
            <div className="w-8 h-8 grid place-content-center rounded-md bg-primary/10">
              <MessageCircle className="size-4 text-primary" />
            </div>
            <p className="font-bold">Message Card</p>
            <p className="text-xs text-muted-foreground">(Special Row)</p>
          </div>
          <Separator />

          <div className="p-4 space-y-6">
            <Input
              name="price"
              register={register}
              errors={errors}
              required
              className="w-40"
              prefix="AED"
              label="Card Price (AED)"
            />

            <SectionLabel>Card Style Template</SectionLabel>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SingleImageUploader
                control={control}
                name="floral"
                label="Floral"
              />

              <SingleImageUploader
                control={control}
                name="minimal"
                label="Minimal"
              />

              <SingleImageUploader
                control={control}
                name="handwritten"
                label="Handwritten"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {isDirty && (
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            className="text-sm border border-border h-10 w-30 text-muted-foreground"
            onClick={() => reset()}
          >
            Discard
          </Button>

          <Button type="submit" className="text-sm text-foreground h-10 w-40">
            <Save />
            Save Changes
          </Button>
        </div>
      )}
    </form>
  );
}
