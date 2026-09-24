import Image from "next/image";
import { Suspense } from "react";
import { http } from "@/lib/http";
import { formatDate } from "@/lib/utils";
import { Pagination } from "@/types/shared";
import { Spinner } from "@/components/ui/spinner";
import { getTranslations } from "next-intl/server";
import { Design } from "@/types/active-custom-designs";
import { TableCell, TableRow } from "@/components/ui/table";
import { DataTable } from "@/components/reusable/data-table";
import ModuleHeader from "@/components/reusable/module-header";

type SearchParams = {
  page?: string;
};

async function GetListOfActiveCustomDesigns({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { page } = await searchParams;
  const t = await getTranslations("ActiveCustomDesigns");

  const { data, ok } = await http.get<{
    data: { items: Design[]; pagination: Pagination };
  }>("/api/v1/admin/designs/active", {
    params: {
      page: page ?? "1",
    },
  });

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
    <div className="space-y-6">
      <ModuleHeader title={t("Title")} description={""} />

      <DataTable
        columns={columns}
        rowsCount={data.data.items.length}
        countUnit={t("Design")}
        pagination={data.data.pagination}
      >
        {data.data.items.length === 0 ? (
          <TableRow className="border-primary/20">
            <TableCell colSpan={columns.length + 1} className="px-4 py-10">
              <p className="text-center text-sm text-muted-foreground">
                {t("NoActiveDesigns")}
              </p>
            </TableCell>
          </TableRow>
        ) : (
          data.data.items.map((design, index) => (
            <TableRow
              key={index}
              className="border-primary/15 transition-colors hover:bg-muted/20"
            >
              {/* Photo */}
              <TableCell className="px-4 py-4 align-top">
                <div className="size-12 overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={design.image_url}
                    alt={design.bouquet.name}
                    width={48}
                    height={48}
                    className="size-full object-cover"
                  />
                </div>
              </TableCell>

              {/* Client */}
              <TableCell className="px-4 py-4 align-top">
                <div className="min-w-45 space-y-1">
                  <p className="text-sm font-semibold text-foreground">
                    {design.customer.name}
                  </p>

                  {design.customer.email && (
                    <p className="max-w-55 truncate text-xs text-muted-foreground">
                      {design.customer.email}
                    </p>
                  )}

                  {design.customer.phone && (
                    <p className="text-xs text-muted-foreground">
                      {design.customer.phone}
                    </p>
                  )}
                </div>
              </TableCell>

              {/* Components */}
              <TableCell className="px-4 py-4 align-top">
                <div className="flex max-w-90 flex-wrap gap-1.5">
                  {design.flowers.map((flower) => (
                    <div
                      key={flower.variant_id}
                      className="inline-flex items-center gap-1 rounded-md border bg-muted/40 px-2 py-1 text-xs"
                    >
                      <span className="font-semibold text-primary">
                        {flower.qty}x
                      </span>

                      <span>{flower.name}</span>
                    </div>
                  ))}
                </div>
              </TableCell>

              {/* Ribbon & Card */}
              <TableCell className="px-4 py-4 align-top">
                <div className="min-w-45 space-y-2">
                  {design.cart.gift.ribbon && (
                    <div className="rounded-lg border bg-muted/20 p-2.5">
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-primary">
                          {t("Ribbon")}
                        </span>

                        <span
                          className="size-3 rounded-full border"
                          style={{
                            backgroundColor:
                              design.cart.gift.ribbon.color_hex ||
                              "transparent",
                          }}
                        />
                      </div>

                      <p className="text-xs text-muted-foreground">
                        {t("Price")}
                        <span className="ms-1 font-medium text-foreground">
                          {design.cart.gift.ribbon.price}
                        </span>
                      </p>
                    </div>
                  )}

                  {design.cart.gift.card_style && (
                    <div className="rounded-lg border bg-muted/20 p-2.5">
                      <p className="mb-2 text-xs font-semibold text-primary">
                        {t("CardStyle")}
                      </p>

                      <div className="space-y-1 text-xs">
                        <p>
                          <span className="text-muted-foreground">
                            {t("Name")}
                          </span>

                          <span className="ms-1 font-medium">
                            {design.cart.gift.card_style.name}
                          </span>
                        </p>

                        <p>
                          <span className="text-muted-foreground">
                            {t("Price")}
                          </span>

                          <span className="ms-1 font-medium">
                            {design.cart.gift.card_style.price}
                          </span>
                        </p>
                      </div>
                    </div>
                  )}

                  {!design.cart.gift.ribbon && !design.cart.gift.card_style && (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </div>
              </TableCell>

              {/* Message */}
              <TableCell className="px-4 py-4 align-top">
                {design.cart.message_text ? (
                  <p
                    className="max-w-55 line-clamp-3 text-sm leading-5 text-muted-foreground"
                    title={design.cart.message_text}
                  >
                    {design.cart.message_text}
                  </p>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>

              {/* Saved At */}
              <TableCell className="px-4 py-4 align-top">
                <div className="min-w-35">
                  <p className="text-sm font-medium">
                    {formatDate(design.saved_at)}
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </DataTable>
    </div>
  );
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  return (
    <Suspense fallback={<Spinner className="h-8 w-8 text-primary" />}>
      <GetListOfActiveCustomDesigns searchParams={searchParams} />
    </Suspense>
  );
}
