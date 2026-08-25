import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { Suspense } from "react";
import { http } from "@/lib/http";
import { MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/products";
import type { AppLocale } from "@/i18n/routing";
import { Spinner } from "@/components/ui/spinner";
import { getTranslations } from "next-intl/server";
import DeleteImage from "@/components/products/delete-image";
import AddImageBtn from "@/components/products/add-image-btn";
import SetPrimaryImage from "@/components/products/set-primary-image";

type Params = {
  "product-id": string;
  locale: AppLocale;
};

async function ProductDetails({ params }: { params: Params }) {
  const productId = params["product-id"];
  const locale = params.locale;
  const t = await getTranslations("Products");

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
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">
          {t("Labels.Gallery")} ({product.images.length})
        </h1>

        <AddImageBtn productId={product.id} />
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {product.images.map((image) => (
          <div
            key={image.id}
            className="group relative aspect-square w-full overflow-hidden rounded-xl border bg-muted"
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
                  <SetPrimaryImage imageId={image.id} productId={product.id} />
                  <DeleteImage imageId={image.id} productId={product.id} />
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<Params>;
}) {
  return (
    <Suspense fallback={<Spinner className="h-8 w-8 text-primary" />}>
      <ProductDetails params={await params} />
    </Suspense>
  );
}
