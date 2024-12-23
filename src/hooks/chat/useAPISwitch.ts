import { useState, useEffect, useCallback } from 'react';
import { useChatAPI } from './useChatAPI';
import { toast } from 'sonner';

export const useAPISwitch = () => {
  const { apiSettings, getDefaultProvider } = useChatAPI();
  const [currentAPI, setCurrentAPI] = useState<string | null>(null);
  const [hasShownToast, setHasShownToast] = useState(false);

  const initializeAPI = useCallback(() => {
    if (!currentAPI && apiSettings) {
      const defaultProvider = getDefaultProvider();
      if (defaultProvider) {
        console.log('Setting default API provider:', defaultProvider);
        setCurrentAPI(defaultProvider);
        if (!hasShownToast) {
          toast.success(`Using ${defaultProvider.toUpperCase()} as the default provider`);
          setHasShownToast(true);
        }
      } else if (!hasShownToast) {
        console.warn('No API provider configured');
        toast.error("Please configure an API provider in settings");
        setHasShownToast(true);
      }
    }
  }, [apiSettings, currentAPI, getDefaultProvider, hasShownToast]);

  useEffect(() => {
    initializeAPI();
  }, [initializeAPI]);

  const handleSwitchAPI = useCallback((provider: string) => {
    if (apiSettings?.[provider.toLowerCase()]) {
      setCurrentAPI(provider);
      toast.success(`Now using ${provider.toUpperCase()} as the provider`);
    } else {
      toast.error(`${provider.toUpperCase()} API is not configured`);
    }
  }, [apiSettings]);

  return {
    currentAPI,
    handleSwitchAPI,
    availableAPIs: apiSettings ? Object.keys(apiSettings) : []
  };
};