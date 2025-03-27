
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface MessageSkeletonProps {
  role: 'user' | 'assistant' | 'system';
  lines?: number;
  className?: string;
}

export function MessageSkeleton({ role, lines = 2, className }: MessageSkeletonProps) {
  const baseClass = role === 'user' 
    ? 'chat-message-user-skeleton' 
    : role === 'system' 
      ? 'chat-message-system-skeleton' 
      : 'chat-message-assistant-skeleton';

  const widths = [
    'w-3/4', 'w-2/3', 'w-4/5', 'w-5/6', 'w-2/3'
  ];

  return (
    <div 
      className={cn(
        "flex w-full mb-4",
        role === "user" ? "justify-end" : "justify-start",
        className
      )}
    >
      <div 
        className={cn(
          "max-w-[80%] px-4 py-3 rounded-md",
          baseClass
        )}
      >
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            className={cn(
              "h-4 mb-2",
              widths[i % widths.length],
              i === lines - 1 && "mb-0"
            )}
          />
        ))}
      </div>
    </div>
  );
}
