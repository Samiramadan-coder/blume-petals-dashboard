import DataPreview from "@/components/occasions/data-preview";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("Occasions");

  return {
    title: t("Title"),
  };
}

export default function OccasionsCollectionsPage() {
  return (
    <main className="space-y-6">
      <DataPreview initialOccasionsCollections={[]} />
    </main>
  );
}
