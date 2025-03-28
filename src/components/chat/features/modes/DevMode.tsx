
import React from 'react';
import { Code2 } from 'lucide-react';

export const DevMode = () => {
  return (
    <div className="flex items-center gap-2 text-blue-400">
      <Code2 className="h-4 w-4" />
      <span className="text-sm font-medium">Developer Mode</span>
    </div>
  );
};
