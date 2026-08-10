import { Suspense } from "react";
import { http } from "@/lib/http";
import { Review, Summary } from "@/types/reviews";
import { Pagination } from "@/types/shared";
import { Spinner } from "@/components/ui/spinner";
import DataPreview from "@/components/reviews/data-preview";
import { cn } from "@/lib/utils";
import { getLocale, getTranslations } from "next-intl/server";
import FiltersControl from "@/components/reviews/filters-control";
import Statistics from "@/components/reviews/statistics";
import RatingDistribution from "@/components/reviews/rating-distribution";
import ModuleHeader from "@/components/reusable/module-header";

type SearchParams = {
  page?: string;
  rating?: string;
  sort?: string;
  query?: string;
};

async function ReviewsPage({ searchParams }: { searchParams: SearchParams }) {
  const locale = await getLocale();
  const t = await getTranslations("Reviews");

  // Fetch reviews data from the API
  // The API endpoint is assumed to be `/api/v1/admin/reviews`
  // and it accepts query parameters for pagination and filtering by rating.
  const { data, ok } = await http.get<{
    data: {
      items: Review[];
      pagination: Pagination;
      summary: Summary;
    };
  }>("/api/v1/admin/reviews", {
    params: {
      page: searchParams.page ?? 1,
      per_page: 10,
      rating: searchParams.rating ?? "",
      sort: searchParams.sort ?? "",
      q: searchParams.query ?? "",
    },
    next: {
      tags: ["reviews"],
    },
  });

  if (!ok) {
    throw new Error("Failed to fetch reviews");
  }

  return (
    <main className="grid items-start grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-3 space-y-4">
        <ModuleHeader title={t("Label")} description={t("Description")} />
        <Statistics summary={data.data.summary} />
      </div>

      <div className="md:col-span-2 space-y-4">
        <FiltersControl />

        <DataPreview
          reviews={data.data.items}
          pagination={data.data.pagination}
        />
      </div>

      <RatingDistribution summary={data.data.summary} />
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
