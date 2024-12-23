import { useState, useEffect } from 'react';
import { useChatAPI } from './useChatAPI';
import { toast } from 'sonner';

export const useAPISwitch = () => {
  const { apiSettings, getDefaultProvider } = useChatAPI();
  const [currentAPI, setCurrentAPI] = useState<string | null>(null);

  useEffect(() => {
    if (!currentAPI && apiSettings) {
      const defaultProvider = getDefaultProvider();
      if (defaultProvider) {
        setCurrentAPI(defaultProvider);
        toast.success(`Using ${defaultProvider.toUpperCase()} as the default provider`);
      } else {
        toast.error("Please configure an API provider in settings");
      }
    }
  }, [apiSettings, currentAPI, getDefaultProvider]);

  const handleSwitchAPI = (provider: string) => {
    setCurrentAPI(provider);
    toast.success(`Now using ${provider.toUpperCase()} as the provider`);
  };

  return {
    currentAPI,
    handleSwitchAPI
  };
};