import { Locale } from "@/types/shared";
import { Button } from "../ui/button";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LocaleFormSwitcher({
  locale,
  onChange,
}: {
  locale: Locale;
  onChange: (locale: Locale) => void;
}) {
  return (
    <div className="px-4 grid grid-cols-2 gap-2">
      <Button
        variant="outline"
        onClick={() => onChange("en")}
        className={cn(
          "h-10 cursor-pointer hover:bg-primary hover:text-primary-foreground",
          locale === "en" ? "bg-primary text-primary-foreground" : "",
        )}
      >
        <Globe className="mr-2 h-4 w-4" />
        English
      </Button>
      <Button
        variant="outline"
        onClick={() => onChange("ar")}
        className={cn(
          "h-10 cursor-pointer hover:bg-primary hover:text-primary-foreground",
          locale === "ar" ? "bg-primary text-primary-foreground" : "",
        )}
      >
        <Globe className="mr-2 h-4 w-4" />
        Arabic
      </Button>
    </div>
  );
}
