import { T } from "@/types/shared";
import { DataTableColumn } from "@/components/reusable/data-table";

export const columns = (t: T): DataTableColumn[] => [
  {
    label: t("Table.Flower"),
  },
  {
    label: t("Table.Name"),
  },
  {
    label: t("Table.StockQty"),
  },
  {
    label: t("Table.UnitCost"),
  },
  {
    label: t("Table.Status"),
  },
  {
    label: t("Table.Actions"),
  },
];
