import { useState, useEffect, useCallback } from 'react';
import { useChatAPI } from './useChatAPI';
import { toast } from 'sonner';
import { useSessionStore } from '@/stores/session/store';
import { supabase } from "@/integrations/supabase/client";

export const useAPISwitch = () => {
  const { apiSettings, getDefaultProvider } = useChatAPI();
  const [currentAPI, setCurrentAPI] = useState<string | null>(null);
  const [hasShownToast, setHasShownToast] = useState(false);
  const user = useSessionStore(state => state.user);

  const initializeAPI = useCallback(async () => {
    if (!currentAPI) {
      if (user) {
        // Authenticated user flow
        const defaultProvider = getDefaultProvider();
        if (defaultProvider) {
          console.log('Setting authenticated user API provider:', defaultProvider);
          setCurrentAPI(defaultProvider);
          if (!hasShownToast) {
            toast.success(`Using ${defaultProvider.toUpperCase()} as the default provider`);
            setHasShownToast(true);
          }
        } else if (!hasShownToast) {
          console.warn('No API provider configured for authenticated user');
          toast.error("Please configure an API provider in settings");
          setHasShownToast(true);
        }
      } else {
        // Public user flow - use default OpenAI configuration
        console.log('Setting up public API access');
        const { data: publicConfig } = await supabase
          .from('api_configurations')
          .select('*')
          .eq('api_type', 'openai')
          .eq('is_default', true)
          .single();

        if (publicConfig) {
          setCurrentAPI('openai');
          if (!hasShownToast) {
            toast.success('Using public API access');
            setHasShownToast(true);
          }
        }
      }
    }
  }, [apiSettings, currentAPI, getDefaultProvider, hasShownToast, user]);

  useEffect(() => {
    initializeAPI();
  }, [initializeAPI]);

  const handleSwitchAPI = useCallback((provider: string) => {
    if (user) {
      // Only allow API switching for authenticated users
      if (apiSettings?.[provider.toLowerCase()]) {
        setCurrentAPI(provider);
        toast.success(`Now using ${provider.toUpperCase()} as the provider`);
      } else {
        toast.error(`${provider.toUpperCase()} API is not configured`);
      }
    } else {
      toast.info('Please log in to switch API providers');
    }
  }, [apiSettings, user]);

  return {
    currentAPI,
    handleSwitchAPI,
    availableAPIs: user ? (apiSettings ? Object.keys(apiSettings) : []) : ['openai']
  };
};