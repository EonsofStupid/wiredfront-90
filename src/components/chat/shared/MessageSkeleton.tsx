
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageRole } from '../types';

interface MessageSkeletonProps {
  role: MessageRole;
  lines?: number;
}

export const MessageSkeleton = ({ role, lines = 3 }: MessageSkeletonProps) => {
  const isUser = role === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex flex-col max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        <Skeleton className="h-5 w-20 mb-2" />
        <div className="space-y-2">
          {Array.from({ length: lines }).map((_, i) => (
            <Skeleton 
              key={i} 
              className={`h-4 ${i === lines - 1 && lines > 1 ? 'w-32' : 'w-64'}`} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};
