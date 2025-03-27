
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface MessageSkeletonProps {
  role?: 'user' | 'assistant' | 'system';
  lines?: number;
}

export function MessageSkeleton({ role = 'assistant', lines = 2 }: MessageSkeletonProps) {
  const isUser = role === 'user';
  
  return (
    <div className={cn("flex w-full my-4", isUser ? "justify-end" : "justify-start")}>
      <div className={cn(
        "max-w-[80%] px-4 py-3 rounded-lg",
        isUser ? "bg-primary/10" : "bg-card/80"
      )}>
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton 
            key={i}
            className={cn(
              "h-4 my-1",
              isUser ? "bg-primary/20" : "bg-muted/50",
              i === lines - 1 && lines > 1 ? "w-[70%]" : "w-full"
            )} 
          />
        ))}
      </div>
    </div>
  );
}
