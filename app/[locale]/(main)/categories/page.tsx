import DataPreview from "@/components/categories/data-preview";
import { initialCategories } from "@/constants/categories";

export const metadata = {
  title: "Categories",
};

export default function CategoriesPage() {
  return (
    <main className="space-y-6">
      <DataPreview initialCategories={initialCategories} />
    </main>
  );
}
