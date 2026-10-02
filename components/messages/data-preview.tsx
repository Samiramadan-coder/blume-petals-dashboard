"use client";

import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { CircleCheck } from "lucide-react";
import { Message } from "@/types/messages";
import { Pagination } from "@/types/shared";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "../ui/card";
import DeleteBtn from "../reusable/delete-btn";
import ModuleHeader from "../reusable/module-header";
import PaginationTemplate from "../reusable/pagination-temlate";
import { deleteMessage, markMessageAsRead } from "@/lib/messages";
import { usePermissions } from "@/providers/permission-providers";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export default function DataPreview({
  messages,
  pagination,
}: {
  messages: Message[];
  pagination: Pagination;
}) {
  const { can } = usePermissions();
  const t = useTranslations("Messages");
  const tCommon = useTranslations("Common");
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [markingAsReadId, setMarkingAsReadId] = useState<number | null>(null);

  return (
    <>
      <ModuleHeader title={t("Title")} description={t("Description")} />

      <div className="space-y-4">
        {messages.length === 0 && (
          <p className="rounded-lg border border-primary/30 bg-white px-4 py-10 text-center text-sm text-muted-foreground">
            {t("Empty")}
          </p>
        )}

        {messages.map((message) => (
          <Card
            key={message.id}
            className={cn("border border-primary/30", {
              "bg-primary/10": !message.read,
            })}
            style={{ boxShadow: "none" }}
          >
            <CardContent className="space-y-2">
              <p className="text-sm font-semibold break-all">{message.email}</p>
              <p className="text-sm">{message.phone}</p>
              <p className="text-sm text-muted-foreground whitespace-pre-line wrap-break-word">
                {message.message}
              </p>
              <div className="flex justify-end">
                {!message.read && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label={t("MarkAsRead")}
                        disabled={markingAsReadId !== null}
                        onClick={async () => {
                          setMarkingAsReadId(message.id);
                          const result = await markMessageAsRead(message.id);
                          setMarkingAsReadId(null);

                          if (!result.success) {
                            toast.error(
                              result.message ?? tCommon("UpdateFailed"),
                            );
                          }
                        }}
                      >
                        {markingAsReadId === message.id ? (
                          <Spinner />
                        ) : (
                          <CircleCheck className="text-green-500" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t("MarkAsRead")}</p>
                    </TooltipContent>
                  </Tooltip>
                )}

                {can("contact.delete") && (
                  <DeleteBtn
                    itemName={message.email}
                    loading={loadingDelete}
                    onDelete={async () => {
                      setLoadingDelete(true);
                      const result = await deleteMessage(message.id);
                      setLoadingDelete(false);

                      if (result.success) {
                        toast.success(result.message);
                        return;
                      }

                      toast.error(result.message ?? tCommon("DeleteFailed"));
                    }}
                  />
                )}
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
