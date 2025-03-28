
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface SessionSkeletonProps {
  count?: number;
}

const SessionSkeleton = ({ count = 3 }: ChatSessionSkeletonProps) => {
  return (
    <div className="space-y-3 p-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-3 rounded-md flex justify-between items-center">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-[70%]" />
            <Skeleton className="h-3 w-[40%]" />
          </div>
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      ))}
    </div>
  );
};

export default ChatSessionSkeleton;
