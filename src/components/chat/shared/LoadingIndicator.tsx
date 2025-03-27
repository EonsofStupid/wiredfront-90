
import React from 'react';
import { cn } from '@/lib/utils';
import { Spinner } from './Spinner';

interface LoadingIndicatorProps {
  message?: string;
  className?: string;
}

export function LoadingIndicator({
  message = 'Loading...',
  className
}: LoadingIndicatorProps) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center gap-3 p-8',
      className
    )}>
      <Spinner size="lg" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
