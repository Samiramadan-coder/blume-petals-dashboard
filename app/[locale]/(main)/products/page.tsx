import { http } from "@/lib/http";
import { OccasionResponse } from "@/types/occasions";
import { CategoryResponse } from "@/types/categories";
import DataPreview from "@/components/products/data-preview";
import { ProductResponse } from "@/types/products";

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

  const { data: occasions } = await http.get<OccasionResponse>(
    "/api/v1/admin/occasions",
  );

  const { data: products } = await http.get<ProductResponse>(
    "/api/v1/admin/products",
  );

  console.log("products", products);

  return (
    <main className="space-y-6">
      <DataPreview
        products={products.data.items}
        categories={categories.data.items}
        occasions={occasions.data.items}
      />
    </main>
  );
}
