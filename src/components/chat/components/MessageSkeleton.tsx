
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export interface MessageSkeletonProps {
  role?: 'user' | 'assistant';
}

export function MessageSkeleton({ role = 'assistant' }: MessageSkeletonProps) {
  return (
    <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex items-start max-w-[80%] ${role === 'user' ? 'bg-primary/10' : 'bg-muted'} rounded-lg p-3`}>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    </div>
  );
}
