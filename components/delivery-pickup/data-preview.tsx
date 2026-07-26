"use client";

import {
  deleteDeliveryPickupLocationAction,
  reorderDeliveryPickupLocationsAction,
  updateLocationVisibilityAction,
} from "@/lib/delivery-pickup-locations";

import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Switch } from "../ui/switch";
import CreateEdit from "./create-edit";
import { TableCell } from "../ui/table";
import { Spinner } from "../ui/spinner";
import EditBtn from "../reusable/edit-btn";
import { Pagination } from "@/types/shared";
import DeleteBtn from "../reusable/delete-btn";
import { City } from "@/types/countries-cities";
import { useLocale, useTranslations } from "next-intl";
import { columns } from "@/constants/delivery-pickup-location";
import { ReorderableDataTable } from "../reusable/date-sortable-table";
import { DeliveryPickupLocation } from "@/types/delivery-pickup-locations";

export default function DataPreview({
  cities,
  locations,
  pagination,
}: {
  cities: City[];
  locations: DeliveryPickupLocation[];
  pagination: Pagination;
}) {
  const locale = useLocale();
  const t = useTranslations("DeliveryPickupLocations");
  const tCommon = useTranslations("Common");
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [initialLocations, setInitialLocations] =
    useState<DeliveryPickupLocation[]>(locations);

  return (
    <>
      <header className="flex items-center justify-between">
        <div>
          <h1
            className={cn("text-2xl font-semibold text-foreground", {
              "font-cairo": locale === "ar",
              "font-heading": locale !== "ar",
            })}
          >
            {t("Title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            {t("Description")}
          </p>
        </div>
        <CreateEdit cities={cities} />
      </header>

      <ReorderableDataTable
        data={initialLocations}
        getRowId={(row) => row.id}
        currentPage={pagination.current_page}
        totalPages={pagination.last_page}
        rowsCount={initialLocations.length}
        countUnit={t("Locations")}
        columns={columns((key) => t(key as never))}
        onReorder={async (newLocations) => {
          setInitialLocations(newLocations);

          const result = await reorderDeliveryPickupLocationsAction(
            newLocations.map((location) => location.id),
          );

          if (result.success) {
            toast.success(tCommon("ReorderedSuccessfully"));
            return;
          }

          toast.error(tCommon("ReorderFailed"));
        }}
        renderCells={(location) => (
          <>
            <TableCell className="px-4 py-3">
              <p>{location.name[locale]}</p>
            </TableCell>

            <TableCell className="px-4 py-3">
              <div
                dangerouslySetInnerHTML={{ __html: location.address[locale] }}
              ></div>
            </TableCell>

            <TableCell className="px-4 py-3">
              <p>{location.ready_in_text[locale]}</p>
            </TableCell>

            <TableCell className="px-4 py-3">
              <p>{location.hours}</p>
            </TableCell>

            <TableCell className="px-4 py-3">
              <VisibilitySwitch location={location} />
            </TableCell>

            <TableCell className="px-4 py-3">
              <CreateEdit
                location={location}
                trigger={<EditBtn />}
                cities={cities}
              />

              <DeleteBtn
                onDelete={async () => {
                  setLoadingDelete(true);
                  const result =
                    await deleteDeliveryPickupLocationAction(location);
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
    </>
  );
}

/**
 * A switch component to toggle the visibility of a category.
 */
function VisibilitySwitch({ location }: { location: DeliveryPickupLocation }) {
  const tCommon = useTranslations("Common");
  const [loading, setLoading] = useState(false);

  return (
    <>
      {loading ? (
        <Spinner className="text-primary" />
      ) : (
        <Switch
          checked={location.is_active}
          onClick={async () => {
            setLoading(true);
            const result = await updateLocationVisibilityAction(location);
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
