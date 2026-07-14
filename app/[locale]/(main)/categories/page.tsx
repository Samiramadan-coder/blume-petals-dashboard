import DataPreview from "@/components/categories/data-preview";
import { http } from "@/lib/http";
import { CategoryResponse } from "@/types/categories";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("Categories");

  return {
    title: t("Categories"),
  };
}

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const params = await searchParams;

  const { data, ok } = await http.get<CategoryResponse>(
    "/api/v1/admin/categories",
    {
      params: {
        page: params.page || 1,
        per_page: 2,
      },
      cache: "force-cache",
      next: { tags: ["categories"] },
    },
  );

  if (!ok) {
    throw new Error("Failed to fetch categories");
  }

  return (
    <main className="space-y-6">
      <DataPreview
        key={JSON.stringify(
          data.data.items.map((category) => [
            category.id,
            category.updated_at,
            category.is_visible,
          ]),
        )}
        initialCategories={data.data.items}
        pagination={data.data.pagination}
      />
    </main>
  );
}
