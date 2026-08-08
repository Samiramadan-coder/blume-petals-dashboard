import { Skeleton } from "@/components/ui/skeleton";

const rows = Array.from({ length: 6 });

export default function CategoriesSkeleton() {
  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex items-center gap-5">
        <Skeleton className="h-11 w-29 rounded-lg" />
        <Skeleton className="h-5 w-36" />
      </div>

      {/* Header */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Skeleton className="h-8 w-36" />
          <Skeleton className="mt-3 h-4 w-96 max-w-full" />
        </div>

        <Skeleton className="h-10 w-31 rounded-lg" />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-white">
        <div className="overflow-x-auto">
          <div className="min-w-250">
            {/* Header */}
            <div className="grid grid-cols-[60px_180px_340px_240px_230px_190px_180px] items-center border-b px-4 py-4">
              <div />

              <Skeleton className="h-4 w-14" />

              <Skeleton className="h-4 w-28" />

              <Skeleton className="h-4 w-20" />

              <Skeleton className="h-4 w-20" />

              <Skeleton className="h-4 w-16" />

              <Skeleton className="h-4 w-16" />
            </div>

            {/* Rows */}
            {rows.map((_, index) => (
              <div
                key={index}
                className="grid min-h-18 grid-cols-[60px_180px_340px_240px_230px_190px_180px] items-center border-b px-4 py-3"
              >
                {/* Drag */}
                <div className="flex justify-center">
                  <Skeleton className="h-6 w-2 rounded-full" />
                </div>

                {/* Photo */}
                <Skeleton className="size-12 rounded-lg" />

                {/* Category */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-24" />
                </div>

                {/* Products */}
                <Skeleton className="h-4 w-16" />

                {/* Visibility */}
                <Skeleton className="h-5 w-9 rounded-full" />

                {/* Status */}
                <Skeleton className="h-6 w-12 rounded-full" />

                {/* Actions */}
                <div className="flex items-center gap-5">
                  <Skeleton className="size-4" />
                  <Skeleton className="size-4" />
                </div>
              </div>
            ))}

            {/* Footer */}
            <div className="flex min-h-14 items-center justify-between px-4">
              <Skeleton className="h-4 w-32" />

              <div className="flex items-center gap-3">
                <Skeleton className="h-4 w-18" />
                <Skeleton className="size-8 rounded-lg" />
                <Skeleton className="h-4 w-12" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
