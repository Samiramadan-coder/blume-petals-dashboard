import { Suspense } from "react";
import { http } from "@/lib/http";
import { Product } from "@/types/products";
import { Pagination } from "@/types/shared";
import { Category } from "@/types/categories";
import { Spinner } from "@/components/ui/spinner";
import { getTranslations } from "next-intl/server";
import DataPreview from "@/components/templates/data-preview";

type SearchParams = { page?: string };

/**
 * This is a Next.js page component that displays products and add-ons products in a tabbed interface.
 * It fetches product, category, and occasion data from APIs and passes it to the DataPreview component for rendering.
 * The page also generates metadata for SEO purposes.
 */
export async function generateMetadata() {
  const t = await getTranslations("Products");
  return {
    title: t("Products"),
  };
}

async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  // Fetch categories
  const { data: categories, ok: ok1 } = await http.get<{
    data: {
      items: Category[];
      pagination: Pagination;
    };
  }>("/api/v1/admin/categories", {
    next: {
      tags: ["categories"],
    },
  });

  // Fetch Templates
  const { data: products, ok: ok2 } = await http.get<{
    data: {
      items: Product[];
      pagination: Pagination;
    };
  }>("/api/v1/admin/products", {
    next: {
      tags: ["templates"],
    },
    params: {
      per_page: 10,
      page: searchParams.page ?? 1,
      show_in_builder: 0,
      template: 1,
    },
  });

  if (!ok1 || !ok2) {
    throw new Error("Failed to fetch categories or products");
  }

  return (
    <main className="space-y-6">
      <DataPreview
        key={JSON.stringify(products.data.items)}
        templates={products.data.items}
        pagination={products.data.pagination}
        firstCategoryId={categories.data.items[0].id}
      />
    </main>
  );
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  return (
    <Suspense fallback={<Spinner className="h-8 w-8 text-primary" />}>
      <ProductsPage searchParams={await searchParams} />
    </Suspense>
  );
}
