"use client";

import { http } from "@/lib/http";
import NotificationsClient from "./notification-client";

async function saveToken(token: string): Promise<void> {
  await http.post("/api/v1/device-tokens", {
    token,
    platform: "web",
  });
}

export default function NotificationsSetup() {
  return <NotificationsClient saveToken={saveToken} />;
}
