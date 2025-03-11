
import { Skeleton } from "@/components/ui/skeleton";

export function APIKeysSkeletonLoader() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-[125px] w-full rounded-lg" />
      <Skeleton className="h-[125px] w-full rounded-lg" />
    </div>
  );
}
