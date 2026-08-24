import { cn } from "@/lib/utils";
import { Suspense } from "react";
import { http } from "@/lib/http";
import { Link } from "@/i18n/navigation";
import { Pagination } from "@/types/shared";
import { Spinner } from "@/components/ui/spinner";
import { Product, Summary } from "@/types/products";
import { getTranslations } from "next-intl/server";
import { Occasion } from "@/types/occasions";
import { Category } from "@/types/categories";
import DataPreview from "@/components/products/data-preview";

type SearchParams = {
  page?: string;
  query?: string;
  category?: string;
  type?: "default" | "addon";
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

async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const activeTab = searchParams.type || "default";
  const t = await getTranslations("Products");

  // Fetch categories
  const { data: categories, ok: ok1 } = await http.get<{
    data: {
      items: Category[];
      pagination: Pagination;
    };
  }>("/api/v1/admin/categories", {
    params: {
      type: activeTab === "default" ? "" : "addon",
    },
    next: {
      tags: ["categories"],
    },
  });

  // Fetch occasions
  const { data: occasions, ok: ok2 } = await http.get<{
    data: {
      items: Occasion[];
      pagination: Pagination;
    };
  }>("/api/v1/admin/occasions", {
    next: {
      tags: ["occasions"],
    },
  });

  // Fetch products
  const { data: products, ok: ok3 } = await http.get<{
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
      q: searchParams.query ?? "",
      page: searchParams.page ?? 1,
      category_id: searchParams.category ?? "",
      category_type: activeTab === "default" ? "" : "addon",
      show_in_builder: 0,
    },
  });

  // Fetch flowers
  const { data: flowers, ok: ok4 } = await http.get<{
    data: {
      items: Product[];
    };
  }>("/api/v1/admin/products", {
    next: {
      tags: ["products"],
    },
    params: {
      per_page: 1000,
      page: 1,
      show_in_builder: 1,
    },
  });

  if (!ok1 || !ok2 || !ok3 || !ok4) {
    throw new Error(t("Errors.FetchingData"));
  }

  console.log("Products Data:", products.data.items);

  return (
    <main className="space-y-6">
      <div className="flex gap-2 items-center">
        <Link
          href="?type=default&page=1"
          className={cn("text-sm px-5 py-3 rounded-lg", {
            "bg-primary/70 shadow-sm font-bold": activeTab === "default",
          })}
        >
          {t("Products")}
        </Link>
        <Link
          href="?type=addon&page=1"
          className={cn("text-sm px-5 py-3 rounded-lg", {
            "bg-primary/70 shadow-sm font-bold": activeTab === "addon",
          })}
        >
          {t("AddOnsProducts")}
        </Link>
      </div>

      <DataPreview
        key={JSON.stringify(products.data.items)}
        products={products.data.items}
        categories={categories.data.items}
        occasions={occasions.data.items}
        pagination={products.data.pagination}
        type={activeTab}
        summary={products.data.summary}
        flowers={flowers.data.items}
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
