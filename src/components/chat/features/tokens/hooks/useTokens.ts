
import { useCallback } from 'react';
import { useTokenStore } from '@/components/chat/store/token';
import { useChatBridge } from '@/components/chat/chatBridge';
import { TokenEnforcementMode } from '@/types/chat/enums';
import { toast } from 'sonner';

/**
 * Hook to manage token operations
 */
export const useTokens = () => {
  const { 
    balance, 
    enforcementMode, 
    isEnforcementEnabled,
    tokensPerQuery,
    freeQueryLimit,
    queriesUsed,
    lastUpdated
  } = useTokenStore();
  
  const chatBridge = useChatBridge();
  
  // Add tokens to the user's balance
  const addTokens = useCallback(async (amount: number) => {
    if (amount <= 0) {
      toast.error('Token amount must be positive');
      return false;
    }
    
    const success = await chatBridge.updateTokens(amount, 'add');
    if (success) {
      toast.success(`Added ${amount} tokens to your balance`);
    }
    return success;
  }, [chatBridge]);
  
  // Spend tokens from the user's balance
  const spendTokens = useCallback(async (amount: number) => {
    if (amount <= 0) {
      toast.error('Token amount must be positive');
      return false;
    }
    
    if (balance < amount && isEnforcementEnabled && enforcementMode !== 'never' && enforcementMode !== 'warn') {
      toast.error('Not enough tokens');
      return false;
    }
    
    const success = await chatBridge.updateTokens(amount, 'spend');
    if (success) {
      toast.success(`Spent ${amount} tokens`);
    }
    return success;
  }, [chatBridge, balance, isEnforcementEnabled, enforcementMode]);
  
  // Set token balance to a specific amount
  const setTokenBalance = useCallback(async (amount: number) => {
    if (amount < 0) {
      toast.error('Token balance cannot be negative');
      return false;
    }
    
    const success = await chatBridge.updateTokens(amount, 'set');
    if (success) {
      toast.success(`Set token balance to ${amount}`);
    }
    return success;
  }, [chatBridge]);
  
  // Set token enforcement mode
  const setEnforcementMode = useCallback((mode: TokenEnforcementMode) => {
    return chatBridge.updateChatSettings({ tokenEnforcementMode: mode });
  }, [chatBridge]);
  
  // Toggle token enforcement
  const toggleEnforcement = useCallback(() => {
    return chatBridge.toggleFeature('tokenEnforcement');
  }, [chatBridge]);
  
  // Check if user has enough tokens for an operation
  const hasEnoughTokens = useCallback((amount: number) => {
    if (!isEnforcementEnabled || enforcementMode === 'never' || enforcementMode === 'warn') {
      return true;
    }
    return balance >= amount;
  }, [balance, isEnforcementEnabled, enforcementMode]);
  
  // Check if the enforcement is active
  const isEnforcementActive = useCallback(() => {
    return isEnforcementEnabled && enforcementMode !== 'never';
  }, [isEnforcementEnabled, enforcementMode]);
  
  return {
    // State
    balance,
    enforcementMode,
    isEnforcementEnabled,
    tokensPerQuery,
    freeQueryLimit,
    queriesUsed,
    lastUpdated,
    
    // Actions
    addTokens,
    spendTokens,
    setTokenBalance,
    setEnforcementMode,
    toggleEnforcement,
    hasEnoughTokens,
    isEnforcementActive
  };
};
