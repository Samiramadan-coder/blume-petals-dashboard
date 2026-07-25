import { Skeleton } from "../ui/skeleton";

export default function OccasionsSkeleton() {
  return (
    <div>
      <div className="flex justify-between gap-4">
        <Skeleton className="h-12 w-30" />
        <Skeleton className="h-12 w-30" />
      </div>

      <div className="space-y-2 mt-6">
        {Array.from({ length: 10 }).map((_, index) => (
          <Skeleton className="h-12" key={index} />
        ))}
      </div>
    </div>
  );
}
