
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageRole } from '@/components/chat/types/chat/enums';

interface MessageSkeletonProps {
  role?: MessageRole;
  lines?: number;
}

export function MessageSkeleton({ 
  role = MessageRole.Assistant, 
  lines = 3 
}: MessageSkeletonProps) {
  const isUser = role === MessageRole.User;
  
  return (
    <div className={`message-skeleton ${isUser ? 'user-message' : 'assistant-message'}`}>
      <div className="skeleton-avatar">
        {!isUser && (
          <Skeleton className="h-8 w-8 rounded-full" />
        )}
      </div>
      
      <div className="skeleton-content">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton 
            key={i}
            className={`h-4 my-1 ${
              i === lines - 1 ? 'w-2/3' : 'w-full'
            }`} 
          />
        ))}
      </div>
    </div>
  );
}
