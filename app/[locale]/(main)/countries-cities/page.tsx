import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import DataPreview from "@/components/countries-cities/country/data-preview";
import DataPreviewCity from "@/components/countries-cities/city/data-preview";
import { http } from "@/lib/http";
import { City, Country } from "@/types/countries-cities";
import { Pagination } from "@/types/shared";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { CountriesCitiesSkeleton } from "@/components/reusable/page-skeletons";

export async function generateMetadata() {
  const t = await getTranslations("CountriesCities");
  return {
    title: t("Title"),
  };
}

type SearchParams = {
  type?: "countries" | "cities";
  page?: string;
};

async function CountriesCitiesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const activeTab = params.type === "cities" ? "cities" : "countries";
  const t = await getTranslations("CountriesCities");

  // The `page` param belongs to the active tab only. On the cities tab the
  // countries are just the options of the country select, so load them all.
  const [{ data: countriesData }, citiesResponse] = await Promise.all([
    http.get<{
      data: {
        items: Country[];
        pagination: Pagination;
      };
    }>("/api/v1/admin/countries", {
      next: {
        tags: ["countries"],
      },
      params:
        activeTab === "countries"
          ? { per_page: 10, page: params.page || 1 }
          : { per_page: 1000 },
    }),
    activeTab === "cities"
      ? http.get<{
          data: {
            items: City[];
            pagination: Pagination;
          };
        }>("/api/v1/admin/cities", {
          next: {
            tags: ["cities"],
          },
          params: {
            per_page: 10,
            page: params.page || 1,
          },
        })
      : null,
  ]);

  return (
    <main className="space-y-6">
      <div className="flex gap-2 items-center">
        <Link
          href="?type=countries&page=1"
          className={cn("text-sm px-5 py-3 rounded-lg", {
            "bg-primary/70 shadow-sm font-bold": activeTab === "countries",
          })}
        >
          {t("Countries")}
        </Link>
        <Link
          href="?type=cities&page=1"
          className={cn("text-sm px-5 py-3 rounded-lg", {
            "bg-primary/70 shadow-sm font-bold": activeTab === "cities",
          })}
        >
          {t("Cities")}
        </Link>
      </div>

      {citiesResponse ? (
        <DataPreviewCity
          key={JSON.stringify(citiesResponse.data.data.items)}
          initialCities={citiesResponse.data.data.items}
          pagination={citiesResponse.data.data.pagination}
          countries={countriesData.data.items}
        />
      ) : (
        <DataPreview
          key={JSON.stringify(countriesData.data.items)}
          initialCountries={countriesData.data.items}
          pagination={countriesData.data.pagination}
        />
      )}
    </main>
  );
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  return (
    <Suspense fallback={<CountriesCitiesSkeleton />}>
      <CountriesCitiesPage searchParams={await searchParams} />
    </Suspense>
  );
}
