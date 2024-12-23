import { useState, useEffect } from 'react';
import { useChatAPI } from './useChatAPI';
import { toast } from 'sonner';

export const useAPISwitch = () => {
  const { apiSettings, getDefaultProvider } = useChatAPI();
  const [currentAPI, setCurrentAPI] = useState<string | null>(null);
  const [hasShownToast, setHasShownToast] = useState(false);

  useEffect(() => {
    if (!currentAPI && apiSettings) {
      const defaultProvider = getDefaultProvider();
      if (defaultProvider) {
        setCurrentAPI(defaultProvider);
        // Only show success toast once when initially setting up
        if (!hasShownToast) {
          toast.success(`Using ${defaultProvider.toUpperCase()} as the default provider`);
          setHasShownToast(true);
        }
      } else if (!hasShownToast) {
        // Only show configuration needed toast once
        toast.error("Please configure an API provider in settings");
        setHasShownToast(true);
      }
    }
  }, [apiSettings, currentAPI, getDefaultProvider, hasShownToast]);

  const handleSwitchAPI = (provider: string) => {
    setCurrentAPI(provider);
    toast.success(`Now using ${provider.toUpperCase()} as the provider`);
  };

  return {
    currentAPI,
    handleSwitchAPI
  };
};