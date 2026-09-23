import Image from "next/image";
import { http } from "@/lib/http";
import { formatDate } from "@/lib/utils";
import { Pagination } from "@/types/shared";
import { getTranslations } from "next-intl/server";
import { Design } from "@/types/active-custom-designs";
import { TableCell, TableRow } from "@/components/ui/table";
import { DataTable } from "@/components/reusable/data-table";

export default async function Page() {
  const t = await getTranslations("ActiveCustomDesigns");

  const { data, ok } = await http.get<{
    data: { items: Design[]; pagination: Pagination };
  }>("/api/v1/admin/designs/active");

  if (!ok) {
    throw new Error("Failed to fetch active custom designs");
  }

  const columns = [
    { label: t("Table.Photo") },
    { label: t("Table.Client") },
    { label: t("Table.Components") },
    { label: t("Table.RibbonAndCartStyle") },
    { label: t("Table.Message") },
    { label: t("Table.SavedAt") },
  ];

  return (
    <DataTable
      columns={columns}
      rowsCount={data.data.items.length}
      countUnit={t("Design")}
      pagination={data.data.pagination}
    >
      {data.data.items.length === 0 ? (
        <TableRow className="border-primary/20">
          <TableCell colSpan={columns.length + 1} className="px-4 py-3">
            <p className="text-center text-sm text-muted-foreground">
              {t("NoActiveDesigns")}
            </p>
          </TableCell>
        </TableRow>
      ) : (
        data.data.items.map((design, index) => (
          <TableRow key={index} className="border-primary/20">
            <TableCell className="px-4 py-3">
              <Image
                src={design.image_url}
                alt={design.bouquet.name}
                width={40}
                height={40}
                className="rounded-lg max-h-10"
              />
            </TableCell>

            <TableCell className="px-4 py-3">
              <p className="text-sm font-medium">{design.customer.name}</p>
              <p className="text-xs">{design.customer.email}</p>
              <p className="text-xs">{design.customer.phone}</p>
            </TableCell>

            <TableCell className="px-4 py-3">
              <div>
                {design.flowers.map((flower) => (
                  <p
                    key={flower.variant_id}
                    className="text-xs mb-1 font-semibold"
                  >
                    {flower.qty}x {flower.name}
                  </p>
                ))}
              </div>
            </TableCell>

            <TableCell className="px-4 py-3">
              {design.cart.gift.ribbon && (
                <div className="flex flex-col">
                  <span>{t("Ribbon")}:</span>
                  <span>
                    {t("Price")}: {design.cart.gift.ribbon.price}
                  </span>
                  <span
                    className="inline-block w-3 h-3 rounded-full mr-2"
                    style={{
                      backgroundColor: design.cart.gift.ribbon.color_hex || "",
                    }}
                  ></span>
                </div>
              )}

              {design.cart.gift.card_style && (
                <div className="flex flex-col">
                  <span className="font-semibold text-primary">
                    {t("CardStyle")}:
                  </span>
                  <span>
                    {t("Price")}: {design.cart.gift.card_style.price}
                  </span>
                  <span>
                    {t("Name")}: {design.cart.gift.card_style.name}
                  </span>
                </div>
              )}
            </TableCell>

            <TableCell className="px-4 py-3">
              {design.cart.message_text || "-"}
            </TableCell>

            <TableCell className="px-4 py-3">
              {formatDate(design.saved_at)}
            </TableCell>
          </TableRow>
        ))
      )}
    </DataTable>
  );
}
