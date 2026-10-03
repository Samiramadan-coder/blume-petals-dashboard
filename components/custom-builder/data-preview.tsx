"use client";

import Image from "next/image";
import { toast } from "sonner";
import { useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import CreateEdit from "./create-edit";
import { Link } from "@/i18n/navigation";
import { Checkbox } from "../ui/checkbox";
import EditBtn from "../reusable/edit-btn";
import { Product } from "@/types/products";
import { Pagination } from "@/types/shared";
import { Images, Trash2 } from "lucide-react";
import DeleteBtn from "../reusable/delete-btn";
import { TableCell, TableRow } from "../ui/table";
import { DataTable } from "../reusable/data-table";
import { columns } from "@/constants/custom-builder";
import { deleteProductAction } from "@/lib/products-server";
import { useLocale, useTranslations } from "next-intl";
import { usePermissions } from "@/providers/permission-providers";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

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
  const canDelete = can("catalog.delete");
  const t = useTranslations("CustomBuilder");
  const tCommon = useTranslations("Common");
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [checkedIds, setCheckedIds] = useState<number[]>([]);

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-end">
          {can("catalog.create") && (
            <div className="flex items-center gap-2">
              {checkedIds.length ? (
                <>
                  <span className="text-muted-foreground font-semibold text-xs">
                    {checkedIds.length} {tCommon("Selected")}
                  </span>
                  <DeleteBtn
                    trigger={
                      <Button variant="outline" className="h-10 bg-white">
                        <Trash2 className="text-destructive/70" />
                        <span className="text-destructive">
                          {tCommon("BulkDelete")}
                        </span>
                      </Button>
                    }
                  />
                </>
              ) : null}

              <CreateEdit firstCategoryId={firstCategoryId} />
            </div>
          )}
        </div>
        <DataTable
          columns={columns(t)}
          rowsCount={templates.length}
          countUnit={t("Templates")}
          pagination={pagination}
          isCheckbox={
            templates.length > 0 && checkedIds.length === templates.length
          }
          onCheckboxChange={
            canDelete
              ? (checked) =>
                  setCheckedIds(
                    checked ? templates.map((template) => template.id) : [],
                  )
              : undefined
          }
        >
          {templates.length === 0 ? (
            <TableRow className="border-primary/20">
              <TableCell
                colSpan={columns(t).length + (canDelete ? 1 : 0)}
                className="px-4 py-3"
              >
                <p className="text-center text-sm text-muted-foreground">
                  {t("NoTemplates")}
                </p>
              </TableCell>
            </TableRow>
          ) : (
            templates.map((template) => (
              <TableRow key={template.id} className="border-primary/20">
                {canDelete && (
                  <TableCell className="px-4 py-3">
                    <Checkbox
                      checked={checkedIds.includes(template.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setCheckedIds((prev) => [...prev, template.id]);
                        } else {
                          setCheckedIds((prev) =>
                            prev.filter((id) => id !== template.id),
                          );
                        }
                      }}
                    />
                  </TableCell>
                )}

                <TableCell className="px-4 py-3">
                  <TemplatePhoto
                    template={template}
                    alt={template.name[locale]}
                  />
                </TableCell>

                <TableCell className="px-4 py-3">
                  <p className="font-semibold">{template.name[locale]}</p>
                </TableCell>

                <TableCell className="px-4 py-3">
                  <div className="space-y-1">
                    {template.variants.map((temp) => (
                      <div key={temp.id} className="flex gap-2">
                        <p className="font-normal text-muted-foreground text-xs">
                          {temp.size}:
                        </p>
                        <div>
                          <Badge className="text-xs text-primary bg-primary/10 border-primary/20">
                            ({temp.min_stems} {t("Stems")} - {temp.max_stems}{" "}
                            {t("Stems")} {t("Max")})
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
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
                      <Button variant="ghost" asChild>
                        <Link
                          href={`/products/${template.id}`}
                          locale={locale}
                          aria-label={t("Gallery")}
                        >
                          <Images className="size-4 text-muted-foreground" />
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{t("Gallery")}</TooltipContent>
                  </Tooltip>

                  {canDelete && (
                    <DeleteBtn
                      itemName={template.name[locale]}
                      onDelete={async () => {
                        setLoadingDelete(true);
                        const result = await deleteProductAction(template);
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

/**
 * The primary photo of a template, any photo if none is primary, or an empty
 * box when the template has no photos at all.
 */
function TemplatePhoto({ template, alt }: { template: Product; alt: string }) {
  const images = template.images ?? [];
  const url = (images.find((img) => img.is_primary) ?? images[0])?.url;

  if (!url) {
    return <div className="size-10 rounded-lg bg-muted" />;
  }

  return (
    <Image src={url} alt={alt} width={40} height={40} className="rounded-lg" />
  );
}
