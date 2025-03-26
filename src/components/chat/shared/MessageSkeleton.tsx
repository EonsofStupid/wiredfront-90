
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface MessageSkeletonProps {
  role?: 'user' | 'assistant';
  lines?: number;
  className?: string;
}

export const MessageSkeleton: React.FC<MessageSkeletonProps> = ({ 
  role = 'assistant', 
  lines = 3,
  className 
}) => {
  const isUser = role === 'user';
  
  return (
    <div 
      className={cn(
        'flex flex-col gap-2 p-4 rounded-lg max-w-[85%] animate-pulse',
        isUser ? 'chat-message-user ml-auto' : 'chat-message-assistant',
        className
      )}
    >
      <div className="flex items-center gap-2">
        {!isUser && <Skeleton className="h-6 w-6 rounded-full" />}
        <Skeleton className="h-4 w-24" />
      </div>
      
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton 
            key={i} 
            className={cn(
              'h-4',
              i === lines - 1 && lines > 1 ? 'w-[70%]' : 'w-full'
            )} 
          />
        ))}
      </div>
    </div>
  );
};
