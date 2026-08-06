"use client";

import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "../ui/button";
import { CircleCheck } from "lucide-react";
import { Message } from "@/types/messages";
import { Pagination } from "@/types/shared";
import { Card, CardContent } from "../ui/card";
import DeleteBtn from "../reusable/delete-btn";
import { useLocale, useTranslations } from "next-intl";
import PaginationTemplate from "../reusable/pagination-temlate";
import { deleteMessage, markMessageAsRead } from "@/lib/messages";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export default function DataPreview({
  messages,
  pagination,
}: {
  messages: Message[];
  pagination: Pagination;
}) {
  const locale = useLocale();
  const tCommon = useTranslations("Common");
  const t = useTranslations("Messages");
  const [loadingDelete, setLoadingDelete] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between">
        <div>
          <h1
            className={cn("text-2xl font-semibold text-foreground", {
              "font-cairo": locale === "ar",
              "font-heading": locale !== "ar",
            })}
          >
            {t("Title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            {t("Description")}
          </p>
        </div>
      </header>

      <div className="space-y-4">
        {messages.map((message) => (
          <Card
            key={message.id}
            className={cn("border border-primary/30", {
              "bg-primary/10": !message.read,
            })}
            style={{ boxShadow: "none" }}
          >
            <CardContent className="space-y-2">
              <p className="text-sm font-semibold">{message.email}</p>
              <p className="text-sm">{message.phone}</p>
              <p className="text-sm text-muted-foreground">{message.message}</p>
              <div className="flex justify-end">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={async () => {
                        await markMessageAsRead(message.id);
                      }}
                    >
                      <CircleCheck className="text-green-500" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t("MarkAsRead")}</p>
                  </TooltipContent>
                </Tooltip>

                <DeleteBtn
                  loading={loadingDelete}
                  onDelete={async () => {
                    setLoadingDelete(true);
                    const result = await deleteMessage(message.id);
                    setLoadingDelete(false);

                    if (result.success) {
                      toast.success(tCommon("DeletedSuccessfully"));
                      return;
                    }

                    toast.error(tCommon("DeleteFailed"));
                  }}
                />
              </div>
            </CardContent>
          </Card>
        ))}

        <PaginationTemplate
          currentPage={pagination.current_page}
          totalPages={pagination.last_page}
        />
      </div>
    </>
  );
}
