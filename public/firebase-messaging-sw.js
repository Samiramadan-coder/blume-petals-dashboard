self.addEventListener("notificationclick", (event) => {
  const target = event.notification.data?.url;

  // إشعارات Firebase التلقائية يتعامل معها Firebase
  if (!target) return;

  event.stopImmediatePropagation();
  event.notification.close();

  event.waitUntil(
    (async () => {
      const url = new URL(target, self.location.origin);

      if (url.origin !== self.location.origin) return;

      const windows = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });

      const existingWindow = windows.find((client) => client.url === url.href);

      if (existingWindow) {
        return existingWindow.focus();
      }

      return self.clients.openWindow(url.href);
    })(),
  );
});

importScripts(
  "https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js",
);

importScripts(
  "https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js",
);

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

firebase.initializeApp({
  apiKey: "AIzaSyClU262rVU5JshignlDQGww5-9oQ8IOXlE",
  authDomain: "blumepatels.firebaseapp.com",
  projectId: "blumepatels",
  storageBucket: "blumepatels.firebasestorage.app",
  messagingSenderId: "850376005414",
  appId: "1:850376005414:web:597f44323fe8db681b93e7",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  if (payload.notification) return;

  return self.registration.showNotification(
    payload.data?.title || "New notification",
    {
      body: payload.data?.body || "",
      icon: payload.data?.icon || "/icons/icon-192x192.png",
      data: {
        url: payload.data?.url || "/notifications",
      },
    },
  );
});
