
import { TokenState, SetState, GetState } from '../types';
import { updateUserTokens, logTokenTransaction } from './token-utils';
import { TokenEnforcementMode } from '@/types/chat/enums';
import { logger } from '@/services/chat/LoggingService';

/**
 * Creates token actions for the token store
 */
export const createTokenActions = (
  set: SetState<TokenState>,
  get: GetState<TokenState>
) => ({
  // Set token enforcement mode
  setEnforcementMode: (mode: TokenEnforcementMode) => {
    logger.info('Setting token enforcement mode', { mode });
    set({ enforcementMode: mode }, false, { type: 'tokens/setEnforcementMode', mode });
  },
  
  // Toggle token enforcement
  toggleEnforcement: () => {
    const isEnabled = get().isEnforcementEnabled;
    logger.info('Toggling token enforcement', { current: isEnabled, new: !isEnabled });
    set({ isEnforcementEnabled: !isEnabled }, false, { type: 'tokens/toggleEnforcement' });
  },
  
  // Set token enforcement enabled/disabled
  setEnforcementEnabled: (enabled: boolean) => {
    logger.info('Setting token enforcement enabled', { enabled });
    set({ isEnforcementEnabled: enabled }, false, { type: 'tokens/setEnforcementEnabled', enabled });
  },
  
  // Add tokens to user's balance
  addTokens: async (amount: number): Promise<boolean> => {
    try {
      if (amount <= 0) {
        logger.warn('Invalid token amount for addition', { amount });
        return false;
      }
      
      const result = await updateUserTokens(amount);
      if (result) {
        set({
          balance: get().balance + amount,
          lastUpdated: new Date().toISOString()
        }, false, { type: 'tokens/add', amount });
        
        // Log the transaction
        await logTokenTransaction(amount, 'add', 'Tokens added via token store');
        return true;
      }
      return false;
    } catch (error) {
      logger.error('Failed to add tokens', { error, amount });
      return false;
    }
  },
  
  // Spend tokens from user's balance
  spendTokens: async (amount: number): Promise<boolean> => {
    try {
      if (amount <= 0) {
        logger.warn('Invalid token amount for spending', { amount });
        return false;
      }
      
      const { balance, enforcementMode, isEnforcementEnabled } = get();
      
      // If enforcement is disabled or mode is 'never', don't enforce token spending
      if (!isEnforcementEnabled || enforcementMode === 'never') {
        logger.info('Token enforcement disabled or set to never, allowing operation', { 
          isEnforcementEnabled, 
          enforcementMode 
        });
        return true;
      }
      
      // Check if user has enough tokens
      if (balance < amount) {
        logger.warn('Insufficient tokens', { 
          required: amount, 
          available: balance,
          mode: enforcementMode
        });
        
        // If mode is 'warn', allow the action but warn
        if (enforcementMode === 'warn') {
          return true;
        }
        
        return false;
      }
      
      // Update token balance
      const result = await updateUserTokens(-amount);
      if (result) {
        set({
          balance: Math.max(0, balance - amount), // Ensure we don't go below 0
          queriesUsed: get().queriesUsed + 1,
          lastUpdated: new Date().toISOString()
        }, false, { type: 'tokens/spend', amount });
        
        // Log the transaction
        await logTokenTransaction(-amount, 'spend', 'Tokens spent via token store');
        return true;
      }
      return false;
    } catch (error) {
      logger.error('Failed to spend tokens', { error, amount });
      return false;
    }
  },
  
  // Set token balance directly
  setTokenBalance: async (amount: number): Promise<boolean> => {
    try {
      if (amount < 0) {
        logger.warn('Invalid token balance', { amount });
        return false;
      }
      
      const currentBalance = get().balance;
      const difference = amount - currentBalance;
      
      const result = await updateUserTokens(amount, true);
      if (result) {
        set({
          balance: amount,
          lastUpdated: new Date().toISOString()
        }, false, { type: 'tokens/setBalance', amount });
        
        // Log the transaction
        await logTokenTransaction(difference, 'set', 'Token balance set via token store');
        return true;
      }
      return false;
    } catch (error) {
      logger.error('Failed to set token balance', { error, amount });
      return false;
    }
  },
  
  // Reset token state
  resetTokenState: () => {
    logger.info('Resetting token state');
    set({
      balance: 0,
      enforcementMode: 'never',
      lastUpdated: null,
      tokensPerQuery: 1,
      freeQueryLimit: 5,
      queriesUsed: 0,
      isEnforcementEnabled: false
    }, false, { type: 'tokens/reset' });
  }
});
