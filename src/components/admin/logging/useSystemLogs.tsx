
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export interface SystemLog {
  id: string;
  timestamp: string;
  level: string;
  source: string;
  message: string;
  metadata: any | null;
  user_id: string | null;
}

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
      // Use any type here since the system_logs table may not be in the types yet
      let query = supabase
        .from('system_logs')
        .select('*') as any;
      
      // Sort by timestamp
      query = query.order('timestamp', { ascending: sortDirection === 'asc' });
      
      // Limit to the most recent 250 logs
      query = query.limit(250);
      
      const { data, error: fetchError } = await query;
      
      if (fetchError) throw fetchError;
      
      if (data) {
        setLogs(data as SystemLog[]);
        
        // Extract unique sources for the filter
        const sources = [...new Set(data.map((log: SystemLog) => log.source))];
        setUniqueSources(sources);
      }
    } catch (err) {
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
      const { error: deleteError } = await supabase
        .from('system_logs')
        .delete()
        .not('id', 'is', null) as any; // Type assertion to avoid type issues
      
      if (deleteError) throw deleteError;
      
      setLogs([]);
      setFilteredLogs([]);
    } catch (err) {
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
