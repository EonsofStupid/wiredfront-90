
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface SessionHeaderProps {
  sessionCount: number;
}

export const SessionHeader = ({ sessionCount }: SessionHeaderProps) => {
  return (
    <div className="p-4 border-b">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Chat History</h2>
        <Badge variant="outline">{sessionCount}</Badge>
      </div>
      <p className="text-sm text-muted-foreground mt-1">Your recent conversations</p>
    </div>
  );
};
