import DataPreview from "@/components/promo-codes/data-preview";
import Summary from "@/components/promo-codes/summary";
import { http } from "@/lib/http";
import { Coupon, PromoCodesSummary } from "@/types/promo-codes";
import { Pagination } from "@/types/shared";

export default async function PromoCodesPage() {
  const { data, ok } = await http.get<{
    data: {
      items: Coupon[];
      pagination: Pagination;
      summary: PromoCodesSummary;
    };
  }>("/api/v1/admin/coupons", {
    next: { revalidate: 60, tags: ["promo-codes"] },
  });

  if (!ok) {
    throw new Error("Failed to fetch promo codes data");
  }

  return (
    <main className="space-y-6">
      <Summary summary={data.data.summary} />
      <DataPreview
        coupons={data.data.items}
        pagination={data.data.pagination}
      />
    </main>
  );
}
