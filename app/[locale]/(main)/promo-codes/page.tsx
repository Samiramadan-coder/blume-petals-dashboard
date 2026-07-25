import { http } from "@/lib/http";
import { Suspense } from "react";
import { Pagination } from "@/types/shared";
import { CategoryResponse } from "@/types/categories";
import Summary from "@/components/promo-codes/summary";
import DataPreview from "@/components/promo-codes/data-preview";
import { Coupon, PromoCodesSummary } from "@/types/promo-codes";
import PromoCodesSkeleton from "@/components/promo-codes/promo-codes-skeleton";

type SearchParams = {
  query?: string;
  status?: string;
  page?: string;
};

async function PromoCodesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // Fetch promo codes data
  const { data: promoCodesData, ok: ok1 } = await http.get<{
    data: {
      items: Coupon[];
      pagination: Pagination;
      summary: PromoCodesSummary;
    };
  }>("/api/v1/admin/coupons", {
    params: {
      q: searchParams.query || "",
      status: searchParams.status || "",
      page: searchParams.page || 1,
    },
    next: {
      revalidate: 60,
      tags: ["promo-codes"],
    },
  });

  // Fetch categories data
  const { data: categories, ok: ok2 } = await http.get<CategoryResponse>(
    "/api/v1/admin/categories",
    {
      next: {
        revalidate: 60,
        tags: ["categories"],
      },
    },
  );

  if (!ok1 || !ok2) {
    throw new Error("Failed to fetch promo codes data");
  }

  return (
    <main className="space-y-6">
      <Summary summary={promoCodesData.data.summary} />
      <DataPreview
        key={JSON.stringify(promoCodesData.data.items)}
        coupons={promoCodesData.data.items}
        pagination={promoCodesData.data.pagination}
        categories={categories.data.items}
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
    <Suspense fallback={<PromoCodesSkeleton />}>
      <PromoCodesPage searchParams={await searchParams} />
    </Suspense>
  );
}
