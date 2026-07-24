import DataPreview from "@/components/promo-codes/data-preview";
import Summary from "@/components/promo-codes/summary";
import { http } from "@/lib/http";
import { CategoryResponse } from "@/types/categories";
import { Coupon, PromoCodesSummary } from "@/types/promo-codes";
import { Pagination } from "@/types/shared";

export default async function PromoCodesPage() {
  // Fetch promo codes data
  const { data: promoCodesData, ok: ok1 } = await http.get<{
    data: {
      items: Coupon[];
      pagination: Pagination;
      summary: PromoCodesSummary;
    };
  }>("/api/v1/admin/coupons", {
    next: {
      revalidate: 60,
      tags: ["promo-codes"],
    },
  });

  console.log("PromoCodesPage promoCodesData:", promoCodesData);

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
