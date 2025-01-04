import React from 'react';
import { Button } from '@/components/ui/button';
import { Minus, Maximize2, X } from 'lucide-react';
import { useAIAssistantStore } from '../core/store';

export const AIWindowControls: React.FC = () => {
  return (
    <div className="p-2 cursor-move bg-muted flex items-center justify-between">
      <span className="text-sm font-medium">AI Assistant</span>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <Minus className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <Maximize2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};