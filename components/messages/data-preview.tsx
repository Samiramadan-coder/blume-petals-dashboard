"use client";

import { toast } from "sonner";
import { useMemo, useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { CircleCheck } from "lucide-react";
import { Message } from "@/types/messages";
import { Pagination } from "@/types/shared";
import { useTranslations } from "next-intl";
import { cn, formatDate } from "@/lib/utils";
import DeleteBtn from "../reusable/delete-btn";
import ModuleHeader from "../reusable/module-header";
import { Avatar, AvatarFallback } from "../ui/avatar";
import PaginationTemplate from "../reusable/pagination-temlate";
import { deleteMessage, markMessageAsRead } from "@/lib/messages";
import { usePermissions } from "@/providers/permission-providers";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

function getInitial(email: string) {
  return email.charAt(0).toUpperCase();
}

function MessageItem({
  message,
  isSelected,
  onSelect,
}: {
  message: Message;
  isSelected: boolean;
  onSelect: (id: number) => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={() => onSelect(message.id)}
      className={cn(
        "w-full p-3 flex items-center gap-4 border-b border-primary/20 cursor-pointer last:border-b-0",
        {
          "bg-primary/10 border-s-4 border-s-primary": isSelected,
        },
      )}
    >
      <Avatar size="lg">
        <AvatarFallback className="bg-primary text-white">
          {getInitial(message.email)}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col gap-1 text-start min-w-0 flex-1">
        <div className="text-xs font-bold break-all flex items-center justify-between gap-2 flex-wrap">
          <span>{message.email}</span>

          <p className="flex items-center gap-2 ms-auto">
            <span className="text-[10px] text-secondary font-medium">
              {formatDate(message.created_at)}
            </span>
            {!message.read && (
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>
            )}
          </p>
        </div>
        <p className="text-xs">{message.phone}</p>
        <p className="text-xs truncate text-muted-foreground">
          {message.message}
        </p>
      </div>
    </button>
  );
}

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
  const [selectedId, setSelectedId] = useState<number | null>(null);
  // Read state applied locally until the server data is refreshed
  const [readAtById, setReadAtById] = useState<Record<number, string>>({});

  const items = useMemo(
    () =>
      messages.map((message) =>
        readAtById[message.id]
          ? { ...message, read: true, read_at: readAtById[message.id] }
          : message,
      ),
    [messages, readAtById],
  );

  // Derived from props so a deleted/removed message clears the selection
  const selectedMessage = items.find((m) => m.id === selectedId) ?? null;

  const handleMarkAsRead = async (message: Message) => {
    setMarkingAsReadId(message.id);

    try {
      const result = await markMessageAsRead(message.id);

      if (!result.success) {
        toast.error(result.message ?? tCommon("UpdateFailed"));
        return;
      }

      setReadAtById((prev) => ({
        ...prev,
        [message.id]: new Date().toISOString(),
      }));
    } catch {
      toast.error(tCommon("UpdateFailed"));
    } finally {
      setMarkingAsReadId(null);
    }
  };

  const handleDelete = async (message: Message) => {
    setLoadingDelete(true);

    try {
      const result = await deleteMessage(message.id);

      if (result.success) {
        setSelectedId(null);
        toast.success(result.message);
        return;
      }

      toast.error(result.message ?? tCommon("DeleteFailed"));
    } catch {
      toast.error(tCommon("DeleteFailed"));
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <>
      <ModuleHeader title={t("Title")} description={t("Description")} />

      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4 bg-white rounded-xl overflow-hidden border border-primary/20">
        <div className="border-e border-primary/20">
          {items.map((message) => (
            <MessageItem
              key={message.id}
              message={message}
              isSelected={selectedId === message.id}
              onSelect={setSelectedId}
            />
          ))}
        </div>

        <div className="sm:col-span-2 md:col-span-3 p-4">
          {selectedMessage ? (
            <div className="flex flex-col gap-4 h-full">
              <div className="w-full pb-4 flex items-center gap-2 border-b border-primary/20">
                <Avatar size="lg">
                  <AvatarFallback className="bg-primary text-white">
                    {getInitial(selectedMessage.email)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex flex-col gap-1 text-start min-w-0 flex-1">
                  <p className="text-xs font-bold break-all flex items-center justify-between gap-2 flex-wrap">
                    <span>{selectedMessage.email}</span>
                    <span className="ms-auto font-medium">
                      {!selectedMessage.read ? (
                        <Badge>{t("New")}</Badge>
                      ) : (
                        `${t("ReadAt")} ${formatDate(selectedMessage.read_at || "")}`
                      )}
                    </span>
                  </p>
                </div>
              </div>

              <div className="bg-background p-3 rounded-xl">
                <p className="text-sm text-muted-foreground whitespace-pre-line wrap-break-word leading-relaxed">
                  {selectedMessage.message}
                </p>
              </div>

              <div className="mt-auto">
                {!selectedMessage.read && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label={t("MarkAsRead")}
                        disabled={markingAsReadId !== null}
                        onClick={() => handleMarkAsRead(selectedMessage)}
                      >
                        {markingAsReadId === selectedMessage.id ? (
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
                    itemName={selectedMessage.email}
                    loading={loadingDelete}
                    onDelete={() => handleDelete(selectedMessage)}
                  />
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              {t("SelectMessage")}
            </p>
          )}
        </div>
      </div>

      <PaginationTemplate
        currentPage={pagination.current_page}
        totalPages={pagination.last_page}
      />
    </>
  );
}
