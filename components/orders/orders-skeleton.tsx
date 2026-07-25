import { Skeleton } from "../ui/skeleton";

export default function OrdersSkeleton() {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
      </div>

      <div className="flex justify-between gap-4 mt-6">
        <div className="space-y-2">
          <Skeleton className="h-6 w-50" />
          <Skeleton className="h-6 w-30" />
        </div>
        <Skeleton className="h-12 w-40" />
      </div>

      <div className="space-y-2 mt-6">
        {Array.from({ length: 10 }).map((_, index) => (
          <Skeleton className="h-12" key={index} />
        ))}
      </div>
    </div>
  );
}
