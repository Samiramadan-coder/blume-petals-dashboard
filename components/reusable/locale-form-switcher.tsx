import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";
import { Button } from "../ui/button";
import { Locale } from "@/types/shared";
import { useLocale, useTranslations } from "next-intl";

export default function LocaleFormSwitcher({
  locale,
  onChange,
  className,
}: {
  locale: Locale;
  onChange: (locale: Locale) => void;
  className?: string;
}) {
  const t = useTranslations("Common");
  const versionLocale = useLocale();

  return (
    <div className={cn("px-4 space-x-2 flex justify-end", className)}>
      <Button
        variant="outline"
        type="button"
        onClick={() => onChange("en")}
        className={cn(
          "h-10 hover:bg-secondary hover:text-primary-foreground order-2",
          locale === "en" ? "bg-secondary text-primary-foreground" : "",
          versionLocale === "ar" ? "order-2" : "order-1",
        )}
      >
        <Globe className="size-4" />
        {t("English")}
      </Button>

      <Button
        variant="outline"
        type="button"
        onClick={() => onChange("ar")}
        className={cn(
          "h-10 hover:bg-secondary hover:text-primary-foreground order-1",
          locale === "ar" ? "bg-secondary text-primary-foreground" : "",
          versionLocale === "en" ? "order-2" : "order-1",
        )}
      >
        <Globe className="size-4" />
        {t("Arabic")}
      </Button>
    </div>
  );
}
