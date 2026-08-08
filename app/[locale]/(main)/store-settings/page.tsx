import DataPreview from "@/components/settings/data-preview";
import { Spinner } from "@/components/ui/spinner";
import { http } from "@/lib/http";
import { Settings } from "@/types/settings";
import { Suspense } from "react";

async function StoreSettings() {
  const { data, ok } = await http.get<{
    data: {
      settings: Settings;
    };
  }>("/api/v1/admin/settings");

  if (!ok) {
    throw new Error("Failed to fetch store settings");
  }

  return (
    <main className="space-y-6">
      <DataPreview settings={data.data.settings} />
    </main>
  );
}

export default async function StoreSettingsPage() {
  return (
    <Suspense fallback={<Spinner className="text-primary w-8 h-8" />}>
      <StoreSettings />
    </Suspense>
  );
}
