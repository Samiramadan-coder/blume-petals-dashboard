import { Suspense } from "react";
import { http } from "@/lib/http";
import { Pagination } from "@/types/shared";
import { City } from "@/types/countries-cities";
import { getTranslations } from "next-intl/server";
import DataPreview from "@/components/delivery-pickup/data-preview";
import { DeliveryPickupLocation } from "@/types/delivery-pickup-locations";
import { Spinner } from "@/components/ui/spinner";

export async function generateMetadata() {
  const t = await getTranslations("DeliveryPickupLocations");
  return {
    title: t("Title"),
  };
}

type SearchParams = {
  page?: string;
};

async function DeliveryAndPickupPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
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
      per_page: 10,
      page: searchParams.page || 1,
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

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  return (
    <Suspense fallback={<Spinner className="h-8 w-8 text-primary" />}>
      <DeliveryAndPickupPage searchParams={await searchParams} />
    </Suspense>
  );
}
