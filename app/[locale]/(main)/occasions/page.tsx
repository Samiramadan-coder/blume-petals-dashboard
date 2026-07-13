import DataPreview from "@/components/occasions/data-preview";

export const metadata = {
  title: "Occasions & Collections",
};

export default function OccasionsCollectionsPage() {
  return (
    <main className="space-y-6">
      <DataPreview initialOccasionsCollections={[]} />
    </main>
  );
}
