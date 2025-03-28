
import { useState, useEffect, useCallback } from 'react';
import { useTokenStore } from '@/components/chat/store/token';
import { useChatBridge } from '@/components/chat/bridge/ChatBridgeProvider';
import { TokenEnforcementMode } from '@/types/chat/tokens';
import { toast } from 'sonner';

export const useTokens = () => {
  const tokenStore = useTokenStore();
  const chatBridge = useChatBridge();
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize tokens from the bridge
  useEffect(() => {
    if (!isInitialized) {
      // Get initial token state from the bridge if available
      const bridgeState = chatBridge.getState();
      const userSettings = chatBridge.getUserSettings();
      
      if (userSettings && userSettings.tokens) {
        // Apply token settings from user settings
        tokenStore.setBalance(userSettings.tokens.balance || 0);
        
        if (userSettings.tokens.enforcementMode) {
          tokenStore.setEnforcementMode(userSettings.tokens.enforcementMode as TokenEnforcementMode);
        }
      }
      
      setIsInitialized(true);
    }
  }, [isInitialized, tokenStore, chatBridge]);

  // Add tokens with bridge sync
  const addTokens = useCallback(async (amount: number) => {
    try {
      // Update local store first for immediate feedback
      tokenStore.addTokens(amount, "add");
      
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
        if (tokenStore.enforcementMode === TokenEnforcementMode.Hard) {
          toast.error('Not enough tokens available');
          return false;
        }
        // In soft enforcement, we allow but warn
        toast.warning('You have exceeded your token limit');
      }
      
      // Update local store first for immediate feedback
      tokenStore.spendTokens(amount, "spend");
      
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
      tokenStore.setTokens(amount, "set");
      
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
    enforcementMode?: TokenEnforcementMode, 
    warningThreshold?: number 
  }) => {
    try {
      if (settings.enforcementMode !== undefined) {
        tokenStore.setEnforcementMode(settings.enforcementMode);
      }
      
      if (settings.warningThreshold !== undefined) {
        tokenStore.setWarningThreshold(settings.warningThreshold);
      }
      
      // Sync with bridge
      await chatBridge.updateChatSettings({ 
        tokens: { ...settings } 
      });
      
      return true;
    } catch (error) {
      console.error('Failed to update token settings:', error);
      toast.error('Failed to update token settings');
      return false;
    }
  }, [tokenStore, chatBridge]);

  return {
    balance: tokenStore.balance,
    limit: tokenStore.limit,
    used: tokenStore.used,
    enforcementMode: tokenStore.enforcementMode,
    usagePercent: tokenStore.usagePercent,
    isLowBalance: tokenStore.isLowBalance,
    isTokensExhausted: tokenStore.isTokensExhausted,
    addTokens,
    spendTokens,
    setTokens,
    updateSettings
  };
};
