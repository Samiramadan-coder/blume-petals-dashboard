"use client";

import { cn, formatDate } from "@/lib/utils";
import { Crown, Eye, Smartphone, Star } from "lucide-react";
import Header from "../form/header";
import { Button } from "../ui/button";
import { useLocale, useTranslations } from "next-intl";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { User } from "@/types/customers";
import { Badge } from "../ui/badge";

export default function CustomerDetails({ customer }: { customer: User }) {
  console.log(customer);
  const locale = useLocale();
  const t = useTranslations("Notifications");

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
        <SheetHeader className="space-y-4 border-b px-6 pb-4 pt-4">
          {/* Customer */}
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

              {/* <SheetDescription className="sr-only">
                Customer information for Sara Al Khalidi
              </SheetDescription> */}

              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                {/* <Badge
                  variant="secondary"
                  className="h-5 rounded-sm bg-[#f5ecd6] px-1.5 text-[10px] font-semibold text-[#9b7a2f]"
                >
                  <Crown className="mr-1 size-2.5" />
                  VIP
                </Badge> */}

                {/* <Badge
                  variant="secondary"
                  className="h-5 rounded-sm bg-[#f5f0df] px-1.5 text-[10px] font-semibold text-[#796d43]"
                >
                  RETURNING
                </Badge> */}

                {/* <span className="ml-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <Smartphone className="size-3" />
                  Mobile App
                </span> */}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 rounded-2xl border border-[#e6ddc7] bg-[#faf9f5] px-4 py-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Lifetime Value
              </p>

              <p className="mt-1 text-2xl font-semibold leading-none text-[#b19a4c]">
                AED {customer.total_spent}
              </p>
            </div>

            <div className="text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Total Orders
              </p>

              <p className="mt-1 text-2xl font-semibold leading-none text-foreground">
                {customer.orders_count}
              </p>
            </div>

            <div className="text-right">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Joined
              </p>

              <p className="mt-2 text-sm font-medium leading-none text-foreground">
                {formatDate(customer.created_at)}
              </p>
            </div>
          </div>
        </SheetHeader>

        <div className={cn(`flex-1 overflow-auto px-4 pb-6 pt-2`)}></div>
      </SheetContent>
    </Sheet>
  );
}
