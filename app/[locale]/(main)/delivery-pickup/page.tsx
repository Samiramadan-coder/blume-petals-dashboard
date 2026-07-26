import { http } from "@/lib/http";
import { Pagination } from "@/types/shared";
import { City } from "@/types/countries-cities";
import DataPreview from "@/components/delivery-pickup/data-preview";
import { DeliveryPickupLocation } from "@/types/delivery-pickup-locations";

export default async function DeliveryAndPickupPage() {
  // Fetch cities for the CreateEdit component
  const { data: cities, ok: citiesOk } = await http.get<{
    data: {
      items: City[];
    };
  }>("/api/v1/admin/cities", {
    next: {
      tags: ["cities"],
    },
    params: {
      per_page: 1000,
    },
  });

  // Fetch delivery pickup locations for the DataPreview component
  const { data: locations, ok: locationsOk } = await http.get<{
    data: {
      items: DeliveryPickupLocation[];
      pagination: Pagination;
    };
  }>("/api/v1/admin/pickup-locations", {
    next: {
      tags: ["delivery-pickup-locations"],
    },
    params: {
      per_page: 1000,
    },
  });

  if (!citiesOk || !locationsOk) {
    throw new Error("Failed to fetch cities or locations");
  }

  return (
    <main className="space-y-6">
      <DataPreview
        key={JSON.stringify(locations.data.items)}
        cities={cities.data.items}
        locations={locations.data.items}
        pagination={locations.data.pagination}
      />
    </main>
  );
}
