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

      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4 bg-white rounded-xl overflow-hidden border border-primary/20">
        {/* Messages list */}
        <div className="border-e border-primary/20">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="w-full p-3 flex items-center gap-4 border-b border-primary/20 last:border-b-0"
            >
              <Skeleton className="size-10 shrink-0 rounded-full" />

              <div className="flex flex-col gap-2 min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <Skeleton className="h-3 w-28 max-w-full" />
                  <Skeleton className="h-2.5 w-14" />
                </div>
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        </div>

        {/* Selected message */}
        <div className="sm:col-span-2 md:col-span-3 p-4">
          <Skeleton className="h-4 w-48 max-w-full" />
        </div>
      </div>

      <div className="flex justify-center sm:justify-end gap-2">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-9" />
        <Skeleton className="h-9 w-9" />
        <Skeleton className="h-9 w-24" />
      </div>
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

/**
 * Placeholder for a row of summary/statistics cards.
 */
export function StatCardsSkeleton({
  cards,
  className,
}: {
  cards: number;
  className: string;
}) {
  return (
    <div className={cn("grid grid-cols-1 gap-4", className)}>
      {Array.from({ length: cards }, (_, index) => (
        <div
          key={index}
          className="space-y-3 rounded-xl border border-primary/20 bg-white p-4"
        >
          <div className="flex items-center justify-between gap-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="size-7 shrink-0" />
          </div>
          <Skeleton className="h-7 w-20" />
        </div>
      ))}
    </div>
  );
}

export function OrdersSkeleton() {
  return (
    <main className="space-y-6" aria-busy="true">
      <StatCardsSkeleton
        cards={5}
        className="md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
      />

      {/* Status tabs, then search and filters */}
      <div className="space-y-4">
        <Skeleton className="h-10 w-full max-w-2xl rounded-xl" />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-36" />
            <Skeleton className="h-10 w-36" />
          </div>
          <Skeleton className="h-10 w-30" />
        </div>
      </div>

      <TableSkeleton columns={9} rows={8} />
    </main>
  );
}

export function CustomersSkeleton() {
  return (
    <main className="space-y-6" aria-busy="true">
      <StatCardsSkeleton cards={4} className="md:grid-cols-2 lg:grid-cols-4" />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-4">
          <Skeleton className="h-10 w-56" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-24" />
        </div>
        <Skeleton className="h-10 w-30" />
      </div>

      <TableSkeleton columns={8} rows={10} />
    </main>
  );
}

export function SavedDesignsSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true">
      <ModuleHeaderSkeleton description={false} />
      <TableSkeleton columns={4} />
    </div>
  );
}

export function ReviewsSkeleton() {
  return (
    <main
      className="grid items-start grid-cols-1 md:grid-cols-3 gap-4"
      aria-busy="true"
    >
      <div className="md:col-span-3 space-y-4">
        <ModuleHeaderSkeleton />
        <StatCardsSkeleton
          cards={4}
          className="md:grid-cols-2 lg:grid-cols-4"
        />
      </div>

      <div className="md:col-span-2 space-y-4">
        <Skeleton className="h-20 w-full rounded-xl" />
        <CardListSkeleton cards={4} className="space-y-3" />
      </div>

      {/* Rating distribution */}
      <div className="space-y-4 rounded-xl border border-primary/20 bg-white p-8">
        <Skeleton className="h-6 w-40" />
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="flex items-center gap-4">
            <Skeleton className="h-4 w-6" />
            <Skeleton className="h-2 flex-1" />
            <Skeleton className="h-4 w-6" />
          </div>
        ))}
      </div>
    </main>
  );
}

export function CategoriesSkeleton() {
  return (
    <main className="space-y-6" aria-busy="true">
      <div className="flex gap-2 items-center">
        <Skeleton className="h-11 w-28 rounded-lg" />
        <Skeleton className="h-11 w-40 rounded-lg" />
      </div>

      <ModuleHeaderSkeleton action />
      <TableSkeleton columns={6} rows={10} />
    </main>
  );
}

/**
 * Shared by the templates, ribbons and cards tabs. The page title and the tabs
 * come from the layout, so only the add button and the table are replaced.
 */
export function TemplatesSkeleton({ columns }: { columns: number }) {
  return (
    <div className="space-y-4" aria-busy="true">
      <div className="flex justify-end">
        <Skeleton className="h-10 w-36" />
      </div>

      <TableSkeleton columns={columns} />
    </div>
  );
}

export function FlowersSkeleton() {
  return (
    <main className="space-y-6" aria-busy="true">
      <ModuleHeaderSkeleton action />
      <TableSkeleton columns={6} rows={10} />
    </main>
  );
}

export function ProductsSkeleton() {
  return (
    <main className="space-y-6" aria-busy="true">
      <div className="flex gap-2 items-center">
        <Skeleton className="h-11 w-28 rounded-lg" />
        <Skeleton className="h-11 w-40 rounded-lg" />
      </div>

      {/* Search, category filter and the add button */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-56" />
          <Skeleton className="h-10 w-48" />
        </div>
        <Skeleton className="h-10 w-36" />
      </div>

      <StatCardsSkeleton cards={4} className="md:grid-cols-2 lg:grid-cols-4" />
      <TableSkeleton columns={8} rows={10} />
    </main>
  );
}

export function ProductGallerySkeleton() {
  return (
    <main
      className="mx-auto w-full max-w-7xl space-y-6 p-4 md:p-6"
      aria-busy="true"
    >
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="size-9" />
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="aspect-square w-full rounded-xl" />
        ))}
      </div>
    </main>
  );
}

/**
 * Placeholder for a chart or list card of a given height.
 */
function PanelSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "space-y-4 rounded-xl border border-primary/30 bg-white p-4",
        className,
      )}
    >
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-full min-h-40 w-full" />
    </div>
  );
}

export function HomeSkeleton() {
  return (
    <main
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      aria-busy="true"
    >
      {Array.from({ length: 4 }, (_, index) => (
        <div
          key={index}
          className="space-y-4 rounded-xl border border-primary/30 bg-white p-4"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-7 w-24" />
            </div>
            <Skeleton className="size-9 shrink-0" />
          </div>
          <Skeleton className="h-4 w-32" />
        </div>
      ))}

      <PanelSkeleton className="h-80 md:col-span-2 lg:col-span-3" />
      <PanelSkeleton className="h-80 md:col-span-2 lg:col-span-1" />
      <PanelSkeleton className="h-72 md:col-span-2 lg:col-span-3" />
      <PanelSkeleton className="h-72 md:col-span-2 lg:col-span-1" />
      <PanelSkeleton className="h-56 md:col-span-2 lg:col-span-4" />
    </main>
  );
}

/**
 * Shared by the four report tabs. The tabs and filters stay on screen, only
 * the report body is replaced.
 */
export function ReportsSkeleton() {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
      aria-busy="true"
    >
      {Array.from({ length: 4 }, (_, index) => (
        <div
          key={index}
          className="space-y-3 rounded-xl border border-primary/30 bg-white p-4"
        >
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-7 w-24" />
          <Skeleton className="h-4 w-32" />
        </div>
      ))}

      <PanelSkeleton className="h-80 sm:col-span-2 md:col-span-4" />
      <PanelSkeleton className="h-80 sm:col-span-2" />
      <PanelSkeleton className="h-80 sm:col-span-2" />
      <PanelSkeleton className="h-64 sm:col-span-2 md:col-span-4" />
    </div>
  );
}
