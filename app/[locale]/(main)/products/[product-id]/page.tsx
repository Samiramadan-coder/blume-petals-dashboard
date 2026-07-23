import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { http } from "@/lib/http";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/products";
import type { AppLocale } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { MoreVertical, Pencil } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import DeleteImage from "@/components/products/delete-image";
import AddImageBtn from "@/components/products/add-image-btn";
import SetPrimaryImage from "@/components/products/set-primary-image";
import CreateEditVariant from "@/components/products/creat-edit-variant";
import DeleteVariantAction from "@/components/products/delete-variant-btn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Params = {
  "product-id": string;
  locale: AppLocale;
};

type SearchParams = {
  type?: "default" | "addon";
};

export default async function ProductDetails({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}) {
  const pageParams = await params;
  const search = await searchParams;

  const productId = pageParams["product-id"];
  const locale = pageParams.locale;
  const type = search.type || "default";

  const t = await getTranslations("Products");
  const tCommon = await getTranslations("Common");

  const { data, ok } = await http.get<{
    data: {
      product: Product;
    };
  }>(`/api/v1/admin/products/${productId}`, {
    next: {
      tags: [`product-${productId}`],
    },
  });

  if (!ok) {
    throw new Error("Failed to fetch product details");
  }

  const product = data.data.product;

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 p-4 md:p-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <p className="text-sm font-semibold text-primary">
            {t("Labels.ProductDetails")}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground md:text-3xl">
              {product.name[locale]}
            </h1>

            {product.is_new && (
              <Badge className="text-xs font-semibold text-foreground">
                {tCommon("New")}
              </Badge>
            )}
          </div>

          <p className="font-mono text-sm text-muted-foreground">
            /{product.slug}
          </p>
        </div>
      </section>

      <Card className="overflow-hidden ring-0! shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between gap-4 border-b">
          <CardTitle className="text-lg">
            {t("Labels.Gallery")} ({product.images.length})
          </CardTitle>

          <AddImageBtn productId={product.id} />
        </CardHeader>

        <CardContent className="p-4 md:p-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {product.images.map((image) => (
              <div
                key={image.id}
                className="group relative aspect-square w-full overflow-hidden rounded-xl border bg-muted shadow-sm"
              >
                <Image
                  src={image.url as string}
                  alt={product.name[locale]}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />

                <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-black/40 to-transparent" />

                {image.is_primary && (
                  <Badge className="absolute inset-s-2 top-2 z-10 bg-primary text-primary-foreground shadow-md">
                    {t("MainLabel")}
                  </Badge>
                )}

                {!image.is_primary && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        aria-label="Image actions"
                        className="absolute inset-e-2 top-2 z-20 size-8 rounded-full bg-background/90 shadow-md hover:bg-background"
                      >
                        <MoreVertical className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <SetPrimaryImage
                        imageId={image.id}
                        productId={product.id}
                      />

                      <DeleteImage imageId={image.id} productId={product.id} />
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {product.description[locale] && (
        <Card className="ring-0! shadow-sm">
          <CardHeader className="border-b">
            <CardTitle className="text-lg">{t("Fields.Description")}</CardTitle>
          </CardHeader>

          <CardContent className="p-4 md:p-6">
            <div
              className="
              prose
              prose-sm
              max-w-none
              text-muted-foreground
              prose-headings:text-foreground
              prose-p:text-muted-foreground
              prose-li:text-muted-foreground
            "
              dangerouslySetInnerHTML={{
                __html: product.description[locale],
              }}
            />
          </CardContent>
        </Card>
      )}

      <Card className="ring-0! shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between gap-4 border-b">
          <CardTitle className="text-lg">
            {t("Labels.Variants")} ({product.variants.length})
          </CardTitle>
          {type === "default" && <CreateEditVariant productId={product.id} />}
        </CardHeader>

        <CardContent className="p-4 md:p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {product.variants.map((variant) => (
              <Card
                key={variant.id}
                className="gap-0 overflow-hidden ring-0! bg-primary/10 shadow-sm"
              >
                <CardHeader className="flex flex-row items-center justify-between gap-3 bg-muted/40 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-sm">
                      {variant.size}
                    </Badge>

                    <span className="font-mono text-xs text-muted-foreground">
                      {variant.sku}
                    </span>
                  </div>

                  <div>
                    <CreateEditVariant
                      productId={product.id}
                      variant={variant}
                      trigger={
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          aria-label="Edit variant"
                        >
                          <Pencil className="size-4" />
                        </Button>
                      }
                    />

                    {type === "default" && (
                      <DeleteVariantAction
                        productId={product.id}
                        variantId={variant.id!}
                      />
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 p-4">
                  <VariantRow label={t("Fields.Price")} value={variant.price} />
                  <Separator />
                  <VariantRow label={t("Fields.SKU")} value={variant.sku} />
                  <Separator />
                  <VariantRow label={t("Fields.Size")} value={variant.size} />
                  <Separator />
                  <VariantRow
                    label={t("Fields.StockQuantity")}
                    value={variant.stock}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

/**
 * VariantRow component displays a label and its corresponding value in a row format.
 */
function VariantRow({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold text-foreground">{value}</span>
    </div>
  );
}
