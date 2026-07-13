"use client";

import { useTranslations } from "next-intl";

export default function ErrorPage() {
  const t = useTranslations("Common");

  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-bold">{t("Error")}</h1>
      <p>{t("ErrorOccurred")}</p>
    </main>
  );
}
