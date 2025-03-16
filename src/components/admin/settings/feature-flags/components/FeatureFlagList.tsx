
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FeatureFlag } from '@/types/admin/settings/feature-flags';
import { FeatureFlagCard } from './FeatureFlagCard';

interface FeatureFlagListProps {
  flags: FeatureFlag[];
  onToggle: (flag: FeatureFlag) => void;
  onEdit: (flag: FeatureFlag) => void;
}

export function FeatureFlagList({ flags, onToggle, onEdit }: FeatureFlagListProps) {
  return (
    <ScrollArea className="h-[calc(100vh-280px)]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {flags.map((flag) => (
          <FeatureFlagCard 
            key={flag.id} 
            flag={flag} 
            onToggle={onToggle} 
            onEdit={onEdit} 
          />
        ))}
      </div>
    </ScrollArea>
  );
}
