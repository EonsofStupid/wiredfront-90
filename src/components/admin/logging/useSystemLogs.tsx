import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { safeDataTransform, isSystemLog, isQueryError, SystemLog, QuerySuccessResult } from "@/utils/typeUtils";
import { LogLevel, LogSource, isLogLevel, isLogSource } from "@/integrations/supabase/types/enums";
import { PostgrestResponse, PostgrestSingleResponse } from "@supabase/supabase-js";

export { type SystemLog };

export function useSystemLogs() {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<SystemLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState<string | null>(null);
  const [uniqueSources, setUniqueSources] = useState<string[]>([]);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  
  const fetchLogs = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const query = supabase
        .from('system_logs' as any)
        .select();
      
      const sortedQuery = query.order('timestamp', { ascending: sortDirection === 'asc' });
      const limitedQuery = sortedQuery.limit(250);
      
      const result = await limitedQuery;
      
      if (isQueryError(result)) {
        throw result.error;
      }
      
      // Type assertion for the response
      const typedResult = result as QuerySuccessResult<SystemLog>;
      const responseData = typedResult.data || [];
      
      // Safely transform the data to our SystemLog type
      const typedData = safeDataTransform<SystemLog>(responseData, isSystemLog);
      setLogs(typedData);
      
      // Extract unique sources for the filter
      const sources = [...new Set(typedData.map(log => log.source))];
      setUniqueSources(sources);
    } catch (err: any) {
      console.error("Error fetching logs:", err);
      setError("Failed to fetch system logs. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Apply filters
  useEffect(() => {
    let filtered = [...logs];
    
    // Filter by log level
    if (activeTab !== "all") {
      filtered = filtered.filter(log => log.level === activeTab);
    }
    
    // Filter by source
    if (sourceFilter) {
      filtered = filtered.filter(log => log.source === sourceFilter);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(query) || 
        (log.metadata && JSON.stringify(log.metadata).toLowerCase().includes(query))
      );
    }
    
    setFilteredLogs(filtered);
  }, [logs, activeTab, sourceFilter, searchQuery]);
  
  // Fetch logs on initial load and when sort changes
  useEffect(() => {
    fetchLogs();
  }, [sortDirection]);
  
  const handleClearLogs = async () => {
    if (!confirm("Are you sure you want to delete ALL system logs? This action cannot be undone.")) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Same type assertion approach for consistency
      const result = await supabase
        .from('system_logs' as any)
        .delete()
        .not('id', 'is', null);
      
      if (isQueryError(result)) {
        throw result.error;
      }
      
      setLogs([]);
      setFilteredLogs([]);
    } catch (err: any) {
      console.error("Error clearing logs:", err);
      setError("Failed to clear logs. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const downloadLogs = () => {
    const logData = JSON.stringify(filteredLogs, null, 2);
    const blob = new Blob([logData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system-logs-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc');
  };

  const toggleExpandLog = (id: string) => {
    if (expandedLogId === id) {
      setExpandedLogId(null);
    } else {
      setExpandedLogId(id);
    }
  };

  return {
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
  };
}
