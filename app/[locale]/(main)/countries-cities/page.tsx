import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import DataPreview from "@/components/countries-cities/country/data-preview";
import DataPreviewCity from "@/components/countries-cities/city/data-preview";
import { http } from "@/lib/http";
import { Country } from "@/types/countries-cities";
import { Pagination } from "@/types/shared";
import { getTranslations } from "next-intl/server";

type SearchParams = {
  type?: "countries" | "cities";
  page?: string;
};

export default async function CountriesCitiesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const activeTab = params.type || "countries";
  const t = await getTranslations("CountriesCities");

  const { data: countriesData, ok: okCountries } = await http.get<{
    data: {
      items: Country[];
      pagination: Pagination;
    };
  }>("/api/v1/admin/countries", {
    cache: "force-cache",
    next: { tags: ["countries"] },
  });

  if (!okCountries) {
    throw new Error("Failed to fetch countries");
  }

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

      {activeTab === "countries" ? (
        <DataPreview
          key={JSON.stringify(countriesData.data.items)}
          initialCountries={countriesData.data.items}
          pagination={countriesData.data.pagination}
        />
      ) : (
        <DataPreviewCity />
      )}
    </main>
  );
}
