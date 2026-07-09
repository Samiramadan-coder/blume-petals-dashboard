import { X } from "lucide-react";
import { Button } from "../ui/button";
import { SheetClose, SheetHeader, SheetTitle } from "../ui/sheet";

export default function FormHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <SheetHeader className="pt-2 pb-2">
      <SheetTitle className="flex items-center justify-between border-b border-border px-4 py-3 -mx-4">
        <div>
          <p className="font-heading text-lg font-semibold text-foreground">
            {title}
          </p>
          {description && (
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        <SheetClose asChild>
          <Button variant="ghost" className="h-9 w-9 cursor-pointer p-0">
            <X className="size-5 text-muted-foreground" />
          </Button>
        </SheetClose>
      </SheetTitle>
    </SheetHeader>
  );
}
