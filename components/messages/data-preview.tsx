"use client";

import { toast } from "sonner";
import { useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import {
  CheckCheck,
  CircleCheck,
  Clock,
  MailOpen,
  MailX,
  Phone,
} from "lucide-react";
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
        "group relative w-full p-3 ps-4 flex items-center gap-3 border-b border-primary/20 cursor-pointer transition-colors duration-200 last:border-b-0 hover:bg-primary/5",
        { "bg-primary/10 hover:bg-primary/10": isSelected },
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute inset-y-0 inset-s-0 w-1 bg-primary transition-opacity duration-200",
          isSelected ? "opacity-100" : "opacity-0",
        )}
      />

      <Avatar
        size="lg"
        className="transition-transform duration-200 group-hover:scale-105"
      >
        <AvatarFallback
          className={cn(
            message.read
              ? "bg-primary/10 text-primary"
              : "bg-primary text-white",
          )}
        >
          {getInitial(message.email)}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col gap-1 text-start min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span
            className={cn(
              "text-xs truncate",
              message.read ? "font-medium" : "font-bold",
            )}
          >
            {message.email}
          </span>

          {!message.read && (
            <span className="relative flex size-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
          )}
        </div>
        <p
          className={cn(
            "text-xs truncate",
            message.read
              ? "text-muted-foreground"
              : "text-foreground font-medium",
          )}
        >
          {message.message}
        </p>
        <span className="text-[10px] font-medium text-muted-foreground">
          {formatDate(message.created_at)}
        </span>
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

      {items.length === 0 ? (
        <div className="mb-6 flex flex-col items-center gap-3 rounded-xl border border-dashed border-primary/30 bg-white px-4 py-12 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MailX className="size-6" />
          </div>
          <p className="text-sm text-muted-foreground">{t("Empty")}</p>
        </div>
      ) : (
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 bg-white rounded-xl overflow-hidden border border-primary/20">
          <div className="border-b sm:border-b-0 sm:border-e border-primary/20">
            {items.map((message) => (
              <MessageItem
                key={message.id}
                message={message}
                isSelected={selectedId === message.id}
                onSelect={setSelectedId}
              />
            ))}
          </div>

          <div className="sm:col-span-2 md:col-span-3 p-4 sm:p-6 min-h-72">
            {selectedMessage ? (
              <div className="flex flex-col gap-4 h-full">
                <div className="w-full pb-4 flex items-start gap-3 border-b border-dashed border-primary/20">
                  <Avatar size="lg">
                    <AvatarFallback className="bg-primary text-white">
                      {getInitial(selectedMessage.email)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex flex-col gap-1.5 text-start min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold break-all">
                        {selectedMessage.email}
                      </h3>

                      {!selectedMessage.read ? (
                        <span className="ms-auto flex items-center gap-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                          <span className="relative flex size-1.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                            <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
                          </span>
                          {t("New")}
                        </span>
                      ) : (
                        <span className="ms-auto flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                          <CheckCheck className="size-3.5 shrink-0 text-green-500" />
                          {t("ReadAt")}{" "}
                          {formatDate(selectedMessage.read_at || "")}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-muted-foreground">
                      {selectedMessage.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="size-3 shrink-0" />
                          <span dir="ltr">{selectedMessage.phone}</span>
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="size-3 shrink-0" />
                        {formatDate(selectedMessage.created_at)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-background p-4 rounded-xl rounded-ss-none">
                  <p className="text-sm text-muted-foreground whitespace-pre-line wrap-break-word leading-relaxed">
                    {selectedMessage.message}
                  </p>
                </div>

                <div className="mt-auto flex items-center justify-end gap-1 border-t border-dashed border-primary/20 pt-3">
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
              <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <MailOpen className="size-6" />
                </div>
                <p className="text-sm text-muted-foreground">
                  {t("SelectMessage")}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <PaginationTemplate
        currentPage={pagination.current_page}
        totalPages={pagination.last_page}
      />
    </>
  );
}
