
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { LogsHeader } from "./LogsHeader";
import { LogsFilterBar } from "./LogsFilterBar";
import { LogsTabs } from "./LogsTabs";
import { LogsLoadingState } from "./LogsLoadingState";
import { LogsErrorState } from "./LogsErrorState";
import { LogsEmptyState } from "./LogsEmptyState";
import { LogsTable } from "./LogsTable";
import { useSystemLogs } from "./useSystemLogs";

export function SystemLogsPanel() {
  const {
    logs,
    filteredLogs,
    isLoading,
    error,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    sourceFilter,
    setSourceFilter,
    uniqueSources,
    sortDirection,
    expandedLogId,
    fetchLogs,
    handleClearLogs,
    downloadLogs,
    toggleSortDirection,
    toggleExpandLog
  } = useSystemLogs();
  
  return (
    <Card className="col-span-3">
      <LogsHeader />
      
      <CardContent>
        <div className="space-y-4">
          <LogsFilterBar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sourceFilter={sourceFilter}
            setSourceFilter={setSourceFilter}
            uniqueSources={uniqueSources}
            sortDirection={sortDirection}
            toggleSortDirection={toggleSortDirection}
            fetchLogs={fetchLogs}
            downloadLogs={downloadLogs}
            handleClearLogs={handleClearLogs}
            isLoading={isLoading}
            filteredLogs={filteredLogs}
            logs={logs}
          />
          
          <LogsTabs 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
          />
          
          <TabsContent value={activeTab} className="mt-0">
            {isLoading ? (
              <LogsLoadingState />
            ) : error ? (
              <LogsErrorState error={error} />
            ) : filteredLogs.length === 0 ? (
              <LogsEmptyState logsExist={logs.length > 0} />
            ) : (
              <LogsTable 
                logs={filteredLogs} 
                expandedLogId={expandedLogId}
                toggleExpandLog={toggleExpandLog}
              />
            )}
          </TabsContent>
        </div>
      </CardContent>
    </Card>
  );
}
