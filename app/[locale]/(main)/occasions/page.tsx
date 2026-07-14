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
    {
      cache: "force-cache",
      next: { tags: ["occasions"] },
    },
  );

  console.log(data);

  if (!ok) {
    throw new Error("Failed to fetch occasions collections");
  }

  return (
    <main className="space-y-6">
      <DataPreview
        key={JSON.stringify(
          data.data.items.map((occasion) => [
            occasion.id,
            occasion.updated_at,
            occasion.is_visible,
          ]),
        )}
        initialOccasions={data.data.items}
      />
    </main>
  );
}
