
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface SessionSkeletonProps {
  count?: number;
}

const SessionSkeleton: React.FC<SessionSkeletonProps> = ({ count = 3 }) => {
  return (
    <div className="p-2 space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="p-3 rounded-lg border border-transparent">
          <div className="flex justify-between items-start mb-2">
            <Skeleton className="h-5 w-[120px]" />
            <Skeleton className="h-4 w-14 rounded-full" />
          </div>
          <div className="flex justify-between items-center">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-8 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SessionSkeleton;
