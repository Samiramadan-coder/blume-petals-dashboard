import { http } from "@/lib/http";
import { Pagination } from "@/types/shared";
import { CategoryResponse } from "@/types/categories";
import Summary from "@/components/promo-codes/summary";
import DataPreview from "@/components/promo-codes/data-preview";
import { Coupon, PromoCodesSummary } from "@/types/promo-codes";

type SearchParams = {
  query?: string;
  status?: string;
  page?: string;
};

export default async function PromoCodesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  // Fetch promo codes data
  const { data: promoCodesData, ok: ok1 } = await http.get<{
    data: {
      items: Coupon[];
      pagination: Pagination;
      summary: PromoCodesSummary;
    };
  }>("/api/v1/admin/coupons", {
    params: {
      q: params.query || "",
      status: params.status || "",
      page: params.page || 1,
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
        coupons={promoCodesData.data.items}
        pagination={promoCodesData.data.pagination}
        categories={categories.data.items}
      />
    </main>
  );
}
