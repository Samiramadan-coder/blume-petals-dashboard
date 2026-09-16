"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { Eye, Heart, Mail, MapPin, Palette, Phone, Star } from "lucide-react";
import { User } from "@/types/customers";
import { cn, formatDate } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Item, ItemContent, ItemMedia, ItemTitle } from "../ui/item";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";
import ChangeOrderStatus from "../orders/change-order-status";

export default function CustomerDetails({ customer }: { customer: User }) {
  const locale = useLocale();
  const t = useTranslations("Customers.Details");
  const tCommon = useTranslations("Common");

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Eye />
        </Button>
      </SheetTrigger>

      <SheetContent
        className="flex h-full flex-col sm:max-w-2xl"
        side={locale === "ar" ? "left" : "right"}
      >
        <SheetHeader className="space-y-4 border-b border-primary/20 px-6 pb-4 pt-4">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <div className="flex size-12 items-center justify-center rounded-full bg-[#d4bd7c] text-sm font-bold text-white">
                {customer.name.slice(0, 1)}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full bg-[#8c7839] text-white ring-2 ring-background">
                <Star className="size-2.5 fill-current" />
              </div>
            </div>
            <div className="min-w-0">
              <SheetTitle className="truncate text-lg font-semibold">
                {customer.name}
              </SheetTitle>
            </div>
          </div>

          <div className="grid grid-cols-3 rounded-xl border border-primary/20 bg-primary/10 px-4 py-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                {t("LifetimeValue")}
              </p>
              <p className="mt-2 text-xl font-semibold leading-none text-primary">
                {tCommon("AED")} {customer.total_spent}
              </p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                {t("TotalOrders")}
              </p>
              <p className="mt-2 text-xl font-semibold leading-none text-foreground">
                {customer.orders_count}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                {t("Joined")}
              </p>
              <p className="mt-2 text-sm font-medium leading-none text-foreground">
                {formatDate(customer.created_at)}
              </p>
            </div>
          </div>
        </SheetHeader>

        <div className={cn(`flex-1 overflow-auto px-4 pb-6 pt-2`)}>
          <Accordion
            type="single"
            collapsible
            defaultValue="contact"
            className="max-w-lg"
          >
            <AccordionItem value="contact">
              <AccordionTrigger className="uppercase text-muted-foreground tracking-widest font-bold text-[10px]">
                {t("Contact")}
              </AccordionTrigger>
              <AccordionContent className="gap-1">
                {customer.phone && (
                  <Item variant="default" size="sm">
                    <ItemMedia className="bg-secondary/20 p-1.5 rounded text-secondary">
                      <Phone className="size-4" />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle className="text-muted-foreground">
                        {customer.phone}
                      </ItemTitle>
                    </ItemContent>
                  </Item>
                )}
                {customer.email && (
                  <Item variant="default" size="sm">
                    <ItemMedia className="bg-primary/20 p-1.5 rounded text-primary">
                      <Mail className="size-4" />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle className="text-muted-foreground">
                        {customer.email}
                      </ItemTitle>
                    </ItemContent>
                  </Item>
                )}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="addresses">
              <AccordionTrigger className="uppercase text-muted-foreground tracking-widest font-bold text-[10px]">
                {t("Addresses")} ({customer.addresses_count})
              </AccordionTrigger>
              <AccordionContent className="space-y-4 p-2">
                {customer.addresses.length ? (
                  customer.addresses.map((address) => (
                    <Card
                      key={address.id}
                      className="flex-row items-start gap-3 ring-0! rounded-2xl border border-primary/30 p-3 shadow-none"
                    >
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary/20">
                        <MapPin className="size-4 text-secondary" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-foreground mb-0!">
                            {address.label}
                          </p>
                          {address.is_default && (
                            <Badge
                              variant="secondary"
                              className="h-5 rounded-md bg-secondary/20 px-1.5 text-[10px] font-medium text-secondary hover:bg-secondary/20"
                            >
                              {t("Default")}
                            </Badge>
                          )}
                        </div>
                        <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                          {address.apartment} {address.street}
                          <br />
                          {address.city.name}, {address.country.name}
                        </p>
                      </div>
                    </Card>
                  ))
                ) : (
                  <p className="text-xs text-primary/80">{t("NoAddresses")}</p>
                )}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="order-history">
              <AccordionTrigger className="uppercase text-muted-foreground tracking-widest font-bold text-[10px]">
                {t("OrderHistory")} ({customer.orders_count})
              </AccordionTrigger>
              <AccordionContent>
                {customer.orders.length > 0 ? (
                  <div className="overflow-hidden rounded-2xl ring-0! border border-primary/30 bg-white px-4">
                    <Table>
                      <TableBody>
                        {customer.orders.map((order) => (
                          <TableRow
                            key={order.id}
                            className="border-none hover:bg-transparent"
                          >
                            <TableCell className="text-xs px-0 py-2 font-semibold">
                              {order.order_number}
                            </TableCell>

                            <TableCell className="text-xs py-2 text-muted-foreground">
                              {formatDate(order.placed_at)}
                            </TableCell>

                            <TableCell className="py-2">
                              <ChangeOrderStatus order={order} />
                            </TableCell>

                            <TableCell className="text-xs px-0 py-2 text-end font-semibold">
                              {order.currency} {order.grand_total}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-xs text-primary/80">{t("NoOrders")}</p>
                )}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="saved-designs">
              <AccordionTrigger className="uppercase text-muted-foreground tracking-widest font-bold text-[10px]">
                {t("SavedDesigns")}
              </AccordionTrigger>

              <AccordionContent className="p-2">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Card className="flex-row items-center gap-3 rounded-2xl p-3 shadow-none ring-0! border border-primary/30">
                      <div className="flex size-9 items-center justify-center rounded-xl bg-amber-50">
                        <Palette className="size-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-xl font-semibold leading-none mb-1!">
                          {customer.designs_count}
                        </p>
                        <p className="mt-1 text-[10px] uppercase text-muted-foreground">
                          {t("SavedDesign")}
                        </p>
                      </div>
                    </Card>

                    <Card className="flex-row items-center gap-3 rounded-2xl p-3 shadow-none ring-0! border border-primary/30">
                      <div className="flex size-9 items-center justify-center rounded-xl bg-red-50">
                        <Heart className="size-4 text-red-500" />
                      </div>
                      <div>
                        <p className="text-xl font-semibold leading-none mb-1!">
                          {customer.wishlist_count}
                        </p>
                        <p className="mt-1 text-[10px] uppercase text-muted-foreground">
                          {t("Wishlist")}
                        </p>
                      </div>
                    </Card>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">
                      {t("SavedDesign")}
                    </p>

                    {customer.designs.length > 0 ? (
                      customer.designs.map((design) => (
                        <Card
                          key={design.id}
                          className="flex-row items-center gap-3 rounded-xl p-2.5 shadow-none"
                        >
                          <div className="size-9 shrink-0 rounded-xl bg-rose-300" />
                          <div className="min-w-0">
                            <p className="truncate text-[11px] font-bold mb-1!">
                              {design.bouquet.name}
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              {formatDate(design.created_at)}
                            </p>
                          </div>
                        </Card>
                      ))
                    ) : (
                      <p className="text-xs text-primary/80">
                        {t("NoSavedDesigns")}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">
                      {t("Wishlist")}
                    </p>

                    {customer.wishlist.length > 0 ? (
                      customer.wishlist.map((item) => (
                        <Card
                          key={item.id}
                          className="flex-row items-center gap-3 rounded-xl p-2.5 shadow-none"
                        >
                          <div className="size-9 shrink-0 rounded-xl bg-pink-300" />
                          <div className="min-w-0">
                            <p className="truncate text-[11px] font-bold mb-1!">
                              {item.name}
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              {tCommon("AED")} {item.price_from}
                            </p>
                          </div>
                        </Card>
                      ))
                    ) : (
                      <p className="text-xs text-primary/80">
                        {t("NoWishlistItems")}
                      </p>
                    )}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </SheetContent>
    </Sheet>
  );
}
