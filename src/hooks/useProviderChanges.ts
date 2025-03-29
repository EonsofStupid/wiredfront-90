
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useChatStore } from '@/components/chat/store';
import { ChatProvider } from '@/components/chat/store/types/chat-store-types';
import { logger } from '@/services/chat/LoggingService';

interface ProviderChangeHistory {
  id: string;
  user_id: string;
  old_provider: string | null;
  new_provider: string;
  changed_at: string;
  reason: string | null;
}

export function useProviderChanges() {
  const { setCurrentProvider, setAvailableProviders } = useChatStore();
  const [isChanging, setIsChanging] = useState(false);
  const [changeHistory, setChangeHistory] = useState<ProviderChangeHistory[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  /**
   * Fetch provider change history
   */
  const fetchProviderChanges = useCallback(async () => {
    try {
      setIsLoadingHistory(true);
      
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        throw new Error('User not authenticated');
      }
      
      const { data, error } = await supabase
        .from('provider_change_history')
        .select('*')
        .eq('user_id', userData.user.id)
        .order('changed_at', { ascending: false });
        
      if (error) throw error;
      
      setChangeHistory(data as ProviderChangeHistory[]);
      return data as ProviderChangeHistory[];
    } catch (err) {
      logger.error('Failed to fetch provider change history', { error: err });
      return [];
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  /**
   * Change the current AI provider
   */
  const changeProvider = useCallback(async (providerId: string, reason?: string) => {
    try {
      setIsChanging(true);
      
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        throw new Error('User not authenticated');
      }
      
      // Get the provider from the database
      const { data: providerData, error: providerError } = await supabase
        .from('ai_providers')
        .select('*')
        .eq('id', providerId)
        .single();
        
      if (providerError || !providerData) {
        throw new Error('Provider not found');
      }
      
      // Get the current provider
      const { data: currentProviderData } = await supabase
        .from('user_settings')
        .select('current_provider_id')
        .eq('user_id', userData.user.id)
        .single();
      
      // Update user settings with the new provider
      const { error: updateError } = await supabase
        .from('user_settings')
        .update({ current_provider_id: providerId })
        .eq('user_id', userData.user.id);
        
      if (updateError) throw updateError;
      
      // Log the change to history
      await supabase
        .from('provider_change_history')
        .insert({
          user_id: userData.user.id,
          old_provider: currentProviderData?.current_provider_id || null,
          new_provider: providerId,
          reason: reason || null
        });
      
      // Update local store
      setCurrentProvider(providerData as ChatProvider);
      
      // Refresh history
      await fetchProviderChanges();
      
      return true;
    } catch (err) {
      logger.error('Failed to change provider', { error: err });
      return false;
    } finally {
      setIsChanging(false);
    }
  }, [fetchProviderChanges, setCurrentProvider]);

  /**
   * Roll back to a previous provider
   */
  const rollbackToProvider = useCallback(async (historyEntryId: string) => {
    try {
      setIsChanging(true);
      
      // Find the history entry
      const historyEntry = changeHistory.find(entry => entry.id === historyEntryId);
      if (!historyEntry || !historyEntry.old_provider) {
        return false;
      }
      
      // Change to the old provider
      return await changeProvider(
        historyEntry.old_provider, 
        `Rollback from ${historyEntry.new_provider}`
      );
    } catch (err) {
      logger.error('Failed to rollback provider', { error: err });
      return false;
    } finally {
      setIsChanging(false);
    }
  }, [changeHistory, changeProvider]);

  // Initial load of history
  useEffect(() => {
    fetchProviderChanges();
  }, [fetchProviderChanges]);

  return {
    isChanging,
    changeHistory,
    isLoadingHistory,
    changeProvider,
    fetchProviderChanges,
    rollbackToProvider
  };
}
