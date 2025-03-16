
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';

interface FeatureFlagSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function FeatureFlagSearch({ searchQuery, onSearchChange }: FeatureFlagSearchProps) {
  return (
    <div className="flex justify-between items-center space-x-2">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search feature flags..."
          className="pl-8 bg-background"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Button variant="outline" size="icon">
        <Filter className="h-4 w-4" />
      </Button>
    </div>
  );
}
