
import { TokenState, TokenActionParams, SetState, GetState } from '../types';
import { TokenEnforcementMode } from '@/types/chat/enums';
import { updateUserTokens, logTokenTransaction } from './token-utils';
import { logger } from '@/services/chat/LoggingService';
import { toast } from 'sonner';

/**
 * Creates token-related actions for the token store
 */
export const createTokenActions = (
  set: SetState<TokenState>,
  get: GetState<TokenState>
) => ({
  /**
   * Set whether token enforcement is enabled
   */
  setEnforcementEnabled: (enabled: boolean) => {
    logger.info('Setting token enforcement enabled state', { enabled });
    
    set({
      isEnforcementEnabled: enabled
    }, false, { type: 'tokens/setEnforcementEnabled', enabled });
  },

  /**
   * Set the token enforcement mode
   */
  setEnforcementMode: (mode: TokenEnforcementMode) => {
    logger.info('Setting token enforcement mode', { mode });
    
    set({
      enforcementMode: mode
    }, false, { type: 'tokens/setEnforcementMode', mode });
  },

  /**
   * Set token balance directly
   */
  setTokenBalance: async (amount: number): Promise<boolean> => {
    try {
      // Update in the database with isDirectSet=true
      const result = await updateUserTokens(amount, true);
      
      if (result) {
        // Log the transaction
        await logTokenTransaction(amount, 'set', 'Token balance set');
        
        // Update in local state
        set({
          balance: amount,
          lastUpdated: new Date().toISOString()
        }, false, { type: 'tokens/set', amount });
        
        logger.info('Token balance set', { amount });
        return true;
      }
      
      logger.error('Failed to set token balance', { amount });
      return false;
    } catch (error) {
      logger.error('Error setting token balance', { error, amount });
      toast.error('Failed to set token balance');
      return false;
    }
  },

  /**
   * Add tokens to user's balance
   */
  addTokens: async (amount: number): Promise<boolean> => {
    try {
      if (amount <= 0) {
        logger.warn('Invalid amount for adding tokens', { amount });
        return false;
      }
      
      const currentBalance = get().balance;
      // Update in the database (not direct set)
      const result = await updateUserTokens(amount);
      
      if (result) {
        // Log the transaction
        await logTokenTransaction(amount, 'add', 'Tokens added');
        
        // Update in local state
        set({
          balance: currentBalance + amount,
          lastUpdated: new Date().toISOString()
        }, false, { type: 'tokens/add', amount });
        
        logger.info('Tokens added', { amount, newBalance: currentBalance + amount });
        return true;
      }
      
      logger.error('Failed to add tokens', { amount });
      return false;
    } catch (error) {
      logger.error('Error adding tokens', { error, amount });
      toast.error('Failed to add tokens');
      return false;
    }
  },

  /**
   * Spend tokens from user's balance
   */
  spendTokens: async (amount: number): Promise<boolean> => {
    try {
      if (amount <= 0) {
        logger.warn('Invalid amount for spending tokens', { amount });
        return false;
      }
      
      const currentBalance = get().balance;
      
      // Check if user has enough tokens based on enforcement mode
      if (currentBalance < amount) {
        const enforcementMode = get().enforcementMode;
        const isEnforcementEnabled = get().isEnforcementEnabled;
        
        // If enforcement is enabled and mode is not 'never' or 'warn', prevent spending
        if (isEnforcementEnabled && enforcementMode !== 'never' && enforcementMode !== 'warn') {
          logger.warn('Not enough tokens to spend', { 
            currentBalance, 
            amount, 
            enforcementMode 
          });
          toast.error(`Not enough tokens. You need ${amount} tokens for this operation.`);
          return false;
        }
        
        // For 'warn' mode, we'll let it proceed but log a warning
        if (enforcementMode === 'warn') {
          toast.warning(`Low token balance. This operation requires ${amount} tokens but you have ${currentBalance}.`);
        }
      }
      
      // Only deduct from the database if we have enough tokens or we're in 'never'/'warn' mode
      if (currentBalance >= amount || get().enforcementMode === 'never' || get().enforcementMode === 'warn') {
        // Update in the database
        const deductAmount = -amount; // Negative value to deduct
        const result = await updateUserTokens(deductAmount);
        
        if (result) {
          // Log the transaction
          await logTokenTransaction(amount, 'spend', 'Tokens spent');
          
          // Update in local state (don't go below 0)
          set({
            balance: Math.max(0, currentBalance - amount),
            queriesUsed: get().queriesUsed + 1,
            lastUpdated: new Date().toISOString()
          }, false, { type: 'tokens/spend', amount });
          
          logger.info('Tokens spent', { amount, newBalance: Math.max(0, currentBalance - amount) });
          return true;
        }
        
        logger.error('Failed to spend tokens', { amount });
        return false;
      }
      
      return false;
    } catch (error) {
      logger.error('Error spending tokens', { error, amount });
      toast.error('Failed to spend tokens');
      return false;
    }
  },

  /**
   * Reset token usage counter
   */
  resetQueriesUsed: () => {
    set({
      queriesUsed: 0
    }, false, { type: 'tokens/resetQueriesUsed' });
  },

  /**
   * Update token settings
   */
  updateTokenSettings: (settings: Partial<TokenState>) => {
    set({
      ...settings,
      lastUpdated: new Date().toISOString()
    }, false, { type: 'tokens/updateSettings', settings });
  }
});
