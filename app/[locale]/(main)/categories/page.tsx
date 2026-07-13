// import { initialCategories } from "@/constants/categories";
import DataPreview from "@/components/categories/data-preview";
import { http } from "@/lib/http";
import categoriesRes from "@/data/categories.json";
import { Category, CategoryResponse } from "@/types/categories";

export const metadata = {
  title: "Categories",
};

export default async function CategoriesPage() {
  // console.log(categoriesRes);
  // const { data, ok } = await http.get<CategoryResponse>(
  //   "/api/v1/admin/categories",
  //   { cache: "force-cache", next: { tags: ["categories"] } },
  // );

  // if (!ok) {
  //   throw new Error("Failed to fetch categories");
  // }

  return (
    <main className="space-y-6">
      <DataPreview
        initialCategories={categoriesRes.data.items as unknown as Category[]}
      />
    </main>
  );
}
