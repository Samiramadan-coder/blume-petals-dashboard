import { T } from "@/types/shared";
import { Color, Occasion, Product, Size } from "@/types/products";
import { DataTableColumn } from "@/components/reusable/data-table";

// Table Column
export const columns = (t: T): DataTableColumn[] => [
  { label: t("Table.Photo") },
  { label: t("Table.Name") },
  { label: t("Table.Category") },
  { label: t("Table.Price") },
  { label: t("Table.Stock") },
  { label: t("Table.Rating") },
  { label: t("Table.Status") },
  { label: t("Table.Actions"), className: "text-center" },
];

export const productsPlaceholder: Product[] = [
  {
    name: "Product 1",
    category: "Category 1",
    description: "Description for Product 1",
    price: 100,
    salesPrice: 90,
    stockQuantity: 50,
    sku: "SKU001",
    images: ["/icon.png"],
    sizes: ["s", "m"],
    colors: ["#F4C2C2", "#FFFFF0"],
    occasions: ["birthday", "wedding"],
    showNewBadge: true,
    featuredOnHomepage: false,
    productStatus: "active",
    id: 1,
    rating: 4.5,
  },
];

export const sizes: Size[] = [
  { value: "s", label: "S" },
  { value: "m", label: "M" },
  { value: "l", label: "L" },
  { value: "xl", label: "XL" },
];

export const colors: Color[] = [
  { value: "#F4C2C2", label: "Blush Pink" },
  { value: "#FFFFF0", label: "Ivory" },
  { value: "#7D947B", label: "Sage" },
  { value: "#9B1C1C", label: "Deep Red" },
  { value: "#C7B8EA", label: "Lavender" },
  { value: "#FFCBA4", label: "Peach" },
  { value: "#FFFFFF", label: "White" },
  { value: "#CBB682", label: "Gold" },
  { value: "#ED8074", label: "Terracotta" },
  { value: "#DCAE96", label: "Dusty Rose" },
];

export const occasions: Occasion[] = [
  { label: "Valentine's Day", value: "valentine's day" },
  { label: "Birthday", value: "birthday" },
  { label: "Wedding", value: "wedding" },
  { label: "Eid", value: "eid" },
  { label: "Anniversary", value: "anniversary" },
  { label: "Mother's Day", value: "mother's day" },
  { label: "Graduation", value: "graduation" },
  { label: "Corporate", value: "corporate" },
  { label: "Sympathy", value: "sympathy" },
  { label: "Just Because", value: "just because" },
];

export const productStatuses = [
  { label: "Active", value: "active" },
  { label: "Draft", value: "draft" },
];
