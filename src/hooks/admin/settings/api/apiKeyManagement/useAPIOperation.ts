
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/services/chat/LoggingService";

interface UseAPIOperationOptions {
  onSuccess?: () => Promise<void>;
  successMessage?: string;
  errorMessage?: string;
  retryCount?: number;
}

export const useAPIOperation = (options: UseAPIOperationOptions = {}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastError, setLastError] = useState<Error | null>(null);
  
  const executeOperation = async (action: string, data: Record<string, any>) => {
    setIsProcessing(true);
    setLastError(null);
    
    try {
      logger.info(`Executing API operation: ${action}`, data);
      
      const { data: result, error } = await supabase.functions.invoke('manage-api-secret', {
        body: { 
          action,
          ...data
        }
      });
      
      if (error) {
        throw error;
      }
      
      if (!result?.success) {
        // Handle API-specific errors that come in the result
        throw new Error(result?.message || 'Operation failed with no specific error message');
      }
      
      if (options.successMessage) {
        toast.success(options.successMessage);
      }
      
      if (options.onSuccess) {
        await options.onSuccess();
      }
      
      logger.info(`API operation completed: ${action}`, result);
      return true;
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      setLastError(errorObj);
      
      logger.error(`API operation failed: ${action}`, error);
      toast.error(options.errorMessage || `Operation failed: ${errorObj.message}`);
      return false;
    } finally {
      setIsProcessing(false);
    }
  };
  
  return {
    isProcessing,
    lastError,
    executeOperation
  };
};
