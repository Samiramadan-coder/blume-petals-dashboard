"use client";

import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "../ui/button";
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

  return (
    <>
      <ModuleHeader title={t("Title")} description={t("Description")} />

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

                {can("contact.delete") && (
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
