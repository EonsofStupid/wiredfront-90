
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { APIType } from "@/types/admin/settings/api";

export type APIConfiguration = {
  id: string;
  api_type: APIType;
  memorable_name: string;
  is_enabled: boolean;
  is_default: boolean;
  validation_status: string;
  feature_bindings?: string[];
  last_validated?: string;
  provider_settings?: any;
  usage_metrics?: any;
  rag_preference?: string;
  planning_mode?: string;
  role_assignments?: string[];
  user_assignments?: string[];
  created_at?: string;
};

export const useAPIKeyManagement = () => {
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

  const createApiKey = async (
    provider: APIType,
    memorableName: string,
    secretValue: string,
    settings: {
      feature_bindings: string[];
      rag_preference: string;
      planning_mode: string;
    },
    roleBindings: string[],
    userBindings: string[] = []
  ) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('manage-api-secret', {
        body: {
          action: 'create',
          secretValue,
          provider,
          memorableName,
          settings,
          roleBindings,
          userBindings
        }
      });
      
      if (error) throw error;
      
      toast.success("API key saved successfully");
      await fetchConfigurations();
      return true;
    } catch (error) {
      console.error('Error saving API key:', error);
      toast.error("Failed to save API key");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteConfig = async (configId: string) => {
    if (!window.confirm('Are you sure you want to delete this API configuration?')) {
      return false;
    }

    setIsLoading(true);
    try {
      const config = configurations.find(c => c.id === configId);
      if (!config) {
        throw new Error('Configuration not found');
      }

      const { data, error } = await supabase.functions.invoke('manage-api-secret', {
        body: {
          action: 'delete',
          memorableName: config.memorable_name
        }
      });
      
      if (error) throw error;
      
      toast.success("API configuration deleted successfully");
      await fetchConfigurations();
      return true;
    } catch (error) {
      console.error('Error deleting API configuration:', error);
      toast.error("Failed to delete API configuration");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const validateConfig = async (configId: string) => {
    setIsLoading(true);
    try {
      const config = configurations.find(c => c.id === configId);
      if (!config) {
        throw new Error('Configuration not found');
      }

      const { data, error } = await supabase.functions.invoke('manage-api-secret', {
        body: {
          action: 'validate',
          memorableName: config.memorable_name
        }
      });
      
      if (error) throw error;
      
      toast.success("API key validated successfully");
      await fetchConfigurations();
      return true;
    } catch (error) {
      console.error('Error validating API key:', error);
      toast.error("Failed to validate API key");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigurations();
  }, []);

  return {
    isLoading,
    configurations,
    fetchConfigurations,
    createApiKey,
    deleteConfig,
    validateConfig
  };
};
