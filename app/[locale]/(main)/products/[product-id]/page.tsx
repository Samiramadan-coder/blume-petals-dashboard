import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { http } from "@/lib/http";
import { Product } from "@/types/products";
import { AppLocale } from "@/i18n/routing";
import { MoreVertical, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";
import DeleteImage from "@/components/products/delete-image";
import AddImageBtn from "@/components/products/add-image-btn";
import SetPrimaryImage from "@/components/products/set-primary-image";
import CreateEditVariant from "@/components/products/creat-edit-variant";

type Params = {
  "product-id": string;
  locale: AppLocale;
};

export default async function ProductDetails({ params }: { params: Params }) {
  const tCommon = await getTranslations("Common");
  const t = await getTranslations("Products");
  const pageParams = await params;
  const productId = pageParams["product-id"];
  const locale = pageParams.locale;

  const { data, ok } = await http.get<{ data: { product: Product } }>(
    `/api/v1/admin/products/${productId}`,
    {
      next: {
        tags: [`product-${productId}`],
      },
    },
  );

  if (!ok) {
    throw new Error("Failed to fetch product details");
  }

  return (
    <div className="container max-w-5xl space-y-6 py-6">
      <h2 className="text-2xl text-primary font-bold">
        {t("Labels.ProductDetails")}
      </h2>

      <div className="space-y-3">
        <h1 className="text-2xl font-bold flex items-center">
          {data.data.product.name[locale]}{" "}
          {data.data.product.is_new && (
            <Badge className="mx-2 text-sm font-semibold text-foreground">
              {tCommon("New")}
            </Badge>
          )}
        </h1>
        <p className="text-muted-foreground text-sm">
          /{data.data.product.slug}
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4 gap-4">
          <h2 className="text-base text-primary font-bold">
            {t("Labels.Gallery")} ({data.data.product.images.length})
          </h2>

          <AddImageBtn productId={data.data.product.id} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data.data.product.images.map((image, index) => (
            <div
              key={index}
              className="relative aspect-square w-full overflow-hidden rounded-md shadow-sm"
            >
              <Image
                src={image.url as string}
                alt={data.data.product.name[locale]}
                fill
                sizes="200px"
                className="object-cover shadow-sm"
              />

              {image.is_primary && (
                <Badge className="absolute inset-s-2 top-2 z-10 bg-red-400 text-sm text-foreground shadow-md">
                  {t("MainLabel")}
                </Badge>
              )}

              {!image.is_primary && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="default"
                      size="icon"
                      className="absolute inset-e-2 top-2 z-20 size-8 rounded-full bg-background/90 shadow-md hover:bg-background/80"
                    >
                      <MoreVertical className="size-4 text-primary" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <SetPrimaryImage
                      imageId={image.id}
                      productId={data.data.product.id}
                    />

                    <DeleteImage
                      imageId={image.id}
                      productId={data.data.product.id}
                    />
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-base text-primary mb-2 font-bold">
          {t("Fields.Description")}{" "}
        </h2>
        <div
          className="text-muted-foreground"
          dangerouslySetInnerHTML={{
            __html: data.data.product.description[locale],
          }}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4 gap-4">
          <h2 className="text-base text-primary mb-2 font-bold">
            {t("Labels.Variants")}{" "}
          </h2>

          <CreateEditVariant productId={data.data.product.id} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data.data.product.variants.map((variant, index) => (
            <div key={index} className="space-y-1">
              <div className="text-sm">
                {t("Fields.Price")}: {variant.price}
              </div>
              <div className="text-sm">
                {t("Fields.SKU")}: {variant.sku}
              </div>
              <div className="text-sm">
                {t("Fields.Size")}: {variant.size}
              </div>
              <div className="text-sm">
                {t("Fields.StockQuantity")}: {variant.stock}
              </div>

              <CreateEditVariant
                productId={data.data.product.id}
                variant={variant}
                trigger={
                  <Button size="icon">
                    <Pencil />
                  </Button>
                }
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
