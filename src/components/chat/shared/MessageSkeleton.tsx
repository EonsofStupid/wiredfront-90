
import React from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageRole } from '@/types/chat/enums';

interface MessageSkeletonProps {
  role?: MessageRole;
  lines?: number;
  className?: string;
}

export function MessageSkeleton({ role = 'assistant', lines = 3, className }: MessageSkeletonProps) {
  const isUser = role === 'user';
  
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
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton 
            key={i} 
            className={cn("h-4", i === lines - 1 && lines > 1 ? "w-[80%]" : "w-full")} 
          />
        ))}
      </div>
    </div>
  );
}
