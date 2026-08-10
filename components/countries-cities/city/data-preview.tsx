"use client";

import {
  deleteCityAction,
  reorderCitiesAction,
  updateCityVisibilityAction,
} from "@/lib/countries-cities";
import { toast } from "sonner";
import { useState } from "react";
import CreateEdit from "./create-edit";
import { Pagination } from "@/types/shared";
import { Switch } from "@/components/ui/switch";
import { Spinner } from "@/components/ui/spinner";
import { TableCell } from "@/components/ui/table";
import EditBtn from "@/components/reusable/edit-btn";
import { useLocale, useTranslations } from "next-intl";
import DeleteBtn from "@/components/reusable/delete-btn";
import { City, Country } from "@/types/countries-cities";
import { cityColumns } from "@/constants/countries-cities";
import { ReorderableDataTable } from "@/components/reusable/date-sortable-table";
import ModuleHeader from "@/components/reusable/module-header";

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
  const tCommon = useTranslations("Common");
  const t = useTranslations("CountriesCities");
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [cities, setCities] = useState<City[]>(initialCities);

  return (
    <div className="space-y-6">
      <ModuleHeader title={t("ListOfCities")} description="">
        <CreateEdit
          totalCreatedItems={pagination.total}
          countries={countries}
        />
      </ModuleHeader>

      <ReorderableDataTable
        data={cities}
        getRowId={(row) => row.id}
        currentPage={pagination.current_page}
        totalPages={pagination.last_page}
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
            <TableCell className="px-4 py-3">
              <p className="text-muted-foreground">{city.name[locale]}</p>
            </TableCell>

            <TableCell className="px-4 py-3">
              <p className="text-muted-foreground">
                {city.country.name[locale]}
              </p>
            </TableCell>

            <TableCell className="px-4 py-3">
              <p className="font-bold">{city.delivery_fee}</p>
            </TableCell>

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
