
import { useState, useEffect } from "react";
import { useAPIOperation } from "./apiKeyManagement/useAPIOperation";

export function useGitHubMetricsSync() {
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [isAutoSyncEnabled, setIsAutoSyncEnabled] = useState(false);
  const { isProcessing, syncGitHubMetrics } = useAPIOperation({
    successMessage: "GitHub metrics synced successfully",
    errorMessage: "Failed to sync GitHub metrics"
  });

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isAutoSyncEnabled) {
      // Set up auto-sync every 5 minutes
      interval = setInterval(() => {
        syncGitHubMetrics().then(() => {
          setLastSynced(new Date());
        });
      }, 5 * 60 * 1000); // 5 minutes
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isAutoSyncEnabled, syncGitHubMetrics]);

  const manualSync = async () => {
    const success = await syncGitHubMetrics();
    if (success) {
      setLastSynced(new Date());
    }
    return success;
  };

  const toggleAutoSync = () => {
    setIsAutoSyncEnabled(!isAutoSyncEnabled);
  };

  return {
    lastSynced,
    isAutoSyncEnabled,
    toggleAutoSync,
    manualSync,
    isSyncing: isProcessing
  };
}
