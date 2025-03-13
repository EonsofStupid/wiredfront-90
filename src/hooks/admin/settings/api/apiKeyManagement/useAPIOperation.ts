
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/services/chat/LoggingService";

interface APIOperationOptions {
  onSuccess?: () => Promise<void>;
  errorMessage?: string;
  successMessage?: string;
}

export const useAPIOperation = (options: APIOperationOptions = {}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const executeOperation = async (action: string, data: any) => {
    setIsProcessing(true);
    try {
      logger.info(`Executing API operation: ${action}`, { action, data: { ...data, secretValue: '[REDACTED]' } });
      
      const { data: response, error } = await supabase.functions.invoke('manage-api-secret', {
        body: { 
          action,
          ...data 
        }
      });
      
      if (error) {
        logger.error(`API operation error: ${error.message}`, { action, error });
        toast.error(options.errorMessage || `Operation failed: ${error.message}`);
        throw error;
      }
      
      logger.info(`API operation successful: ${action}`, { action, response: { ...response, secretValue: undefined } });
      
      if (options.successMessage) {
        toast.success(options.successMessage);
      }
      
      if (options.onSuccess) {
        await options.onSuccess();
      }
      
      return true;
    } catch (error) {
      logger.error('API operation failed:', error);
      toast.error(options.errorMessage || "Operation failed");
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return { isProcessing, executeOperation };
};
