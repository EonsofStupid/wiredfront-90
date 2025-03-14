
import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowDownUp, RotateCcw, Download, Trash, Search } from "lucide-react";

interface LogsFilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sourceFilter: string | null;
  setSourceFilter: (source: string | null) => void;
  uniqueSources: string[];
  sortDirection: 'asc' | 'desc';
  toggleSortDirection: () => void;
  fetchLogs: () => void;
  downloadLogs: () => void;
  handleClearLogs: () => void;
  isLoading: boolean;
  filteredLogs: any[];
  logs: any[];
}

export function LogsFilterBar({
  searchQuery,
  setSearchQuery,
  sourceFilter,
  setSourceFilter,
  uniqueSources,
  sortDirection,
  toggleSortDirection,
  fetchLogs,
  downloadLogs,
  handleClearLogs,
  isLoading,
  filteredLogs,
  logs
}: LogsFilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 justify-between">
      <div className="flex flex-1 gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search logs..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Select value={sourceFilter || ""} onValueChange={(value) => setSourceFilter(value || null)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All sources" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All sources</SelectItem>
            {uniqueSources.map(source => (
              <SelectItem key={source} value={source}>
                {source}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSortDirection}
          title={`Sort ${sortDirection === 'desc' ? 'oldest first' : 'newest first'}`}
        >
          <ArrowDownUp className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={fetchLogs}
          disabled={isLoading}
          title="Refresh logs"
        >
          <RotateCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={downloadLogs}
          disabled={filteredLogs.length === 0 || isLoading}
          title="Download logs"
        >
          <Download className="h-4 w-4" />
        </Button>
        
        <Button
          variant="destructive"
          size="icon"
          onClick={handleClearLogs}
          disabled={logs.length === 0 || isLoading}
          title="Clear all logs"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
