"use client";

import { toast } from "sonner";
import { useState } from "react";
import { Button } from "../ui/button";
import { Images } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Checkbox } from "../ui/checkbox";
import EditBtn from "../reusable/edit-btn";
import { Product } from "@/types/products";
import { Pagination } from "@/types/shared";
import DeleteBtn from "../reusable/delete-btn";
import { TableCell, TableRow } from "../ui/table";
import CreateEdit from "./creat-edit/create-edit";
import { DataTable } from "../reusable/data-table";
import ModuleHeader from "../reusable/module-header";
import { columns } from "@/constants/custom-builder";
import { deleteProductAction } from "@/lib/products";
import { useLocale, useTranslations } from "next-intl";
import { usePermissions } from "@/providers/permission-providers";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import Image from "next/image";

export default function DataPreview({
  templates,
  pagination,
  firstCategoryId,
}: {
  templates: Product[];
  pagination: Pagination;
  firstCategoryId: number;
}) {
  const locale = useLocale();
  const { can } = usePermissions();
  const t = useTranslations("CustomBuilder");
  const tCommon = useTranslations("Common");
  const [loadingDelete, setLoadingDelete] = useState(false);

  return (
    <>
      <ModuleHeader title={t("Title")} description={t("Description")}>
        <CreateEdit firstCategoryId={firstCategoryId} />
      </ModuleHeader>

      <DataTable
        columns={columns(t)}
        rowsCount={templates.length}
        countUnit={t("Templates")}
        pagination={pagination}
        onCheckboxChange={(checked) => console.log(checked)}
      >
        {templates.length === 0 ? (
          <TableRow>
            <TableCell colSpan={columns(t).length + 1} className="px-4 py-3">
              <p className="text-center text-sm text-muted-foreground">
                {t("NoTemplates")}
              </p>
            </TableCell>
          </TableRow>
        ) : (
          templates.map((template, index) => (
            <TableRow key={index}>
              <TableCell className="px-4 py-3">
                <Checkbox />
              </TableCell>

              <TableCell className="px-4 py-3">
                <Image
                  src={template.images[0].url}
                  alt={template.name[locale]}
                  width={40}
                  height={40}
                  className="rounded-lg"
                />
              </TableCell>

              <TableCell className="px-4 py-3">
                <p className="font-semibold">{template.name[locale]}</p>
              </TableCell>

              <TableCell className="px-4 py-3">
                <p className="font-semibold">{template.variants.length}</p>
              </TableCell>

              <TableCell className="px-4 py-3 text-center">
                {can("catalog.edit") && (
                  <CreateEdit
                    firstCategoryId={firstCategoryId}
                    template={template}
                    trigger={<EditBtn />}
                  />
                )}

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href={`/products/${template.id}`} locale={locale}>
                      <Button variant="ghost">
                        <Images className="size-4 text-muted-foreground" />
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>{t("Gallery")}</TooltipContent>
                </Tooltip>

                {can("catalog.delete") && (
                  <DeleteBtn
                    onDelete={async () => {
                      setLoadingDelete(true);
                      const result = await deleteProductAction(template);
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
            </TableRow>
          ))
        )}
      </DataTable>
    </>
  );
}
