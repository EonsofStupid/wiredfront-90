import { useState, useEffect } from 'react';
import { useChatAPI } from './useChatAPI';
import { useToast } from "@/hooks/use-toast";

export const useAPISwitch = () => {
  const { toast } = useToast();
  const { apiSettings, getDefaultProvider } = useChatAPI();
  const [currentAPI, setCurrentAPI] = useState<string | null>(null);

  useEffect(() => {
    if (!currentAPI && apiSettings) {
      const defaultProvider = getDefaultProvider();
      if (defaultProvider) {
        setCurrentAPI(defaultProvider);
        toast({
          title: "API Provider Selected",
          description: `Using ${defaultProvider.toUpperCase()} as the default provider`,
        });
      } else {
        toast({
          title: "No API Provider",
          description: "Please configure an API provider in settings",
          variant: "destructive"
        });
      }
    }
  }, [apiSettings, currentAPI, getDefaultProvider, toast]);

  const handleSwitchAPI = (provider: string) => {
    setCurrentAPI(provider);
    toast({
      title: "API Provider Changed",
      description: `Now using ${provider.toUpperCase()} as the provider`,
    });
  };

  return {
    currentAPI,
    handleSwitchAPI
  };
};