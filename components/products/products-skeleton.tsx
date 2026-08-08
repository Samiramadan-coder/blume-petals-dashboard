import { Skeleton } from "@/components/ui/skeleton";

const rows = Array.from({ length: 9 });

export default function ProductsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-11 w-26 rounded-lg" />
        <Skeleton className="h-5 w-32" />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row">
          <Skeleton className="h-10 w-full sm:w-56 rounded-lg" />
          <Skeleton className="h-10 w-full sm:w-36 rounded-lg" />
        </div>

        <Skeleton className="h-10 w-29 rounded-lg" />
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-xl border border-border p-4">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="mt-3 h-8 w-12" />
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border">
        <div className="overflow-x-auto">
          <div className="min-w-300">
            {/* Table header */}
            <div className="grid grid-cols-[40px_96px_340px_150px_235px_210px_110px_110px_130px] items-center gap-3 border-b bg-muted/20 px-4 py-4">
              <Skeleton className="size-4 rounded-sm" />

              <Skeleton className="h-4 w-12" />

              <Skeleton className="h-4 w-12" />

              <Skeleton className="h-4 w-20" />

              <Skeleton className="h-4 w-20" />

              <Skeleton className="h-4 w-14" />

              <Skeleton className="h-4 w-14" />

              <Skeleton className="h-4 w-14" />

              <Skeleton className="h-4 w-16" />
            </div>

            {/* Rows */}
            {rows.map((_, index) => (
              <div
                key={index}
                className="grid min-h-18 grid-cols-[40px_96px_340px_150px_235px_210px_110px_110px_130px] items-center gap-3 border-b px-4 py-3 last:border-b-0"
              >
                {/* Checkbox */}
                <Skeleton className="size-4 rounded-sm" />

                {/* Photo */}
                <Skeleton className="size-12 rounded-lg" />

                {/* Name */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-38" />
                  <Skeleton className="h-3 w-22" />
                </div>

                {/* Category */}
                <Skeleton className="h-4 w-24" />

                {/* Price */}
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>

                {/* Stock */}
                <div className="flex gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-15 rounded-full" />
                    <Skeleton className="h-3 w-12" />
                  </div>

                  {index < 3 && (
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-15 rounded-full" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                  )}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <Skeleton className="size-4 rounded-full" />
                  <Skeleton className="h-4 w-12" />
                </div>

                {/* Status */}
                <Skeleton className="h-5 w-9 rounded-full" />

                {/* Actions */}
                <div className="flex items-center gap-5">
                  <Skeleton className="size-4" />
                  <Skeleton className="size-4" />
                  <Skeleton className="size-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
