
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/services/chat/LoggingService";

interface UseAPIOperationOptions {
  onSuccess?: () => Promise<void>;
  successMessage?: string;
  errorMessage?: string;
}

export const useAPIOperation = (options: UseAPIOperationOptions = {}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  
  const executeOperation = async (action: string, data: Record<string, any>) => {
    setIsProcessing(true);
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
      
      if (options.successMessage) {
        toast.success(options.successMessage);
      }
      
      if (options.onSuccess) {
        await options.onSuccess();
      }
      
      logger.info(`API operation completed: ${action}`, result);
      return true;
    } catch (error) {
      logger.error(`API operation failed: ${action}`, error);
      toast.error(options.errorMessage || `Operation failed: ${error.message}`);
      return false;
    } finally {
      setIsProcessing(false);
    }
  };
  
  return {
    isProcessing,
    executeOperation
  };
};
