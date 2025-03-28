
import React from 'react';
import { ImageIcon } from 'lucide-react';

export const ImageMode = () => {
  return (
    <div className="flex items-center gap-2 text-purple-400">
      <ImageIcon className="h-4 w-4" />
      <span className="text-sm font-medium">Image Mode</span>
    </div>
  );
};
