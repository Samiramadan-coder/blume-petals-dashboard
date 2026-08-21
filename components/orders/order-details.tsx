"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { Separator } from "../ui/separator";
import { cn, formatDate } from "@/lib/utils";
import SectionLabel from "../form/section-label";
import NormalFormTextarea from "../form/textarea";
import LocationPicker from "../form/location-picker";
import ChangeOrderStatus from "./change-order-status";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { updateAdminNote } from "@/lib/orders-actions";
import { SubmitHandler, useForm } from "react-hook-form";
import { Eye, Mail, MapPin, Phone, X } from "lucide-react";
import { AdminNote, AdminNoteSchema, Order } from "@/types/orders";

export default function OrderDetails({ order }: { order: Order }) {
  const locale = useLocale();
  const t = useTranslations("Orders");
  const tCommon = useTranslations("Common");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminNote>({
    defaultValues: { admin_notes: order.admin_notes || "" },
    resolver: zodResolver(AdminNoteSchema(t)),
  });

  const onSubmit: SubmitHandler<AdminNote> = async (data) => {
    const result = await updateAdminNote(order.id, data.admin_notes);

    if (result.success) {
      toast.success(t("AdminNoteUpdatedSuccessfully"));
      return;
    }

    toast.error(t("AdminNoteUpdateFailed"));
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="text-muted-foreground">
          <Eye />
        </Button>
      </SheetTrigger>

      <SheetContent
        showCloseButton={false}
        className="flex h-full flex-col sm:max-w-2xl"
        side={locale === "ar" ? "left" : "right"}
        onInteractOutside={(event) => event.preventDefault()}
      >
        <SheetHeader className="pt-2 pb-2">
          <SheetTitle className="flex items-center justify-between border-b border-border px-4 py-3 -mx-4">
            <div>
              <div className="flex items-center gap-2">
                <p
                  className={cn(
                    "text-lg font-semibold",
                    locale === "en" && "font-heading",
                  )}
                >
                  #{order.order_number}
                </p>
                <ChangeOrderStatus order={order} />
              </div>

              <p className="text-muted-foreground text-xs mt-1.5">
                {formatDate(order.placed_at)}
              </p>
            </div>
            <SheetClose asChild>
              <Button variant="ghost" className="h-9 w-9 p-0">
                <X className="size-5 text-muted-foreground" />
              </Button>
            </SheetClose>
          </SheetTitle>
        </SheetHeader>

        <div className="px-6 pb-6 space-y-4 flex-1 overflow-auto">
          <SectionLabel>Customer</SectionLabel>
          <div className="flex gap-2">
            <div className="w-12 h-12 flex items-center justify-center bg-primary rounded-full font-bold uppercase">
              {order.customer.name.slice(0, 2)}
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm">{order.customer.name}</p>
              {order.customer.phone && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Phone className="size-3" />
                  {order.customer.phone}
                </p>
              )}
              {order.customer.email && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Mail className="size-3" />
                  {order.customer.email}
                </p>
              )}
            </div>
          </div>

          <Separator />
          <SectionLabel>Items ({order.items.length})</SectionLabel>
          <div className="flex flex-col gap-2">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="px-3 py-2 rounded-lg border border-border flex items-center justify-between gap-2"
              >
                <div className="flex gap-4">
                  <div className="rounded-full overflow-hidden">
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        width={50}
                        height={50}
                      />
                    ) : (
                      <div className="min-w-11 min-h-11 flex items-center justify-center bg-primary rounded-full font-bold uppercase">
                        {item.name.slice(0, 2)}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Quantity: {item.qty}
                    </p>
                  </div>
                </div>

                <p className="text-sm font-bold">
                  {item.unit_price} {tCommon("AED")}
                </p>
              </div>
            ))}
          </div>
          {order.address && (
            <>
              <Separator />
              <SectionLabel>Fulfillment</SectionLabel>
              <div className="rounded-lg border border-border">
                <div className="border-b border-border p-3 flex items-start gap-3">
                  <div className="p-2 bg-secondary/20 rounded-md">
                    <MapPin className="size-4 text-secondary" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-semibold">Home Delivery</p>
                    <p className="text-xs text-muted-foreground">
                      {order.address.building}, {order.address.street}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.address.city}, {order.address.country}
                    </p>
                    {order.customer_notes && <p>{order.customer_notes}</p>}
                  </div>
                </div>
                <div>
                  <LocationPicker
                    value={{
                      latitude: +order.address.latitude,
                      longitude: +order.address.longitude,
                    }}
                    onChange={() => {}}
                  />
                </div>
              </div>
            </>
          )}

          <Separator />
          <SectionLabel>Payment</SectionLabel>
          <div className="border border-border rounded-lg">
            <div className="text-xs text-muted-foreground flex items-center justify-between px-3 py-2 border-b border-border">
              <span>Subtotal</span>
              <span>
                {order.summary.subtotal} {tCommon("AED")}
              </span>
            </div>
            <div className="text-xs text-muted-foreground flex items-center justify-between px-3 py-2 border-b border-border">
              <span>Delivery</span>
              <span>
                {order.summary.shipping_total} {tCommon("AED")}
              </span>
            </div>
            <div className="text-xs text-muted-foreground flex items-center justify-between px-3 py-2 border-b border-border">
              <span>Discount</span>
              <span>
                {order.summary.discount_total} {tCommon("AED")}
              </span>
            </div>
            <div className="flex items-center justify-between px-3 py-2">
              <span className="font-bold">Total</span>
              <span>
                {+order.summary.subtotal +
                  +order.summary.shipping_total -
                  +order.summary.discount_total}{" "}
                {tCommon("AED")}
              </span>
            </div>
          </div>

          <Separator />
          <SectionLabel>Update Order Status</SectionLabel>
          <ChangeOrderStatus order={order} view="button" />

          <Separator />
          <SectionLabel>Internal Notes</SectionLabel>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <NormalFormTextarea
              name="admin_notes"
              register={register}
              required
              errors={errors}
            />

            <Button
              type="submit"
              className="w-full h-10 bg-white"
              variant="outline"
            >
              {isSubmitting ? <Spinner /> : t("AdminNote")}
            </Button>
          </form>
        </div>

        <SheetFooter className="mt-4 border-t border-border bg-white px-4 py-3">
          <div className="flex items-center justify-end gap-2">
            <SheetClose asChild>
              <Button type="button" variant="outline" className="h-10 flex-1">
                Download PDF
              </Button>
            </SheetClose>
            <Button type="submit" className="h-10 flex-1">
              Print Invoice
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
