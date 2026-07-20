import { cn } from "@/lib/utils";
import { http } from "@/lib/http";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { CategoryResponse, CategoryType } from "@/types/categories";
import DataPreview from "@/components/categories/data-preview";

type PageParams = {
  page?: string;
  tab?: CategoryType;
};

/**
 * This is a Next.js page component that displays categories and add-ons categories in a tabbed interface.
 * It fetches category data from an API and passes it to the DataPreview component for rendering.
 * The page also generates metadata for SEO purposes.
 */
export async function generateMetadata() {
  const t = await getTranslations("Categories");
  return {
    title: t("Categories"),
  };
}

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: PageParams;
}) {
  const t = await getTranslations("Categories");
  const params = await searchParams;
  const activeTab = params.tab || "default";

  const { data, ok } = await http.get<CategoryResponse>(
    "/api/v1/admin/categories",
    {
      params: {
        page: params.page || 1,
        per_page: 10,
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
      <div className="flex gap-2 items-center">
        <Link
          href="?tab=default&page=1"
          className={cn("text-sm px-5 py-3 rounded-lg", {
            "bg-primary/70 shadow-sm font-bold": activeTab === "default",
          })}
        >
          {t("Categories")}
        </Link>
        <Link
          href="?tab=add-ons&page=1"
          className={cn("text-sm px-5 py-3 rounded-lg", {
            "bg-primary/70 shadow-sm font-bold": activeTab === "add-ons",
          })}
        >
          {t("AddOnsCategories")}
        </Link>
      </div>

      <DataPreview
        key={JSON.stringify(data.data.items)}
        initialCategories={data.data.items}
        pagination={data.data.pagination}
        type={activeTab}
      />
    </main>
  );
}
