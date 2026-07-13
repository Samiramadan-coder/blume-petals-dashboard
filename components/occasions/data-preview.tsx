"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import CreateEdit from "./create-edit";
import { TableCell } from "../ui/table";
import EditBtn from "../reusable/edit-btn";
import DeleteBtn from "../reusable/delete-btn";
import { columns } from "@/constants/occasions";
import { Occasion } from "@/types/occasions";
import { useLocale, useTranslations } from "next-intl";
import { ReorderableDataTable } from "../reusable/date-sortable-table";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";
import { toast } from "sonner";

export default function DataPreview({
  initialOccasions,
}: {
  initialOccasions: Occasion[];
}) {
  const t = useTranslations("Occasions");
  const tCommon = useTranslations("Common");
  const locale = useLocale();
  const [occasions, setOccasions] = useState(initialOccasions);
  const [loadingDelete, setLoadingDelete] = useState(false);

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
        <CreateEdit />
      </header>

      <ReorderableDataTable
        data={occasions}
        getRowId={(row) => row.id}
        onReorder={(newOccasions) => {
          setOccasions(newOccasions);
        }}
        rowsCount={occasions.length}
        countUnit="occasions collections"
        columns={columns(t)}
        renderCells={(occasion) => (
          <>
            <TableCell className="px-4 py-3">-</TableCell>

            <TableCell className="px-4 py-3">
              <p className="font-semibold">{occasion.name[locale]}</p>
              <p className="text-muted-foreground text-xs mt-1">
                /{occasion.slug}
              </p>
            </TableCell>

            <TableCell className="px-4 py-3">-</TableCell>

            <TableCell className="px-4 py-3">
              <Switch
                checked={occasion.is_visible}
                onClick={async () => {
                  // const result = await updateOccasionVisibilityAction(occasion);
                  // if (result.success) {
                  //   toast.success(t("VisibilityUpdated"));
                  //   return;
                  // }
                  // toast.error(t("VisibilityUpdateFailed"));
                }}
              />
            </TableCell>

            <TableCell className="px-4 py-3">
              <Badge className="bg-secondary/20 text-secondary">
                {occasion.is_visible ? tCommon("Visible") : tCommon("Hidden")}
              </Badge>
            </TableCell>

            <TableCell className="px-4 py-3">
              <CreateEdit occasion={occasion} trigger={<EditBtn />} />
              <DeleteBtn
                onDelete={async () => {
                  // setLoadingDelete(true);
                  // const result = await deleteOccasionAction(occasion);
                  // setLoadingDelete(false);
                  // if (result.success) {
                  //   toast.success(tCommon("DeletedSuccessfully"));
                  //   return;
                  // }
                  // toast.error(tCommon("DeleteFailed"));
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
