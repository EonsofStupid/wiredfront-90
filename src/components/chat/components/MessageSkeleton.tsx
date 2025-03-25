
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export interface MessageSkeletonProps {
  role?: 'user' | 'assistant';
  lines?: number;
}

export function MessageSkeleton({ role = 'assistant', lines = 3 }: MessageSkeletonProps) {
  return (
    <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex items-start max-w-[80%] ${role === 'user' ? 'bg-primary/10' : 'bg-muted'} rounded-lg p-3`}>
        <div className="space-y-2">
          {Array.from({ length: lines }).map((_, i) => (
            <Skeleton 
              key={i} 
              className={`h-4 w-${24 + Math.floor(Math.random() * 24)}`} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}
