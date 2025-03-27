
import React from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface MessageSkeletonProps {
  isUser?: boolean;
  className?: string;
}

export function MessageSkeleton({ isUser = false, className }: MessageSkeletonProps) {
  return (
    <div 
      className={cn(
        'flex flex-col p-4 rounded-lg w-full max-w-[80%]',
        isUser ? 'self-end' : 'self-start',
        isUser ? 'bg-primary/20' : 'bg-muted',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-3 w-10" />
      </div>
      <div className="space-y-2 mt-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[90%]" />
        <Skeleton className="h-4 w-[80%]" />
      </div>
    </div>
  );
}
