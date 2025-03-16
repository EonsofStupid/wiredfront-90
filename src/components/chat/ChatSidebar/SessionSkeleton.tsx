
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface SessionSkeletonProps {
  count?: number;
}

const SessionSkeleton = ({ count = 3 }: SessionSkeletonProps) => {
  return (
    <div className="space-y-3 p-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col space-y-2 p-3 border border-white/5 rounded-md animate-pulse">
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-10" />
          </div>
          <Skeleton className="h-3 w-32" />
          <div className="flex justify-between items-center">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-8" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SessionSkeleton;
