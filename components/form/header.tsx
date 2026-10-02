import { X } from "lucide-react";
import { Button } from "../ui/button";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import {
  SheetClose,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";

export default function FormHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  const locale = useLocale();
  const t = useTranslations("Common");

  return (
    <SheetHeader className="pt-2 pb-2">
      <div className="flex items-center justify-between border-b border-border px-4 py-3 -mx-4">
        <div>
          <SheetTitle
            className={cn(`text-xl font-semibold text-foreground`, {
              "font-cairo": locale === "ar",
              "font-heading": locale !== "ar",
            })}
          >
            {title}
          </SheetTitle>
          {description && (
            <SheetDescription className="mt-2 font-medium">
              {description}
            </SheetDescription>
          )}
        </div>
        <SheetClose asChild>
          <Button
            variant="ghost"
            className="h-9 w-9 p-0"
            aria-label={t("Cancel")}
          >
            <X className="size-5 text-muted-foreground" />
          </Button>
        </SheetClose>
      </div>
    </SheetHeader>
  );
}
