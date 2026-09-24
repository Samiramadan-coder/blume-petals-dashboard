"use client";

import { Bell } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { getFcmToken } from "@/lib/get-fcm-token";
import { useEffect, useRef, useState } from "react";
import { getFirebaseMessaging } from "@/lib/firebase";
import { onMessage } from "firebase/messaging";
import { formatDate } from "@/lib/utils";

type Props = {
  saveToken: (token: string) => Promise<void>;
};

type NotificationItem = {
  id: string;
  title: string;
  body: string;
  url: string | null;
  createdAt: Date;
};

function getInternalUrl(value?: string): string | null {
  if (!value) return null;

  try {
    const url = new URL(value, window.location.origin);

    if (url.origin !== window.location.origin) {
      return null;
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return null;
  }
}

export default function NotificationsClient({ saveToken }: Props) {
  const t = useTranslations("layout.header");
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    let disposed = false;

    async function syncToken() {
      console.log("FCM effect started");

      if (!("Notification" in window)) {
        console.log("Notification API not supported");
        return;
      }

      console.log("Notification permission:", Notification.permission);

      if (Notification.permission !== "granted") {
        console.log("FCM stopped because permission is not granted");
        return;
      }

      try {
        console.log("Getting FCM token...");

        const token = await getFcmToken();

        console.log("getFcmToken result:", token);

        if (!token) {
          console.log("No FCM token returned");
          return;
        }

        if (disposed) {
          console.log("Component already disposed");
          return;
        }

        console.log("FCM token available:", token);

        console.log("Sending token to backend...");

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
            id: crypto.randomUUID(),
            title:
              payload.notification?.title ||
              payload.data?.title ||
              "إشعار جديد",
            body: payload.notification?.body || payload.data?.body || "",
            url: getInternalUrl(payload.data?.url || payload.fcmOptions?.link),
            createdAt: new Date(),
          };

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

        {notifications.length > 0 && (
          <span className="absolute -inset-e-1 -top-1 flex size-4.5 text-white items-center justify-center rounded-full bg-primary text-[10px] font-medium text-destructive-foreground">
            {notifications.length > 99 ? "99+" : notifications.length}
          </span>
        )}

        <span className="sr-only">{t("Notifications")}</span>
      </Button>

      {open && (
        <div className="absolute inset-e-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-xl border bg-background shadow-lg">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="flex items-center gap-2">
              <Bell className="size-4" />
              <p className="text-sm font-semibold">{t("Notifications")}</p>
              {notifications.length > 0 && (
                <span className="text-xs text-muted-foreground">
                  {notifications.length}
                </span>
              )}
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
            <div className="max-h-96 overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="group relative border-b p-4 last:border-b-0 hover:bg-muted/50"
                >
                  <div className="pe-6">
                    <p className="text-sm font-medium">{notification.title}</p>

                    {notification.body && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {notification.body}
                      </p>
                    )}

                    <p className="mt-2 text-xs text-muted-foreground">
                      {formatDate(notification.createdAt)}
                    </p>

                    {notification.url && (
                      <a
                        href={notification.url}
                        onClick={() => setOpen(false)}
                        className="mt-2 inline-block text-xs font-medium text-primary"
                      >
                        {t("ShowDetails")}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
