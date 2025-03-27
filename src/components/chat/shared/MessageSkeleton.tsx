
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface MessageSkeletonProps {
  role: 'user' | 'assistant';
  lines?: number;
}

export function MessageSkeleton({ role, lines = 2 }: MessageSkeletonProps) {
  return (
    <div
      className={cn(
        "flex w-full mb-4",
        role === "user" ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] px-4 py-3 rounded-lg animate-pulse",
          role === "user" 
            ? "chat-message-user" 
            : "chat-message-assistant"
        )}
      >
        <div className="space-y-2">
          {Array.from({ length: lines }).map((_, i) => (
            <Skeleton 
              key={i} 
              className={cn(
                "h-4 rounded", 
                i === lines - 1 && lines > 1 ? "w-2/3" : "w-full",
                role === "user" 
                  ? "bg-primary/20" 
                  : "bg-muted"
              )} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}
