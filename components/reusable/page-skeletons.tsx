import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

/**
 * Placeholder for ModuleHeader: title, optional description and action button.
 */
export function ModuleHeaderSkeleton({
  description = true,
  action = false,
}: {
  description?: boolean;
  action?: boolean;
}) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-4">
      <div>
        <Skeleton className="h-8 w-48" />
        {description && <Skeleton className="mt-2 h-4 w-72 max-w-full" />}
      </div>

      {action && <Skeleton className="h-10 w-36" />}
    </div>
  );
}

/**
 * Placeholder for the reorderable data table, including its footer.
 */
export function TableSkeleton({
  columns,
  rows = 6,
}: {
  columns: number;
  rows?: number;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-primary/20">
      <div className="flex items-center gap-4 border-b border-primary/20 px-4 py-3">
        <Skeleton className="size-5 shrink-0" />
        {Array.from({ length: columns }, (_, index) => (
          <Skeleton key={index} className="h-4 flex-1" />
        ))}
      </div>

      <div className="bg-white">
        {Array.from({ length: rows }, (_, rowIndex) => (
          <div
            key={rowIndex}
            className="flex items-center gap-4 border-b px-4 py-4 last:border-0"
          >
            <Skeleton className="size-5 shrink-0" />
            {Array.from({ length: columns }, (_, index) => (
              <Skeleton key={index} className="h-5 flex-1" />
            ))}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-white p-4">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-8 w-56 max-w-full" />
      </div>
    </div>
  );
}

/**
 * Placeholder for a stack of bordered cards (messages, notifications).
 */
export function CardListSkeleton({
  cards = 5,
  className,
}: {
  cards?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: cards }, (_, index) => (
        <div
          key={index}
          className="space-y-3 rounded-xl border border-primary/30 bg-white p-4"
        >
          <Skeleton className="h-4 w-56 max-w-full" />
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ))}
    </div>
  );
}

export function CountriesCitiesSkeleton() {
  return (
    <main className="space-y-6" aria-busy="true">
      <div className="flex gap-2 items-center">
        <Skeleton className="h-11 w-28 rounded-lg" />
        <Skeleton className="h-11 w-24 rounded-lg" />
      </div>

      <ModuleHeaderSkeleton description={false} action />
      <TableSkeleton columns={4} />
    </main>
  );
}

export function DeliveryPickupSkeleton() {
  return (
    <main className="space-y-6" aria-busy="true">
      <ModuleHeaderSkeleton action />
      <TableSkeleton columns={6} />
    </main>
  );
}

export function MessagesSkeleton() {
  return (
    <main className="space-y-6" aria-busy="true">
      <ModuleHeaderSkeleton />
      <CardListSkeleton />
    </main>
  );
}

export function NotificationsSkeleton() {
  return (
    <main className="space-y-6" aria-busy="true">
      <ModuleHeaderSkeleton action />
      <Skeleton className="h-10 w-72 max-w-full rounded-xl" />
      <CardListSkeleton cards={6} className="space-y-2" />
    </main>
  );
}

export function StoreSettingsSkeleton() {
  return (
    <main className="space-y-6" aria-busy="true">
      <ModuleHeaderSkeleton />

      <div className="grid max-w-xl grid-cols-2 gap-2">
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Rich text editors */}
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="space-y-2 sm:col-span-2 lg:col-span-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-48 w-full rounded-lg" />
          </div>
        ))}

        {/* Inputs */}
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}

        {/* Logo */}
        <div className="space-y-2 sm:col-span-2 lg:col-span-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-44 w-full rounded-lg" />
        </div>
      </div>

      <div className="flex justify-end">
        <Skeleton className="h-10 w-20" />
      </div>
    </main>
  );
}

export function WebsiteContentSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true">
      <Skeleton className="h-10 w-40 rounded-lg" />

      <div className="space-y-4 py-5">
        <div className="grid w-64 max-w-full grid-cols-2 gap-2">
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
        </div>

        {/* Collapsed accordion sections */}
        {Array.from({ length: 7 }, (_, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-sm border border-primary/30 bg-white p-4"
          >
            <Skeleton className="h-5 w-40" />
            <Skeleton className="size-4" />
          </div>
        ))}

        <div className="flex justify-end">
          <Skeleton className="h-10 w-28" />
        </div>
      </div>
    </div>
  );
}

export function OccasionsSkeleton() {
  return (
    <main className="space-y-6" aria-busy="true">
      <ModuleHeaderSkeleton action />
      <TableSkeleton columns={7} />
    </main>
  );
}

export function PromoCodesSkeleton() {
  return (
    <main className="space-y-6" aria-busy="true">
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="flex items-center gap-4 rounded-xl border border-primary/20 bg-white p-4"
          >
            <Skeleton className="size-11 shrink-0 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-7 w-12" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>

      {/* Search and status filters */}
      <div className="space-y-4">
        <Skeleton className="h-10 w-56 max-w-full" />
        <Skeleton className="h-10 w-96 max-w-full rounded-xl" />
      </div>

      <div className="flex justify-end">
        <Skeleton className="h-10 w-44" />
      </div>

      <TableSkeleton columns={6} />
    </main>
  );
}
