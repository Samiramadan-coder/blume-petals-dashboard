"use client";

import {
  deleteCityAction,
  reorderCitiesAction,
  updateCityVisibilityAction,
} from "@/lib/countries-cities";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useState } from "react";
// import CreateEdit from "./create-edit";
import { Pagination } from "@/types/shared";
import { Switch } from "@/components/ui/switch";
import { Spinner } from "@/components/ui/spinner";
import { TableCell } from "@/components/ui/table";
import { City, Country } from "@/types/countries-cities";
import EditBtn from "@/components/reusable/edit-btn";
import { cityColumns } from "@/constants/countries-cities";
import { useLocale, useTranslations } from "next-intl";
import DeleteBtn from "@/components/reusable/delete-btn";
import { useQueryParam } from "@/hooks/use-search-params";
import { ReorderableDataTable } from "@/components/reusable/date-sortable-table";
import CreateEdit from "./create-edit";

export default function DataPreview({
  initialCities,
  pagination,
  countries,
}: {
  initialCities: City[];
  pagination: Pagination;
  countries: Country[];
}) {
  const locale = useLocale();
  const { setQueryParam } = useQueryParam();
  const tCommon = useTranslations("Common");
  const t = useTranslations("CountriesCities");
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [cities, setCities] = useState<City[]>(initialCities);

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1
            className={cn("text-2xl font-semibold text-foreground", {
              "font-cairo": locale === "ar",
              "font-heading": locale !== "ar",
            })}
          >
            {t("ListOfCities")}
          </h1>
        </div>
        <CreateEdit
          totalCreatedItems={pagination.total}
          countries={countries}
        />
      </header>

      <ReorderableDataTable
        data={cities}
        getRowId={(row) => row.id}
        currentPage={pagination.current_page}
        totalPages={pagination.last_page}
        onPageChange={(page) => setQueryParam("page", page.toString())}
        rowsCount={cities.length}
        countUnit={t("Cities")}
        columns={cityColumns((key) => t(key as never))}
        onReorder={async (newCities) => {
          setCities(newCities);

          const result = await reorderCitiesAction(
            newCities.map((city) => city.id),
          );

          if (result.success) {
            toast.success(tCommon("ReorderedSuccessfully"));
            return;
          }

          toast.error(tCommon("ReorderFailed"));
        }}
        renderCells={(city) => (
          <>
            <TableCell className="px-4 py-3">{city.name[locale]}</TableCell>

            <TableCell className="px-4 py-3">
              {city.country.name[locale]}
            </TableCell>

            <TableCell className="px-4 py-3">{city.delivery_fee}</TableCell>

            <TableCell className="px-4 py-3">
              <VisibilitySwitch city={city} />
            </TableCell>

            <TableCell className="px-4 py-3">
              <CreateEdit
                city={city}
                trigger={<EditBtn />}
                totalCreatedItems={pagination.total}
                countries={countries}
              />

              <DeleteBtn
                onDelete={async () => {
                  setLoadingDelete(true);
                  const result = await deleteCityAction(city);
                  setLoadingDelete(false);

                  if (result.success) {
                    toast.success(tCommon("DeletedSuccessfully"));
                    return;
                  }

                  toast.error(tCommon("DeleteFailed"));
                }}
                loading={loadingDelete}
              />
            </TableCell>
          </>
        )}
      />
    </div>
  );
}

/**
 * A switch component to toggle the visibility of a category.
 */
function VisibilitySwitch({ city }: { city: City }) {
  const tCommon = useTranslations("Common");
  const [loading, setLoading] = useState(false);

  return (
    <>
      {loading ? (
        <Spinner className="text-primary" />
      ) : (
        <Switch
          checked={city.is_active}
          onClick={async () => {
            setLoading(true);
            const result = await updateCityVisibilityAction(city);
            setLoading(false);

            if (result.success) {
              toast.success(tCommon("VisibilityUpdated"));
              return;
            }

            toast.error(tCommon("VisibilityUpdateFailed"));
          }}
        />
      )}
    </>
  );
}
