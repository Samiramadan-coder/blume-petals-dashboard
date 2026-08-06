import { Suspense } from "react";
import { http } from "@/lib/http";
import { getTranslations } from "next-intl/server";
import { OccasionResponse } from "@/types/occasions";
import DataPreview from "@/components/occasions/data-preview";
import { Spinner } from "@/components/ui/spinner";

export async function generateMetadata() {
  const t = await getTranslations("Occasions");

  return {
    title: t("Title"),
  };
}

async function OccasionsCollectionsPage() {
  const { data, ok } = await http.get<OccasionResponse>(
    "/api/v1/admin/occasions",
    {
      next: {
        tags: ["occasions"],
      },
    },
  );

  if (!ok) {
    throw new Error("Failed to fetch occasions collections");
  }

  return (
    <main className="space-y-6">
      <DataPreview
        key={JSON.stringify(data.data.items)}
        initialOccasions={data.data.items}
      />
    </main>
  );
}

export default async function Page() {
  return (
    <Suspense fallback={<Spinner className="h-8 w-8 text-primary" />}>
      <OccasionsCollectionsPage />
    </Suspense>
  );
}
