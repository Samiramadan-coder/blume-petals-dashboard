import { Suspense } from "react";
import { http } from "@/lib/http";
import { Pagination } from "@/types/shared";
import { Spinner } from "@/components/ui/spinner";
import { Product, Summary } from "@/types/products";
import { getTranslations } from "next-intl/server";
import DataPreview from "@/components/flower/data-preview";

type SearchParams = {
  page?: string;
};

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

async function FlowersPage({ searchParams }: { searchParams: SearchParams }) {
  // Fetch products
  const { data: products } = await http.get<{
    data: {
      items: Product[];
      pagination: Pagination;
      summary: Summary;
    };
  }>("/api/v1/admin/products", {
    next: {
      tags: ["products"],
    },
    params: {
      per_page: 10,
      page: searchParams.page ?? 1,
      show_in_builder: 1,
    },
  });

  console.log("Products data:", products); // Log the fetched products data for debugging

  return (
    <main className="space-y-6">
      <DataPreview
        key={JSON.stringify(products.data.items)}
        flowers={products.data.items}
        pagination={products.data.pagination}
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
      <FlowersPage searchParams={await searchParams} />
    </Suspense>
  );
}
