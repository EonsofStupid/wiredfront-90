
import { useCallback } from 'react';
import { useChatStore } from '@/components/chat/store/chatStore';
import { useChatBridge } from '@/components/chat/chatBridge';
import { TokenEnforcementMode } from '@/types/chat/enums';
import { toast } from 'sonner';

/**
 * Hook to manage token operations
 */
export const useTokens = () => {
  const { tokenControl } = useChatStore();
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
    
    if (tokenControl.balance < amount) {
      toast.error('Not enough tokens');
      return false;
    }
    
    const success = await chatBridge.updateTokens(amount, 'spend');
    if (success) {
      toast.success(`Spent ${amount} tokens`);
    }
    return success;
  }, [chatBridge, tokenControl.balance]);
  
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
  
  // Check if user has enough tokens for an operation
  const hasEnoughTokens = useCallback((amount: number) => {
    return tokenControl.balance >= amount;
  }, [tokenControl.balance]);
  
  // Check if the enforcement is active
  const isEnforcementActive = useCallback(() => {
    return tokenControl.enforcementMode !== 'never';
  }, [tokenControl.enforcementMode]);
  
  return {
    tokenControl,
    addTokens,
    spendTokens,
    setTokenBalance,
    setEnforcementMode,
    hasEnoughTokens,
    isEnforcementActive
  };
};
