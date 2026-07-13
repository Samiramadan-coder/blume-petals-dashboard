import { http } from "@/lib/http";
import { getTranslations } from "next-intl/server";
import DataPreview from "@/components/occasions/data-preview";
import { OccasionCollectionResponse } from "@/types/occasions";
import occasions from "@/data/occasions.json";

export async function generateMetadata() {
  const t = await getTranslations("Occasions");

  return {
    title: t("Title"),
  };
}

export default async function OccasionsCollectionsPage() {
  // const { data, ok } = await http.get<OccasionCollectionResponse>(
  //   "/api/v1/admin/occasions",
  //   {
  //     cache: "force-cache",
  //     next: { tags: ["occasions"] },
  //   },
  // );

  // if (!ok) {
  //   throw new Error("Failed to fetch occasions collections");
  // }

  return (
    <main className="space-y-6">
      <DataPreview
        initialOccasionsCollections={
          occasions.data
            .items as unknown as OccasionCollectionResponse["data"]["items"]
        }
      />
    </main>
  );
}
