"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  PricingRulesFormData,
  pricingRulesSchema,
} from "@/types/custom-builder";
import { Save } from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Card, CardContent } from "../ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import NormalFormInput from "../form/normal-form-input";
import NormalFormSwitch from "../form/normal-form-switch";
import { useForm, SubmitHandler, useWatch } from "react-hook-form";

export default function PricingRules() {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<PricingRulesFormData>({
    resolver: zodResolver(pricingRulesSchema),
    defaultValues: {
      shippingFee: 30,
      activeAutoFillDiscount: true,
      discountPercentage: 40,
      sizes: [
        {
          size: "S",
          minFlowers: 6,
          maxFlowers: 12,
          defaultHint: "~6-12",
        },
        {
          size: "M",
          minFlowers: 10,
          maxFlowers: 18,
          defaultHint: "~10-18",
        },
        {
          size: "L",
          minFlowers: 15,
          maxFlowers: 26,
          defaultHint: "~15-26",
        },
        {
          size: "XL",
          minFlowers: 20,
          maxFlowers: 36,
          defaultHint: "~20-36",
        },
      ],
    },
  });

  const activeAutoFillDiscount = useWatch({
    control,
    name: "activeAutoFillDiscount",
  });

  const sizes = useWatch({
    control,
    name: "sizes",
  });

  const onSubmit: SubmitHandler<PricingRulesFormData> = (data) => {
    console.log(data);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardContent className="flex flex-col gap-4 items-start">
          <p className="text-sm font-semibold text-foreground ">Shipping</p>
          <div>
            <NormalFormInput
              name="shippingFee"
              label="Custom Build Shipping Fee"
              prefix="AED"
              register={register}
              errors={errors}
              type="number"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Separate from regular product shipping — applies only to builder
            orders
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-4 items-start">
          <div className="flex items-center justify-between gap-4 w-full">
            <div>
              <p className="text-sm font-semibold text-foreground ">
                Auto-fill Discount
              </p>
              <p className="text-xs text-muted-foreground">
                Apply a discount when the customer uses the auto-fill feature in
                the builder
              </p>
            </div>

            <NormalFormSwitch
              label=""
              description=""
              control={control}
              name="activeAutoFillDiscount"
              className="w-auto"
            />
          </div>
          {activeAutoFillDiscount && (
            <div>
              <NormalFormInput
                name="discountPercentage"
                label="Discount Percentage"
                prefix="% off"
                register={register}
                errors={errors}
                type="number"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="p-0">
        <CardContent className="flex flex-col items-start p-0">
          <div className="p-4">
            <p className="text-sm font-semibold text-foreground ">
              Flower Count Limits per Size
            </p>
            <p className="text-xs text-muted-foreground">
              Override the default min/max flower counts allowed per bouquet
              size
            </p>
          </div>

          <Separator />
          <Table>
            <TableHeader className="bg-primary/10">
              <TableRow>
                <TableHead className="px-4">Size</TableHead>
                <TableHead>Min Flowers</TableHead>
                <TableHead>Max Flowers</TableHead>
                <TableHead>Default hint</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sizes.map((size, index) => (
                <TableRow key={index}>
                  <TableCell className="px-6">{size.size}</TableCell>
                  <TableCell>
                    <NormalFormInput
                      name={`sizes.${index}.minFlowers`}
                      register={register}
                      errors={errors}
                      type="number"
                      className="w-20"
                    />
                  </TableCell>
                  <TableCell>
                    <NormalFormInput
                      name={`sizes.${index}.maxFlowers`}
                      register={register}
                      errors={errors}
                      type="number"
                      className="w-20"
                    />
                  </TableCell>
                  <TableCell>
                    <p className="text-xs text-muted-foreground">
                      ~{sizes[index].minFlowers}~{sizes[index].maxFlowers}
                    </p>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {isDirty && (
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            className="text-sm border border-border h-10 w-30 text-muted-foreground cursor-pointer"
            onClick={() => reset()}
          >
            Discard
          </Button>

          <Button
            type="submit"
            className="text-sm text-foreground h-10 w-40 cursor-pointer"
          >
            <Save />
            Save Changes
          </Button>
        </div>
      )}
    </form>
  );
}
