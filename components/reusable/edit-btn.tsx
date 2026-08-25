"use client";

import { Pencil } from "lucide-react";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useTranslations } from "next-intl";

export default function EditBtn(props: React.ComponentProps<typeof Button>) {
  const t = useTranslations("Common");

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button type="button" variant="ghost" className="px-0" {...props}>
          <Pencil className="text-muted-foreground" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{t("Edit")}</TooltipContent>
    </Tooltip>
  );
}
