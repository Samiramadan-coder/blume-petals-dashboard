import { productsPlaceholder } from "@/constants/products";
import DataPreview from "@/components/products/data-preview";

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
  console.log(params);

  return (
    <main className="space-y-6">
      <DataPreview products={productsPlaceholder} />
    </main>
  );
}
