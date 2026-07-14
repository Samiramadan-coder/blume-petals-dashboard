import { productsPlaceholder } from "@/constants/products";
import DataPreview from "@/components/products/data-preview";
import { http } from "@/lib/http";
import { CategoryResponse } from "@/types/categories";
import { OccasionResponse } from "@/types/occasions";

export const metadata = {
  title: "Products",
};

type SearchParams = {
  query?: string;
  category?: string;
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  const { data: categories } = await http.get<CategoryResponse>(
    "/api/v1/admin/categories",
  );

  const { data: products } = await http.get<OccasionResponse>(
    "/api/v1/admin/occasions",
  );

  return (
    <main className="space-y-6">
      <DataPreview
        products={productsPlaceholder}
        categories={categories.data.items}
        occasions={products.data.items}
      />
    </main>
  );
}
