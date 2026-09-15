"use client";

import { toast } from "sonner";
import Image from "next/image";
import { useState } from "react";
import EditBtn from "../reusable/edit-btn";
import { Pagination } from "@/types/shared";
import { Card } from "@/types/custom-builder";
import DeleteBtn from "../reusable/delete-btn";
import CreateEditCard from "./create-edit-card";
import { TableCell, TableRow } from "../ui/table";
import { DataTable } from "../reusable/data-table";
import { deleteCardAction } from "@/lib/templates";
import { useLocale, useTranslations } from "next-intl";
import { cardsColumns } from "@/constants/custom-builder";
import { usePermissions } from "@/providers/permission-providers";

export default function DataPreviewCards({
  cards,
  pagination,
}: {
  cards: Card[];
  pagination: Pagination;
}) {
  const locale = useLocale();
  const { can } = usePermissions();
  const tCommon = useTranslations("Common");
  const t = useTranslations("CustomBuilder.Cards");
  const [loadingDelete, setLoadingDelete] = useState(false);

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-end">
          <CreateEditCard />
        </div>

        <DataTable
          columns={cardsColumns(t)}
          rowsCount={cards.length}
          countUnit={t("Cards")}
          pagination={pagination}
        >
          {cards.length === 0 ? (
            <TableRow className="border-primary/20">
              <TableCell
                colSpan={cardsColumns(t).length + 1}
                className="px-4 py-3"
              >
                <p className="text-center text-sm text-muted-foreground">
                  {t("NoCards")}
                </p>
              </TableCell>
            </TableRow>
          ) : (
            cards.map((card, index) => (
              <TableRow key={index} className="border-primary/20">
                <TableCell className="px-4 py-3 min-w-50">
                  <Image
                    src={card.image_url}
                    alt={card.name[locale]}
                    width={40}
                    height={40}
                  />
                </TableCell>

                <TableCell className="px-4 py-3">{card.name[locale]}</TableCell>

                <TableCell className="px-4 py-3">
                  {card.description[locale]}
                </TableCell>

                <TableCell className="px-4 py-3">
                  {tCommon("AED")} {card.price}
                </TableCell>

                <TableCell className="px-4 py-3 space-x-2">
                  <CreateEditCard card={card} trigger={<EditBtn />} />

                  {can("catalog.delete") && (
                    <DeleteBtn
                      onDelete={async () => {
                        setLoadingDelete(true);
                        const result = await deleteCardAction(card);
                        setLoadingDelete(false);
                        if (result.success) {
                          toast.success(result.message);
                          return;
                        }
                        toast.error(tCommon("DeleteFailed"));
                      }}
                      loading={loadingDelete}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </DataTable>
      </div>
    </>
  );
}
