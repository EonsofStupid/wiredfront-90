
import { ChatState } from '../../../types/chat-store-types';
import { TokenBalance } from '@/components/chat/types/token-types';
import { logger } from '@/services/chat/LoggingService';

// Define SetState and GetState types specifically for this file
type SetState<T> = (
  partial: T | Partial<T> | ((state: T) => T | Partial<T>),
  replace?: boolean
) => void;

type GetState<T> = () => T;

/**
 * Creates token-related actions for the chat store
 */
export const createTokenActions = (
  set: SetState<ChatState>,
  get: GetState<ChatState>
) => {
  return {
    /**
     * Update the token balance
     */
    setTokenBalance: (balance: TokenBalance) => {
      logger.info('Setting token balance', { balance });
      
      set({
        tokenBalance: balance
      });
    },
    
    /**
     * Increment token balance
     */
    incrementTokens: (amount: number) => {
      logger.info(`Incrementing tokens by ${amount}`);
      
      const currentBalance = get().tokenBalance;
      
      set({
        tokenBalance: currentBalance ? {
          ...currentBalance,
          balance: currentBalance.balance + amount,
          totalEarned: currentBalance.totalEarned + amount
        } : undefined
      });
    },
    
    /**
     * Decrement token balance
     */
    decrementTokens: (amount: number) => {
      logger.info(`Decrementing tokens by ${amount}`);
      
      const currentBalance = get().tokenBalance;
      
      set({
        tokenBalance: currentBalance ? {
          ...currentBalance,
          balance: Math.max(0, currentBalance.balance - amount),
          totalSpent: currentBalance.totalSpent + amount
        } : undefined
      });
    }
  };
};
