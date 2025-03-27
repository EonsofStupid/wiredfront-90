
import { ChatState } from '../../../types/chat-store-types';
import { SetState, GetState } from '../types';
import { updateUserTokens, logTokenTransaction } from './token-utils';
import { logger } from '@/services/chat/LoggingService';
import { TokenEnforcementMode } from '@/integrations/supabase/types';

/**
 * Creates token-related actions for the chat store
 */
export const createTokenActions = (
  set: SetState<ChatState>,
  get: GetState<ChatState>
) => ({
  /**
   * Set the token enforcement mode
   */
  setTokenEnforcementMode: (mode: TokenEnforcementMode) => {
    logger.info('Setting token enforcement mode', { mode });
    
    set({
      tokenControl: {
        ...get().tokenControl,
        enforcementMode: mode
      }
    }, false, { type: 'tokens/setEnforcementMode', mode });
  },

  /**
   * Add tokens to user's balance
   */
  addTokens: async (amount: number): Promise<boolean> => {
    try {
      const result = await updateUserTokens(amount);
      if (result) {
        set({
          tokenControl: {
            ...get().tokenControl,
            balance: get().tokenControl.balance + amount,
            lastUpdated: new Date().toISOString()
          }
        }, false, { type: 'tokens/add', amount });
        
        // Log the transaction
        await logTokenTransaction(amount, 'add', 'Tokens added via ChatBridge');
        return true;
      }
      return false;
    } catch (error) {
      logger.error('Failed to add tokens', { error, amount });
      return false;
    }
  },

  /**
   * Spend tokens from user's balance
   */
  spendTokens: async (amount: number): Promise<boolean> => {
    try {
      const currentBalance = get().tokenControl.balance;
      
      // If mode is 'never', don't enforce token spending
      if (get().tokenControl.enforcementMode === 'never') {
        return true;
      }
      
      // Check if user has enough tokens
      if (currentBalance < amount) {
        logger.warn('Insufficient tokens', { 
          required: amount, 
          available: currentBalance,
          mode: get().tokenControl.enforcementMode
        });
        
        // If mode is 'warn', allow the action but warn
        if (get().tokenControl.enforcementMode === 'warn') {
          return true;
        }
        
        return false;
      }
      
      // Update token balance
      const result = await updateUserTokens(-amount);
      if (result) {
        set({
          tokenControl: {
            ...get().tokenControl,
            balance: currentBalance - amount,
            queriesUsed: get().tokenControl.queriesUsed + 1,
            lastUpdated: new Date().toISOString()
          }
        }, false, { type: 'tokens/spend', amount });
        
        // Log the transaction
        await logTokenTransaction(-amount, 'spend', 'Tokens spent via ChatBridge');
        return true;
      }
      return false;
    } catch (error) {
      logger.error('Failed to spend tokens', { error, amount });
      return false;
    }
  },

  /**
   * Set token balance directly
   */
  setTokenBalance: async (amount: number): Promise<boolean> => {
    try {
      const currentBalance = get().tokenControl.balance;
      const difference = amount - currentBalance;
      
      const result = await updateUserTokens(difference, true);
      if (result) {
        set({
          tokenControl: {
            ...get().tokenControl,
            balance: amount,
            lastUpdated: new Date().toISOString()
          }
        }, false, { type: 'tokens/setBalance', amount });
        
        // Log the transaction
        await logTokenTransaction(difference, 'set', 'Token balance set via ChatBridge');
        return true;
      }
      return false;
    } catch (error) {
      logger.error('Failed to set token balance', { error, amount });
      return false;
    }
  }
});
