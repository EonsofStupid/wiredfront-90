
import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SessionHeaderProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
}

export const SessionHeader = ({ title, isOpen, onToggle }: SessionHeaderProps) => {
  return (
    <div className="p-4 border-b flex justify-between items-center">
      <h2 className="text-lg font-semibold">{title}</h2>
      <Button variant="ghost" size="sm" onClick={onToggle}>
        {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </Button>
    </div>
  );
};
