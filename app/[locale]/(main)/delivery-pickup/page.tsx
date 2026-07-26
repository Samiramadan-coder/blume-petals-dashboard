import DataPreview from "@/components/delivery-pickup/data-preview";
import { http } from "@/lib/http";
import { City } from "@/types/countries-cities";

export default async function DeliveryAndPickupPage() {
  const { data: cities, ok: citiesOk } = await http.get<{
    data: {
      items: City[];
    };
  }>("/api/v1/admin/cities", {
    params: {
      per_page: 1000,
    },
  });

  if (!citiesOk) {
    throw new Error("Failed to fetch cities");
  }

  return (
    <main className="space-y-6">
      <DataPreview cities={cities.data.items} />
    </main>
  );
}
