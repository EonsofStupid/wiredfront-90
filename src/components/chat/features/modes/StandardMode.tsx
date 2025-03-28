
import React from 'react';
import { MessageSquare } from 'lucide-react';

export const StandardMode = () => {
  return (
    <div className="flex items-center gap-2 text-green-400">
      <MessageSquare className="h-4 w-4" />
      <span className="text-sm font-medium">Chat Mode</span>
    </div>
  );
};
