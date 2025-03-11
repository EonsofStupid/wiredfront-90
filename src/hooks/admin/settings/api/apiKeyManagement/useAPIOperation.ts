
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type APIOperationProps = {
  onSuccess?: () => Promise<void>;
  errorMessage: string;
  successMessage: string;
};

export const useAPIOperation = ({ onSuccess, errorMessage, successMessage }: APIOperationProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const executeOperation = async <T extends Record<string, any>>(
    action: string,
    payload: T
  ): Promise<boolean> => {
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('manage-api-secret', {
        body: {
          action,
          ...payload
        }
      });
      
      if (error) throw error;
      
      toast.success(successMessage);
      if (onSuccess) await onSuccess();
      return true;
    } catch (error) {
      console.error(`Error during ${action} operation:`, error);
      toast.error(errorMessage);
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
