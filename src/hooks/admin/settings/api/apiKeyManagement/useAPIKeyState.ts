
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { APIConfiguration } from "../useAPIKeyManagement";

export const useAPIKeyState = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [configurations, setConfigurations] = useState<APIConfiguration[]>([]);
  
  const fetchConfigurations = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('manage-api-secret', {
        body: { action: 'list' }
      });
      
      if (error) throw error;
      
      if (data && data.configurations) {
        setConfigurations(data.configurations);
      }
    } catch (error) {
      console.error('Error fetching API configurations:', error);
      toast.error("Failed to fetch API configurations");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigurations();
  }, []);

  return {
    isLoading,
    setIsLoading,
    configurations,
    setConfigurations,
    fetchConfigurations
  };
};
