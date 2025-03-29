
import { useState, useEffect, useCallback } from 'react';
import { useTokenStore } from '@/stores/token';
import { useChatBridge } from '@/modules/ChatBridge';
import { TokenEnforcementMode } from '@/components/chat/types/chat/enums';
import { TokenAnalytics, TokenResetConfig } from '@/types/token';
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
  const [analytics, setAnalytics] = useState<TokenAnalytics | null>(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);

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
          
          // Apply other token settings if available
          if (userSettings.tokens.limit) {
            tokenStore.updateTokenSettings({ limit: userSettings.tokens.limit });
          }
          
          if (userSettings.tokens.resetDate) {
            tokenStore.setResetDate(userSettings.tokens.resetDate);
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
  const addTokens = useCallback(async (amount: number, reason?: string) => {
    try {
      // Update local store first for immediate feedback
      await tokenStore.addTokens(amount, reason || "add");
      
      // Sync with bridge
      await chatBridge.updateTokens(amount, { reason: reason || "add" });
      
      return true;
    } catch (error) {
      console.error('Failed to add tokens:', error);
      toast.error('Failed to add tokens');
      return false;
    }
  }, [tokenStore, chatBridge]);

  // Spend tokens with bridge sync
  const spendTokens = useCallback(async (amount: number, reason?: string) => {
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
      await tokenStore.spendTokens(amount, reason || "spend");
      
      // Sync with bridge
      await chatBridge.updateTokens(-amount, { reason: reason || "spend" });
      
      return true;
    } catch (error) {
      console.error('Failed to spend tokens:', error);
      toast.error('Failed to spend tokens');
      return false;
    }
  }, [tokenStore, chatBridge]);

  // Set tokens to specific value
  const setTokens = useCallback(async (amount: number, reason?: string) => {
    try {
      // Update local store first for immediate feedback
      await tokenStore.setTokens(amount, reason || "set");
      
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
    warningThreshold?: number,
    limit?: number,
    resetDate?: string | null,
    tokensPerQuery?: number,
    freeQueryLimit?: number
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
      
      if (settings.limit !== undefined) {
        tokenStore.updateTokenSettings({ limit: settings.limit });
      }
      
      if (settings.resetDate !== undefined) {
        tokenStore.setResetDate(settings.resetDate);
      }
      
      if (settings.tokensPerQuery !== undefined) {
        tokenStore.updateTokenSettings({ tokensPerQuery: settings.tokensPerQuery });
      }
      
      if (settings.freeQueryLimit !== undefined) {
        tokenStore.updateTokenSettings({ freeQueryLimit: settings.freeQueryLimit });
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

  // Configure token reset schedule
  const configureResetSchedule = useCallback(async (config: TokenResetConfig) => {
    try {
      const success = await tokenStore.configureReset(config);
      if (success) {
        toast.success('Token reset schedule updated');
        
        // Sync with bridge
        await chatBridge.updateChatSettings({
          tokens: {
            resetFrequency: config.frequency,
            nextResetDate: config.nextResetDate
          }
        });
      }
      return success;
    } catch (error) {
      console.error('Failed to configure reset schedule:', error);
      toast.error('Failed to configure token reset schedule');
      return false;
    }
  }, [tokenStore, chatBridge]);

  // Load analytics data
  const loadAnalytics = useCallback(async () => {
    setIsLoadingAnalytics(true);
    try {
      const data = await tokenStore.getUsageAnalytics();
      setAnalytics(data);
      return data;
    } catch (error) {
      console.error('Failed to load analytics:', error);
      toast.error('Failed to load token analytics');
      return null;
    } finally {
      setIsLoadingAnalytics(false);
    }
  }, [tokenStore]);

  // Forecast usage for specified days
  const forecastUsage = useCallback(async (days: number) => {
    try {
      return await tokenStore.forecastUsage(days);
    } catch (error) {
      console.error('Failed to forecast usage:', error);
      return {
        projectedTokens: 0,
        projectedCost: 0,
        depletion: false
      };
    }
  }, [tokenStore]);

  // Compute derived values
  const usagePercent = tokenStore.limit ? Math.min(100, ((tokenStore.used || 0) / tokenStore.limit) * 100) : 0;
  const isLowBalance = tokenStore.limit ? (tokenStore.balance / tokenStore.limit) < 0.1 : tokenStore.balance < 5;

  // Reset tokens
  const resetTokens = useCallback(async () => {
    try {
      const success = await tokenStore.resetTokens();
      if (success) {
        toast.success('Tokens have been reset');
      }
      return success;
    } catch (error) {
      console.error('Failed to reset tokens:', error);
      toast.error('Failed to reset tokens');
      return false;
    }
  }, [tokenStore]);

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
    queriesUsed: tokenStore.queriesUsed,
    freeQueryLimit: tokenStore.freeQueryLimit,
    tokensPerQuery: tokenStore.tokensPerQuery,
    totalEarned: tokenStore.totalEarned,
    totalSpent: tokenStore.totalSpent,
    usageByProvider: tokenStore.usageByProvider,
    usageByFeature: tokenStore.usageByFeature,
    resetDate: tokenStore.resetDate,
    nextResetDate: tokenStore.nextResetDate,
    resetFrequency: tokenStore.resetFrequency,
    tier: tokenStore.tier,
    analytics,
    isLoadingAnalytics,
    
    // Actions
    addTokens,
    spendTokens,
    setTokens,
    updateSettings,
    configureResetSchedule,
    loadAnalytics,
    forecastUsage,
    resetTokens,
    
    // Store methods for advanced usage
    getUsageTrends: tokenStore.getUsageTrends,
    getCostBreakdown: tokenStore.getCostBreakdown
  };
};

export default useTokens;
