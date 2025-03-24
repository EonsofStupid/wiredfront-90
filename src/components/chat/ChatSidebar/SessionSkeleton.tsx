
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

interface SessionSkeletonProps {
  count?: number;
}

export const SessionSkeleton: React.FC<SessionSkeletonProps> = ({ count = 3 }) => {
  return (
    <div className="space-y-3 p-3 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col space-y-2 p-3 rounded-md bg-black/20">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24 rounded-md" />
            <Skeleton className="h-4 w-4 rounded-full" />
          </div>
          <Skeleton className="h-3 w-1/2 rounded-md" />
          <div className="flex justify-between items-center mt-1">
            <Skeleton className="h-3 w-16 rounded-md" />
            <Skeleton className="h-5 w-5 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SessionSkeleton;
