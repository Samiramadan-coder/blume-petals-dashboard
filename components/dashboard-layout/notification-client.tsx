"use client";

import { http } from "@/lib/http";
import { Bell, CircleCheck } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Pagination } from "@/types/shared";
import { cn, formatDate } from "@/lib/utils";
import { onMessage } from "firebase/messaging";
import { Button } from "@/components/ui/button";
import { getFcmToken } from "@/lib/get-fcm-token";
import { useEffect, useRef, useState } from "react";
import { getFirebaseMessaging } from "@/lib/firebase";

type Props = {
  saveToken: (token: string) => Promise<void>;
};

type NotificationItem = {
  id: string;
  title: string;
  body: string;
  created_at: Date;
  order_number: number;
  read: boolean;
};

export default function NotificationsClient({ saveToken }: Props) {
  const router = useRouter();
  const t = useTranslations("layout.header");

  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [countUnread, setCountUnread] = useState(0);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [isHasMore, setIsHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    let disposed = false;

    async function syncToken() {
      console.log("FCM effect started");

      if (!("Notification" in window)) {
        console.log("Notification API not supported");
        return;
      }

      let permission = Notification.permission;

      if (permission === "default") {
        permission = await Notification.requestPermission();
      }

      if (permission !== "granted") {
        return;
      }

      try {
        const token = await getFcmToken();

        if (!token || disposed) return;

        await saveToken(token);

        console.log("FCM token saved successfully");
      } catch (error) {
        console.error("FCM token sync error:", error);
      }
    }

    void syncToken();

    return () => {
      disposed = true;
    };
  }, [saveToken]);

  useEffect(() => {
    let disposed = false;
    let unsubscribe: (() => void) | undefined;

    async function listen() {
      try {
        const messaging = await getFirebaseMessaging();

        if (!messaging || disposed) {
          return;
        }

        unsubscribe = onMessage(messaging, (payload) => {
          const notification: NotificationItem = {
            id: payload.messageId,
            title: payload.notification?.title || "",
            body: payload.notification?.body || "",
            created_at: new Date(),
            order_number: Number(payload.data?.order_number || 0),
            read: false,
          };

          void getCountUnreadNotifications();

          setNotifications((prev) => [notification, ...prev]);
        });
      } catch (error) {
        console.error("FCM listener error:", error);
      }
    }

    void listen();

    return () => {
      disposed = true;
      unsubscribe?.();
    };
  }, []);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  async function fetchNotifications(page = 1, append = false) {
    try {
      const { data } = await http.get<{
        data: {
          items: NotificationItem[];
          pagination: Pagination;
        };
      }>("/api/v1/admin/alerts", {
        params: {
          page,
          per_page: 10,
        },
      });

      if (append) {
        setNotifications((prev) => [...prev, ...data.data.items]);
      } else {
        setNotifications(data.data.items);
      }

      setCurrentPage(data.data.pagination.current_page);
      setIsHasMore(data.data.pagination.has_more);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  }

  async function handleLoadMore() {
    if (!isHasMore || isLoadingMore) {
      return;
    }

    try {
      setIsLoadingMore(true);

      const nextPage = currentPage + 1;

      await fetchNotifications(nextPage, true);
    } finally {
      setIsLoadingMore(false);
    }
  }

  async function getCountUnreadNotifications() {
    try {
      const { data } = await http.get<{
        data: {
          unread_count: number;
        };
      }>("/api/v1/admin/alerts/unread-count");

      setCountUnread(data.data.unread_count);
    } catch (error) {
      console.error("Failed to fetch unread notifications count:", error);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchNotifications(1);
  }, []);

  useEffect(() => {
    void getCountUnreadNotifications();
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setOpen((current) => !current)}
      >
        <Bell className="size-4" />

        {countUnread > 0 && (
          <span className="absolute -inset-e-1 -top-1 flex size-4.5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-white">
            {countUnread > 9 ? "9+" : countUnread}
          </span>
        )}

        <span className="sr-only">{t("Notifications")}</span>
      </Button>

      {open && (
        <div className="absolute inset-e-0 top-full z-50 mt-2 w-85 overflow-hidden rounded-xl border bg-background shadow-lg">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="flex items-center gap-2">
              <Bell className="size-4" />

              <p className="text-sm font-semibold">{t("Notifications")}</p>
            </div>
          </div>

          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
              <Bell className="mb-2 size-6 text-muted-foreground" />

              <p className="text-sm text-muted-foreground">
                {t("NoNotifications")}
              </p>
            </div>
          ) : (
            <div className="flex max-h-[60vh] flex-col">
              <div className="flex-1 overflow-y-auto">
                {notifications.map((notification, index) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "group relative border-b p-4 transition-colors",
                      !notification.read && "bg-primary/5",
                      notification.read && "bg-white",
                    )}
                  >
                    {!notification.read && (
                      <span className="absolute inset-e-3 top-4 size-2 rounded-full bg-primary" />
                    )}

                    <div className="pe-6">
                      <div className="flex items-center gap-2">
                        <p
                          className={cn(
                            "text-sm",
                            notification.read
                              ? "font-medium"
                              : "font-semibold text-foreground",
                          )}
                        >
                          {notification.title}
                        </p>

                        {!notification.read && (
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                            {t("New")}
                          </span>
                        )}
                      </div>

                      {notification.body && (
                        <p
                          className={cn(
                            "mt-1 text-sm",
                            notification.read
                              ? "text-muted-foreground"
                              : "text-foreground/80",
                          )}
                        >
                          {notification.body}
                        </p>
                      )}

                      <p className="mt-2 text-xs text-muted-foreground">
                        {formatDate(notification.created_at)}
                      </p>

                      <div className="flex items-center justify-between">
                        <Button
                          onClick={async () => {
                            router.push(
                              `/orders?query=${notification.order_number}`,
                            );

                            setOpen(false);
                          }}
                          variant="ghost"
                          className="mt-2 inline-block text-xs font-medium text-primary px-0 py-0"
                        >
                          {t("ShowDetails")}
                        </Button>

                        {!notification.read && (
                          <Button
                            onClick={async () => {
                              await http.post(
                                `/api/v1/admin/alerts/${notification.id}/read`,
                              );

                              getCountUnreadNotifications();

                              setNotifications((prev) =>
                                prev.map((n, i) =>
                                  i === index ? { ...n, read: true } : n,
                                ),
                              );
                            }}
                            variant="ghost"
                            className="mt-2 text-xs font-medium text-green-700 px-0 py-0"
                          >
                            <CircleCheck className="size-3" /> {t("MarkAsRead")}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {isHasMore && (
                <div className="shrink-0 border-t bg-background p-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    disabled={isLoadingMore}
                    onClick={handleLoadMore}
                  >
                    {isLoadingMore ? "Loading..." : "Load more"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
