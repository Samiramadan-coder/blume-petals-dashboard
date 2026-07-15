"use client";

import {
  deleteOccasionAction,
  reorderOccasionsAction,
  updateOccasionVisibilityAction,
} from "@/lib/occasion-actions";
import { toast } from "sonner";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";
import CreateEdit from "./create-edit";
import { TableCell } from "../ui/table";
import EditBtn from "../reusable/edit-btn";
import { Occasion } from "@/types/occasions";
import DeleteBtn from "../reusable/delete-btn";
import { columns } from "@/constants/occasions";
import { useLocale, useTranslations } from "next-intl";
import { ReorderableDataTable } from "../reusable/date-sortable-table";
import Image from "next/image";

export default function DataPreview({
  initialOccasions,
}: {
  initialOccasions: Occasion[];
}) {
  const locale = useLocale();
  const t = useTranslations("Occasions");
  const tCommon = useTranslations("Common");
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [occasions, setOccasions] = useState(initialOccasions);

  return (
    <>
      <header className="flex items-center justify-between">
        <div>
          <h1
            className={cn(`text-2xl font-semibold text-foreground`, {
              "font-cairo": locale === "ar",
              "font-heading": locale === "en",
            })}
          >
            {t("Title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            {t("Description")}
          </p>
        </div>
        <CreateEdit totalOccasionItems={occasions.length} />
      </header>

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
        countUnit="occasions collections"
        columns={columns(t)}
        renderCells={(occasion) => (
          <>
            <TableCell className="px-4 py-3">
              <div className="flex gap-4">
                <Image
                  src={occasion.banner_url as string}
                  alt={occasion.name_translations[locale]}
                  width={40}
                  height={60}
                  className="rounded-md shadow-sm"
                />
                <div>
                  <p className="font-semibold">
                    {occasion.name_translations[locale]}
                  </p>
                  <p className="text-muted-foreground text-xs mt-1">
                    /{occasion.slug}
                  </p>
                </div>
              </div>
            </TableCell>

            <TableCell>
              - <span className="font-normal">{t("Items")}</span>
            </TableCell>

            <TableCell className="px-4 py-3">
              <Switch
                checked={occasion.is_visible}
                onClick={async () => {
                  const result = await updateOccasionVisibilityAction(occasion);
                  if (result.success) {
                    toast.success(tCommon("VisibilityUpdated"));
                    return;
                  }
                  toast.error(tCommon("VisibilityUpdateFailed"));
                }}
              />
            </TableCell>

            <TableCell className="px-4 py-3">
              <Badge className="bg-secondary/20 text-secondary">
                {occasion.is_visible ? tCommon("Visible") : tCommon("Hidden")}
              </Badge>
            </TableCell>

            <TableCell className="px-4 py-3">
              <CreateEdit
                occasion={occasion}
                trigger={<EditBtn />}
                totalOccasionItems={occasions.length}
              />
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
            </TableCell>
          </>
        )}
      />
    </>
  );
}
