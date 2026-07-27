import { T } from "@/types/shared";
import { DataTableColumn } from "@/components/reusable/data-table";

export const columns = (t: T): DataTableColumn[] => [
  {
    label: t("Table.Customer"),
  },
  {
    label: t("Table.Email"),
  },
  {
    label: t("Table.Phone"),
  },
  {
    label: t("Table.Orders"),
  },
  {
    label: t("Table.Spent"),
  },
  {
    label: t("Table.LastOrder"),
  },
  {
    label: t("Table.Joined"),
  },
];

export const customersStatuses = (t: T) => [
  {
    label: t("Filters.All"),
    value: "all",
  },
  {
    label: t("Filters.Vip"),
    value: "vip",
  },
  {
    label: t("Filters.New"),
    value: "new",
  },
  {
    label: t("Filters.Returning"),
    value: "returning",
  },
  {
    label: t("Filters.Inactive"),
    value: "inactive",
  },
  {
    label: t("Filters.Wholesale"),
    value: "wholesale",
  },
];
