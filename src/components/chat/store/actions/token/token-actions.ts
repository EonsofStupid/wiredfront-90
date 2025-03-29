
import { ChatState } from '../../types/chat-store-types';
import { SetState, GetState } from '../feature/types';

/**
 * Create token-related actions for the chat store
 */
export const createTokenActions = (
  set: SetState<ChatState>,
  get: GetState<ChatState>
) => ({
  /**
   * Set the current token balance
   */
  setTokenBalance: (balance: number) => {
    set({ tokenBalance: balance });
  },
  
  /**
   * Deduct tokens from the balance
   */
  deductTokens: (amount: number) => {
    const currentBalance = get().tokenBalance || 0;
    const newBalance = Math.max(0, currentBalance - amount);
    
    set({ tokenBalance: newBalance });
    
    return newBalance;
  },
  
  /**
   * Add tokens to the balance
   */
  addTokens: (amount: number) => {
    const currentBalance = get().tokenBalance || 0;
    const newBalance = currentBalance + amount;
    
    set({ tokenBalance: newBalance });
    
    return newBalance;
  }
});

export type TokenActions = ReturnType<typeof createTokenActions>;
