"use client";

import {
  deleteOccasionAction,
  reorderOccasionsAction,
  updateOccasionVisibilityAction,
} from "@/lib/occasion-actions";
import { toast } from "sonner";
import { useState } from "react";
import { formatDate } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";
import CreateEdit from "./create-edit";
import { TableCell } from "../ui/table";
import { Spinner } from "../ui/spinner";
import EditBtn from "../reusable/edit-btn";
import { Occasion } from "@/types/occasions";
import DeleteBtn from "../reusable/delete-btn";
import { columns } from "@/constants/occasions";
import ModuleHeader from "../reusable/module-header";
import { useLocale, useTranslations } from "next-intl";
import { usePermissions } from "@/providers/permission-providers";
import { ReorderableDataTable } from "../reusable/date-sortable-table";
import Image from "next/image";

export default function DataPreview({
  initialOccasions,
}: {
  initialOccasions: Occasion[];
}) {
  const locale = useLocale();
  const { can } = usePermissions();
  const t = useTranslations("Occasions");
  const tCommon = useTranslations("Common");
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [occasions, setOccasions] = useState(initialOccasions);

  return (
    <>
      <ModuleHeader title={t("Title")} description={t("Description")}>
        {can("catalog.create") && (
          <CreateEdit totalOccasionItems={occasions.length} />
        )}
      </ModuleHeader>

      <ReorderableDataTable
        data={occasions}
        getRowId={(row) => row.id}
        onReorder={async (newOccasions) => {
          setOccasions(newOccasions);
          const result = await reorderOccasionsAction(
            newOccasions.map((occasion) => occasion.id),
          );
          if (result.success) {
            toast.success(tCommon("ReorderedSuccessfully"));
            return;
          }
          toast.error(tCommon("ReorderFailed"));
        }}
        rowsCount={occasions.length}
        countUnit={t("Title")}
        columns={columns(t)}
        renderCells={(occasion) => (
          <>
            <TableCell className="px-4 py-3">
              <Image
                src={occasion.banner_url}
                alt={occasion.name_translations[locale]}
                width={40}
                height={40}
                className="rounded-lg"
              />
            </TableCell>
            <TableCell className="px-4 py-3">
              <p className="font-semibold">
                {occasion.name_translations[locale]}
              </p>
              <p className="text-muted-foreground text-xs mt-1">
                /{occasion.slug}
              </p>
            </TableCell>

            <TableCell>
              {occasion.starts_at && occasion.ends_at ? (
                <span className="text-muted-foreground text-xs">
                  {formatDate(occasion.starts_at)} -{" "}
                  {formatDate(occasion.ends_at)}
                </span>
              ) : (
                <span>-</span>
              )}
            </TableCell>

            <TableCell>
              {occasion.products_count}{" "}
              <span className="font-normal">{t("Items")}</span>
            </TableCell>

            <TableCell className="px-4 py-3">
              <VisibilitySwitch
                occasion={occasion}
                disabled={!can("catalog.edit")}
              />
            </TableCell>

            <TableCell className="px-4 py-3">
              <Badge className="bg-secondary/20 text-secondary">
                {occasion.is_visible ? tCommon("Visible") : tCommon("Hidden")}
              </Badge>
            </TableCell>

            <TableCell className="px-4 py-3 space-x-4">
              {can("catalog.edit") && (
                <CreateEdit
                  occasion={occasion}
                  trigger={<EditBtn />}
                  totalOccasionItems={occasions.length}
                />
              )}

              {can("catalog.delete") && (
                <DeleteBtn
                  onDelete={async () => {
                    setLoadingDelete(true);
                    const result = await deleteOccasionAction(occasion);
                    setLoadingDelete(false);
                    if (result.success) {
                      toast.success(tCommon("DeletedSuccessfully"));
                      return;
                    }
                    toast.error(tCommon("DeleteFailed"));
                  }}
                  loading={loadingDelete}
                />
              )}
            </TableCell>
          </>
        )}
      />
    </>
  );
}

/**
 * Visibility switch component for an occasion.
 */
function VisibilitySwitch({
  occasion,
  disabled,
}: {
  occasion: Occasion;
  disabled: boolean;
}) {
  const tCommon = useTranslations("Common");
  const [loading, setLoading] = useState(false);

  return (
    <>
      {loading ? (
        <Spinner className="text-primary" />
      ) : (
        <Switch
          checked={occasion.is_visible}
          disabled={disabled}
          onClick={async () => {
            setLoading(true);
            const result = await updateOccasionVisibilityAction(occasion);
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
