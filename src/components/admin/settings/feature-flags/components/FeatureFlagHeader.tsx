
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface FeatureFlagHeaderProps {
  onCreateFlag: () => void;
  isSuperAdmin: boolean;
}

export function FeatureFlagHeader({ onCreateFlag, isSuperAdmin }: FeatureFlagHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Feature Flags</h2>
        <p className="text-muted-foreground">Manage feature availability across the application.</p>
      </div>
      {isSuperAdmin && (
        <Button onClick={onCreateFlag}>
          <Plus className="h-4 w-4 mr-2" />
          New Feature Flag
        </Button>
      )}
    </div>
  );
}
