import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSessionStore } from '@/stores/session/store';

export const useChatAPI = () => {
  const [isConfigured, setIsConfigured] = useState(false);
  const user = useSessionStore((state) => state.user);

  useEffect(() => {
    const checkConfiguration = async () => {
      if (!user) {
        setIsConfigured(false);
        return;
      }

      const { data, error } = await supabase
        .from('api_configurations')
        .select('is_enabled')
        .eq('user_id', user.id)
        .eq('is_default', true)
        .single();

      setIsConfigured(!!data?.is_enabled);
    };

    checkConfiguration();
  }, [user]);

  return { isConfigured };
};