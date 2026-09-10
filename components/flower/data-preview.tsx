"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

import { toast } from "sonner";
import Image from "next/image";
import Restock from "./restock";
import { http } from "@/lib/http";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import CreateEdit from "./create-edit";
import { LogItem } from "@/types/flower";
import { Link } from "@/i18n/navigation";
import { Product } from "@/types/products";
import EditBtn from "../reusable/edit-btn";
import { Pagination } from "@/types/shared";
import { cn, formatDate } from "@/lib/utils";
import { columns } from "@/constants/flowers";
import DeleteBtn from "../reusable/delete-btn";
import { DataTable } from "../reusable/data-table";
import ModuleHeader from "../reusable/module-header";
import { deleteProductAction } from "@/lib/products";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { ChevronDown, Download, Images } from "lucide-react";
import { usePermissions } from "@/providers/permission-providers";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export default function DataPreview({
  flowers,
  pagination,
  firstCategoryId,
}: {
  flowers: Product[];
  pagination: Pagination;
  firstCategoryId: number;
}) {
  console.log(flowers);
  const t = useTranslations("Flower");

  return (
    <>
      <ModuleHeader title={t("Title")} description={t("Description")}>
        <CreateEdit firstCategoryId={firstCategoryId} />
      </ModuleHeader>

      <DataTable
        columns={[{ label: "" }, ...columns(t)]}
        rowsCount={flowers.length}
        countUnit={t("Flowers")}
        pagination={pagination}
      >
        {flowers.length === 0 ? (
          <TableRow>
            <TableCell colSpan={columns(t).length + 1} className="px-4 py-3">
              <p className="text-center text-sm text-muted-foreground">
                {t("NoFlowers")}
              </p>
            </TableCell>
          </TableRow>
        ) : (
          flowers.map((flower, index) => (
            <FlowerRow
              key={index}
              flower={flower}
              firstCategoryId={firstCategoryId}
            />
          ))
        )}
      </DataTable>
    </>
  );
}

// Renders a single row for a flower in the data table.
function FlowerRow({
  flower,
  firstCategoryId,
}: {
  flower: Product;
  firstCategoryId: number;
}) {
  const { can } = usePermissions();
  const locale = useLocale();
  const t = useTranslations("Flower");
  const tCommon = useTranslations("Common");
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [showStockLog, setShowStockLog] = useState(false);

  return (
    <>
      <TableRow className="border-primary/20 hover:bg-transparent!">
        <TableCell>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setShowStockLog(!showStockLog)}
          >
            <ChevronDown className="text-muted-foreground size-4" />
          </Button>
        </TableCell>

        <TableCell className="px-4 py-3">
          <Image
            src={flower.images.find((img) => img.is_primary)?.url || ""}
            alt={flower.name[locale]}
            width={40}
            height={40}
            className="rounded-lg max-h-10"
          />
        </TableCell>

        <TableCell className="px-4 py-3">
          <div>
            <p className="mb-1 font-semibold">{flower.name[locale]}</p>
            <span className="text-muted-foreground text-xs">{flower.sku}</span>
          </div>
        </TableCell>

        <TableCell className="px-4 py-3 font-bold">
          {flower.variants[0].available_stock}
        </TableCell>

        <TableCell className="px-4 py-3 text-muted-foreground text-xs">
          {tCommon("AED")} {flower.price_from}
        </TableCell>

        <TableCell className="px-4 py-3">
          <Badge
            className={cn(
              "h-5 px-4",
              flower.variants[0].in_stock
                ? "text-secondary bg-secondary/10"
                : "text-[#b83a30] bg-destructive/10",
            )}
          >
            <span
              className={cn(
                "size-1.5 rounded-full",
                flower.variants[0].in_stock ? "bg-secondary" : "bg-[#b83a30]",
              )}
            ></span>
            {flower.variants[0].in_stock ? t("InStock") : t("OutOfStock")}
          </Badge>
        </TableCell>

        <TableCell className="px-4 py-3 space-x-4">
          {can("catalog.edit") && (
            <>
              <Restock flower={flower} />

              <CreateEdit
                flower={flower}
                trigger={<EditBtn />}
                firstCategoryId={firstCategoryId}
              />

              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={`/products/${flower.id}`} locale={locale}>
                    <Button variant="ghost">
                      <Images className="size-4 text-muted-foreground" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>{t("Gallery")}</TooltipContent>
              </Tooltip>
            </>
          )}

          {can("catalog.delete") && (
            <DeleteBtn
              onDelete={async () => {
                setLoadingDelete(true);
                const result = await deleteProductAction(flower);
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

      {showStockLog && flower.variants[0].id && (
        <StockLog flowerId={flower.id} variantId={flower.variants[0].id} />
      )}
    </>
  );
}

// Component to display the stock log for a specific flower variant.
function StockLog({
  flowerId,
  variantId,
}: {
  flowerId: number;
  variantId: number;
}) {
  const t = useTranslations("Flower");
  const [stockLog, setStockLog] = useState<LogItem[]>([]);
  const [loadingDownload, setLoadingDownload] = useState(false);

  // Function to fetch the stock log for the given flower variant.
  const fetchStockLog = useCallback(async () => {
    try {
      const { data } = await http.get<{
        data: {
          items: LogItem[];
          pagination: Pagination;
        };
      }>(`/api/v1/admin/products/${flowerId}/variants/${variantId}/stock-log`);

      setStockLog(data.data.items);
    } catch (error) {
      console.error("Failed to fetch stock log:", error);
    }
  }, [flowerId, variantId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStockLog();
  }, [fetchStockLog]);

  // Fetches the full stock log as CSV text from the server and triggers a browser download.
  async function downloadStockLog() {
    setLoadingDownload(true);
    try {
      const { data } = await http.get<string>(
        `/api/v1/admin/products/${flowerId}/variants/${variantId}/stock-log/export`,
      );

      const blob = new Blob([data], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `stock-log-${flowerId}-${variantId}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download stock log:", error);
    } finally {
      setLoadingDownload(false);
    }
  }

  return (
    <TableRow className="border-primary/20">
      <TableCell colSpan={7} className="p-6!">
        <div className="flex items-center gap-4 justify-between mb-2">
          <p className="text-xs font-semibold">{t("StockLog")}</p>
          <Button
            className="text-[10px] bg-transparent"
            variant="outline"
            onClick={downloadStockLog}
            disabled={loadingDownload}
          >
            <Download className="size-3" />
            {t("DownloadStockLog")}
          </Button>
        </div>

        <div className="border border-primary/20 rounded-xl">
          <Table>
            <TableHeader>
              <TableRow className="bg-background hover:bg-transparent">
                <TableHead className="px-3 py-2 text-[10px] font-semibold uppercase text-muted-foreground">
                  {t("Date")}
                </TableHead>
                <TableHead className="px-3 py-2 text-[10px] font-semibold uppercase text-muted-foreground">
                  {t("Action")}
                </TableHead>
                <TableHead className="px-3 py-2 text-[10px] font-semibold uppercase text-muted-foreground">
                  {t("Change")}
                </TableHead>
                <TableHead className="px-3 py-2 text-[10px] font-semibold uppercase text-muted-foreground">
                  {t("Balance")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stockLog.map((logItem) => (
                <TableRow key={logItem.id} className="hover:bg-transparent">
                  <TableCell className="px-x py-2 text-xs text-muted-foreground">
                    {formatDate(logItem.date)}
                  </TableCell>
                  <TableCell className="px-x py-2">
                    <Badge
                      className={cn(
                        `text-xs`,
                        logItem.label === "Sold"
                          ? "text-primary bg-primary/20"
                          : "text-secondary bg-secondary/20",
                      )}
                    >
                      {logItem.label}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className={cn(
                      `px-x py-2 text-xs font-semibold text-muted-foreground`,
                      logItem.change < 0 && "text-red-500",
                    )}
                  >
                    {logItem.change}
                  </TableCell>
                  <TableCell className="px-x py-2 text-xs font-semibold">
                    {logItem.balance}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </TableCell>
    </TableRow>
  );
}
