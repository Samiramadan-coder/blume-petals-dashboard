import DataPreview from "@/components/occasions-collections/data-preview";
import { initialOccasionsCollections } from "@/constants/occasions-collections";

export const metadata = {
  title: "Occasions & Collections",
};

export default function OccasionsCollectionsPage() {
  return (
    <main className="space-y-6">
      <DataPreview initialOccasionsCollections={initialOccasionsCollections} />
    </main>
  );
}
