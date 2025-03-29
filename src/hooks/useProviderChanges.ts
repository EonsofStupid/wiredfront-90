
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/auth';
import { logger } from '@/services/chat/LoggingService';
import { useChatStore } from '@/components/chat/store/chatStore';
import { ChatProvider } from '@/components/chat/store/types/chat-store-types';

/**
 * Hook to manage and track AI provider changes
 */
export function useProviderChanges() {
  const { user } = useAuthStore();
  const { 
    currentProvider, 
    availableProviders,
    updateCurrentProvider, 
    updateAvailableProviders 
  } = useChatStore();
  const [isChanging, setIsChanging] = useState(false);
  const [changeHistory, setChangeHistory] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Fetch provider change history
  const fetchProviderChanges = useCallback(async () => {
    if (!user?.id) return;
    
    setIsLoadingHistory(true);
    try {
      const { data, error } = await supabase
        .from('provider_change_log')
        .select('*')
        .eq('user_id', user.id)
        .order('changed_at', { ascending: false })
        .limit(10);
        
      if (error) throw error;
      
      setChangeHistory(data || []);
    } catch (error) {
      logger.error('Error fetching provider changes:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  }, [user]);

  // Load history when user changes
  useEffect(() => {
    if (user?.id) {
      fetchProviderChanges();
    }
  }, [user, fetchProviderChanges]);

  /**
   * Change to a different AI provider with logging and rollback capability
   */
  const changeProvider = useCallback(
    async (newProviderId: string, reason?: string) => {
      if (!user?.id || isChanging) return false;
      
      // Find the provider in the available providers
      const provider = availableProviders.find(p => p.id === newProviderId);
      if (!provider) {
        logger.error(`Provider with ID ${newProviderId} not found`);
        return false;
      }
      
      // Store the previous provider for potential rollback
      const previousProvider = currentProvider;
      
      setIsChanging(true);
      try {
        // Update the current provider
        updateCurrentProvider(provider);
        
        // Log the change to the database
        await supabase.from('provider_change_log').insert({
          user_id: user.id,
          provider_name: provider.name,
          old_provider: previousProvider?.name,
          new_provider: provider.name,
          reason: reason || 'user_selection',
          metadata: { 
            source: 'client_app',
            old_provider_id: previousProvider?.id,
            new_provider_id: provider.id
          }
        });
        
        logger.info(`Provider changed from ${previousProvider?.name || 'none'} to ${provider.name}`, {
          oldProvider: previousProvider?.name,
          newProvider: provider.name,
          reason
        });
        
        // Refresh the change history
        fetchProviderChanges();
        
        return true;
      } catch (error) {
        logger.error('Error changing provider:', error);
        
        // Attempt to roll back to the previous provider
        if (previousProvider) {
          try {
            updateCurrentProvider(previousProvider);
            logger.info(`Rolled back to provider ${previousProvider.name} due to error`);
          } catch (rollbackError) {
            logger.error('Error rolling back provider change:', rollbackError);
          }
        }
        
        return false;
      } finally {
        setIsChanging(false);
      }
    },
    [user, isChanging, availableProviders, currentProvider, updateCurrentProvider, fetchProviderChanges]
  );

  /**
   * Roll back to a previous provider
   */
  const rollbackToProvider = useCallback(
    async (historyEntryId: string) => {
      if (!user?.id || isChanging) return false;
      
      // Find the history entry
      const entry = changeHistory.find(h => h.id === historyEntryId);
      if (!entry) {
        logger.error(`History entry with ID ${historyEntryId} not found`);
        return false;
      }
      
      // Find the old provider in available providers
      const oldProviderName = entry.old_provider;
      const oldProvider = availableProviders.find(p => p.name === oldProviderName);
      
      if (!oldProvider) {
        logger.error(`Previous provider ${oldProviderName} is no longer available`);
        return false;
      }
      
      // Change to the old provider with rollback reason
      return changeProvider(oldProvider.id, 'rollback_from_history');
    },
    [user, isChanging, changeHistory, availableProviders, changeProvider]
  );

  return {
    currentProvider,
    availableProviders,
    changeProvider,
    rollbackToProvider,
    changeHistory,
    isChanging,
    isLoadingHistory,
    fetchProviderChanges,
    refreshProviders: fetchProviderChanges
  };
}
