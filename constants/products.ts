import { T } from "@/types/shared";
import { DataTableColumn } from "@/components/reusable/data-table";

// Table Column
export const columns = (t: T): DataTableColumn[] => [
  {
    label: t("Table.Photo"),
  },
  {
    label: t("Table.Name"),
  },
  {
    label: t("Table.Category"),
  },
  {
    label: t("Table.Price"),
  },
  {
    label: t("Table.Stock"),
  },
  {
    label: t("Table.Rating"),
  },
  {
    label: t("Table.Status"),
  },
  {
    label: t("Table.Actions"),
    className: "text-center",
  },
];

// Product Statuses
export const productStatuses = (t: T) => [
  {
    label: t("Labels.Active"),
    value: "published",
  },
  {
    label: t("Labels.Draft"),
    value: "draft",
  },
];

// Initial Flower
export const initialFlower = {
  component_variant_id: 0,
  qty: 0,
};

// Initial Variant
export const initialVariant = {
  id: undefined,
  sku: "",
  size: "",
  price: 0,
  stock: 0,
  compare_at_price: null,
  in_stock: true,
  is_on_sale: false,
  recipe: [initialFlower],
};
