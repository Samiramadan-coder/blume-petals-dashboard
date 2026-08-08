import { Skeleton } from "@/components/ui/skeleton";

const galleryItems = Array.from({ length: 3 });
const variants = Array.from({ length: 2 });

export default function ProductDetailsSkeleton() {
  return (
    <div className="space-y-6 mx-auto max-w-7xl">
      {/* Header */}
      <div>
        <Skeleton className="h-4 w-24" />

        <Skeleton className="mt-4 h-8 w-52" />

        <Skeleton className="mt-3 h-4 w-44" />
      </div>

      {/* Gallery */}
      <section className="overflow-hidden rounded-xl border bg-white">
        <div className="flex min-h-12 items-center justify-between border-b px-4">
          <Skeleton className="h-5 w-20" />

          <Skeleton className="size-6 rounded-md" />
        </div>

        <div className="flex flex-wrap gap-3 p-5">
          {galleryItems.map((_, index) => (
            <div key={index} className="relative">
              <Skeleton className="aspect-square w-53 rounded-xl" />

              {index === 1 && (
                <Skeleton className="absolute inset-s-2 top-2 h-5 w-10 rounded-full" />
              )}

              <Skeleton className="absolute inset-e-2 top-2 size-6 rounded-full" />
            </div>
          ))}
        </div>
      </section>

      {/* Description */}
      <section className="overflow-hidden rounded-xl border bg-white">
        <div className="flex min-h-12 items-center border-b px-4">
          <Skeleton className="h-5 w-24" />
        </div>

        <div className="space-y-2 p-5">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[95%]" />
          <Skeleton className="h-4 w-[70%]" />
        </div>
      </section>

      {/* Variants */}
      <section className="overflow-hidden rounded-xl border bg-white">
        <div className="flex min-h-13 items-center justify-between border-b px-4">
          <Skeleton className="h-5 w-24" />

          <Skeleton className="h-8 w-27 rounded-md" />
        </div>

        <div className="flex flex-wrap gap-3 p-4">
          {variants.map((_, index) => (
            <VariantSkeleton key={index} />
          ))}
        </div>
      </section>
    </div>
  );
}

function VariantSkeleton() {
  return (
    <div className="w-full max-w-72 rounded-xl bg-muted/30 p-4">
      {/* Variant header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-6 rounded-full" />
          <Skeleton className="h-3 w-8" />
        </div>

        <div className="flex items-center gap-4">
          <Skeleton className="size-4" />
          <Skeleton className="size-4" />
        </div>
      </div>

      {/* Details */}
      <div className="mt-6 space-y-3">
        <VariantRow />
        <VariantRow />
        <VariantRow />
        <VariantRow />
      </div>
    </div>
  );
}

function VariantRow() {
  return (
    <div className="flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-12" />
    </div>
  );
}
