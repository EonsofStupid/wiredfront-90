
import React from 'react';
import { cn } from '@/lib/utils';
import { MessageSquareDashed } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  title = 'No messages yet',
  description = 'Start a conversation to begin chatting.',
  actionLabel = 'Start a conversation',
  onAction,
  className
}: EmptyStateProps) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center text-center p-8',
      'h-full min-h-[200px] space-y-4',
      className
    )}>
      <div className="rounded-full bg-muted p-3">
        <MessageSquareDashed className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-md">
        {description}
      </p>
      {onAction && (
        <Button onClick={onAction} className="mt-4">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
