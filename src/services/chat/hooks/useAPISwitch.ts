import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAPISwitch = () => {
  const [currentAPI, setCurrentAPI] = useState<string>('openai');

  const handleSwitchAPI = useCallback(async (provider: string) => {
    try {
      const { error } = await supabase
        .from('api_configurations')
        .update({ is_default: true })
        .eq('api_type', provider);

      if (error) throw error;
      setCurrentAPI(provider);
      toast.success(`Switched to ${provider} API`);
    } catch (error) {
      toast.error('Failed to switch API provider');
      console.error('API switch error:', error);
    }
  }, []);

  return { currentAPI, handleSwitchAPI };
};