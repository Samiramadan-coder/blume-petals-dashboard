import { Suspense } from "react";
import { http } from "@/lib/http";
import { Review } from "@/types/reviews";
import { Pagination } from "@/types/shared";
import { Spinner } from "@/components/ui/spinner";
import DataPreview from "@/components/reviews/data-preview";
import { cn } from "@/lib/utils";
import { getLocale, getTranslations } from "next-intl/server";
import FiltersControl from "@/components/reviews/filters-control";
import Statistics from "@/components/reviews/statistics";

type SearchParams = { page?: string; rating?: string };

async function ReviewsPage({ searchParams }: { searchParams: SearchParams }) {
  const locale = await getLocale();
  const t = await getTranslations("Reviews");

  // Fetch reviews data from the API
  // The API endpoint is assumed to be `/api/v1/admin/reviews` and it accepts query parameters for pagination and filtering by rating.
  const { data, ok } = await http.get<{
    data: {
      items: Review[];
      pagination: Pagination;
    };
  }>("/api/v1/admin/reviews", {
    params: {
      page: searchParams.page ?? 1,
      per_page: 10,
      rating: searchParams.rating ?? "",
    },
  });

  if (!ok) {
    throw new Error("Failed to fetch reviews");
  }

  return (
    <main className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-3">
        <header className="mb-4">
          <div>
            <h1
              className={cn("text-2xl font-semibold text-foreground", {
                "font-cairo": locale === "ar",
                "font-heading": locale !== "ar",
              })}
            >
              {t("Label")}
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              {t("Description")}
            </p>
          </div>
        </header>

        <Statistics />
      </div>

      <div className="md:col-span-2 space-y-6">
        <FiltersControl />
        <DataPreview
          reviews={data.data.items}
          pagination={data.data.pagination}
        />
      </div>

      <div>-</div>
    </main>
  );
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  return (
    <Suspense fallback={<Spinner className="text-primary w-8 h-8" />}>
      <ReviewsPage searchParams={await searchParams} />
    </Suspense>
  );
}
