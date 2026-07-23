import { http } from "@/lib/http";
import { getTranslations } from "next-intl/server";
import { OccasionResponse } from "@/types/occasions";
import DataPreview from "@/components/occasions/data-preview";

export async function generateMetadata() {
  const t = await getTranslations("Occasions");

  return {
    title: t("Title"),
  };
}

export default async function OccasionsCollectionsPage() {
  const { data, ok } = await http.get<OccasionResponse>(
    "/api/v1/admin/occasions",
    { next: { revalidate: 60, tags: ["occasions"] } },
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
