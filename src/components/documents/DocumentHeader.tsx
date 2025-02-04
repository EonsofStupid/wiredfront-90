import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Grid, List, Search } from 'lucide-react';
import { useDocumentStore } from '@/stores/documents/store';
import { Input } from '@/components/ui/input';

export const DocumentHeader = () => {
  const { view, setView, filters, setFilters } = useDocumentStore();

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search documents..."
            className="pl-10"
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setView('grid')}
          className={view === 'grid' ? 'bg-muted' : ''}
        >
          <Grid className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setView('list')}
          className={view === 'list' ? 'bg-muted' : ''}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Upload
        </Button>
      </div>
    </div>
  );
};