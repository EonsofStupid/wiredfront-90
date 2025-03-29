
import { useState, useEffect, useCallback } from 'react';
import { useTokenStore } from '@/stores/token';
import { useChatBridge } from '@/modules/ChatBridge';
import { TokenEnforcementMode } from '@/types/chat/enums';
import { toast } from 'sonner';
import { logger } from '@/services/chat/LoggingService';
import { EnumUtils } from '@/lib/enums/EnumUtils';

/**
 * Hook for token management in the chat interface
 */
export const useTokens = () => {
  const tokenStore = useTokenStore();
  const chatBridge = useChatBridge();
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize tokens from the bridge
  useEffect(() => {
    if (!isInitialized) {
      try {
        // Get initial token state from the bridge if available
        const bridgeState = chatBridge.getState();
        const userSettings = chatBridge.getUserSettings();
        
        if (userSettings && userSettings.tokens) {
          // Apply token settings from user settings
          tokenStore.setBalance(userSettings.tokens.balance || 0);
          
          if (userSettings.tokens.enforcementMode) {
            const mode = EnumUtils.stringToTokenEnforcementMode(userSettings.tokens.enforcementMode);
            tokenStore.setEnforcementMode(mode);
          }
        }
      } catch (error) {
        logger.error('Error initializing tokens from bridge:', error);
      } finally {
        setIsInitialized(true);
      }
    }
  }, [isInitialized, tokenStore, chatBridge]);

  // Add tokens with bridge sync
  const addTokens = useCallback(async (amount: number) => {
    try {
      // Update local store first for immediate feedback
      await tokenStore.addTokens(amount, "add");
      
      // Sync with bridge
      await chatBridge.updateTokens(amount, { reason: "add" });
      
      return true;
    } catch (error) {
      console.error('Failed to add tokens:', error);
      toast.error('Failed to add tokens');
      return false;
    }
  }, [tokenStore, chatBridge]);

  // Spend tokens with bridge sync
  const spendTokens = useCallback(async (amount: number) => {
    try {
      // Check if there are enough tokens
      if (tokenStore.balance < amount) {
        if (tokenStore.enforcementMode === TokenEnforcementMode.Hard || 
            tokenStore.enforcementMode === TokenEnforcementMode.Always || 
            tokenStore.enforcementMode === TokenEnforcementMode.Strict) {
          toast.error('Not enough tokens available');
          return false;
        }
        // In soft enforcement, we allow but warn
        toast.warning('You have exceeded your token limit');
      }
      
      // Update local store first for immediate feedback
      await tokenStore.spendTokens(amount, "spend");
      
      // Sync with bridge
      await chatBridge.updateTokens(-amount, { reason: "spend" });
      
      return true;
    } catch (error) {
      console.error('Failed to spend tokens:', error);
      toast.error('Failed to spend tokens');
      return false;
    }
  }, [tokenStore, chatBridge]);

  // Set tokens to specific value
  const setTokens = useCallback(async (amount: number) => {
    try {
      // Update local store first for immediate feedback
      await tokenStore.setTokens(amount, "set");
      
      // Sync with bridge
      await chatBridge.updateTokens(amount, { reason: "set" });
      
      return true;
    } catch (error) {
      console.error('Failed to set tokens:', error);
      toast.error('Failed to set tokens');
      return false;
    }
  }, [tokenStore, chatBridge]);

  // Update token settings
  const updateSettings = useCallback(async (settings: { 
    enforcementMode?: TokenEnforcementMode | string, 
    warningThreshold?: number 
  }) => {
    try {
      const updatedSettings: any = { ...settings };
      
      if (settings.enforcementMode !== undefined) {
        const mode = EnumUtils.stringToTokenEnforcementMode(settings.enforcementMode);
        tokenStore.setEnforcementMode(mode);
        updatedSettings.enforcementMode = mode;
      }
      
      if (settings.warningThreshold !== undefined) {
        tokenStore.setWarningThreshold(settings.warningThreshold);
      }
      
      // Sync with bridge
      await chatBridge.updateChatSettings({ 
        tokens: updatedSettings
      });
      
      return true;
    } catch (error) {
      console.error('Failed to update token settings:', error);
      toast.error('Failed to update token settings');
      return false;
    }
  }, [tokenStore, chatBridge]);

  // Compute derived values
  const usagePercent = tokenStore.limit ? Math.min(100, ((tokenStore.used || 0) / tokenStore.limit) * 100) : 0;
  const isLowBalance = tokenStore.limit ? (tokenStore.balance / tokenStore.limit) < 0.1 : tokenStore.balance < 5;

  return {
    // State
    balance: tokenStore.balance,
    limit: tokenStore.limit,
    used: tokenStore.used,
    enforcementMode: tokenStore.enforcementMode,
    usagePercent,
    isLowBalance,
    isTokensExhausted: tokenStore.balance <= 0,
    warningThreshold: tokenStore.warningThreshold,
    tokenLimit: tokenStore.limit,
    
    // Actions
    addTokens,
    spendTokens,
    setTokens,
    updateSettings
  };
};
