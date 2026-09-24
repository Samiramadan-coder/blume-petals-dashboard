import { getToken } from "firebase/messaging";
import { getFirebaseMessaging } from "@/lib/firebase";

const SERVICE_WORKER_PATH = "/firebase-messaging-sw.js";

async function registerMessagingWorker() {
  const registration = await navigator.serviceWorker.register(
    SERVICE_WORKER_PATH,
    { scope: "/" },
  );

  if (registration.active) return registration;

  const worker = registration.installing ?? registration.waiting;

  if (!worker) {
    throw new Error("Firebase Service Worker was not found.");
  }

  await new Promise<void>((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      cleanup();
      reject(new Error("Service Worker activation timed out."));
    }, 15000);

    function cleanup() {
      window.clearTimeout(timeout);
      worker!.removeEventListener("statechange", checkState);
    }

    function checkState() {
      if (worker!.state === "activated") {
        cleanup();
        resolve();
      } else if (worker!.state === "redundant") {
        cleanup();
        reject(new Error("Service Worker activation failed."));
      }
    }

    worker.addEventListener("statechange", checkState);
    checkState();
  });

  return registration;
}

export async function getFcmToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;

  if (
    !window.isSecureContext ||
    !("Notification" in window) ||
    !("serviceWorker" in navigator)
  ) {
    return null;
  }

  const messaging = await getFirebaseMessaging();

  if (!messaging) return null;

  const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

  if (!vapidKey) {
    throw new Error("NEXT_PUBLIC_FIREBASE_VAPID_KEY is missing.");
  }

  let permission = Notification.permission;

  if (permission === "default") {
    permission = await Notification.requestPermission();
  }

  if (permission !== "granted") return null;

  const registration = await registerMessagingWorker();

  const token = await getToken(messaging, {
    vapidKey,
    serviceWorkerRegistration: registration,
  });

  return token || null;
}
