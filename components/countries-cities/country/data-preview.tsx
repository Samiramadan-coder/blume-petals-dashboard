"use client";

import {
  deleteCountryAction,
  reorderCountriesAction,
  updateCountryVisibilityAction,
} from "@/lib/countries-cities";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useState } from "react";
import CreateEdit from "./create-edit";
import { Pagination } from "@/types/shared";
import { Switch } from "@/components/ui/switch";
import { Spinner } from "@/components/ui/spinner";
import { TableCell } from "@/components/ui/table";
import { Country } from "@/types/countries-cities";
import EditBtn from "@/components/reusable/edit-btn";
import { columns } from "@/constants/countries-cities";
import { useLocale, useTranslations } from "next-intl";
import DeleteBtn from "@/components/reusable/delete-btn";
import { useQueryParam } from "@/hooks/use-search-params";
import { ReorderableDataTable } from "@/components/reusable/date-sortable-table";

export default function DataPreview({
  initialCountries,
  pagination,
}: {
  initialCountries: Country[];
  pagination: Pagination;
}) {
  const locale = useLocale();
  const { setQueryParam } = useQueryParam();
  const tCommon = useTranslations("Common");
  const t = useTranslations("CountriesCities");
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [countries, setCountries] = useState<Country[]>(initialCountries);

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
            {t("ListOfCountries")}
          </h1>
        </div>
        <CreateEdit totalCreatedItems={pagination.total} />
      </header>

      <ReorderableDataTable
        data={countries}
        getRowId={(row) => row.id}
        currentPage={pagination.current_page}
        totalPages={pagination.last_page}
        onPageChange={(page) => setQueryParam("page", page.toString())}
        rowsCount={countries.length}
        countUnit={t("Countries")}
        columns={columns((key) => t(key as never))}
        onReorder={async (newCountries) => {
          setCountries(newCountries);

          const result = await reorderCountriesAction(
            newCountries.map((country) => country.id),
          );

          if (result.success) {
            toast.success(tCommon("ReorderedSuccessfully"));
            return;
          }

          toast.error(tCommon("ReorderFailed"));
        }}
        renderCells={(country) => (
          <>
            <TableCell className="px-4 py-3">{country.name[locale]}</TableCell>
            <TableCell className="px-4 py-3">{country.code}</TableCell>
            <TableCell className="px-4 py-3">
              <VisibilitySwitch country={country} />
            </TableCell>

            <TableCell className="px-4 py-3">
              <CreateEdit
                country={country}
                trigger={<EditBtn />}
                totalCreatedItems={pagination.total}
              />

              <DeleteBtn
                onDelete={async () => {
                  setLoadingDelete(true);
                  const result = await deleteCountryAction(country);
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
function VisibilitySwitch({ country }: { country: Country }) {
  const tCommon = useTranslations("Common");
  const [loading, setLoading] = useState(false);

  return (
    <>
      {loading ? (
        <Spinner className="text-primary" />
      ) : (
        <Switch
          checked={country.is_active}
          onClick={async () => {
            setLoading(true);
            const result = await updateCountryVisibilityAction(country);
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
