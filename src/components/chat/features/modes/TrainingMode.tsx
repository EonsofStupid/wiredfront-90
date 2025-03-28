
import React from 'react';
import { GraduationCap } from 'lucide-react';

export const TrainingMode = () => {
  return (
    <div className="flex items-center gap-2 text-orange-400">
      <GraduationCap className="h-4 w-4" />
      <span className="text-sm font-medium">Training Mode</span>
    </div>
  );
};
