
import { ChatState } from '../../../types/chat-store-types';
import { FeatureActions, SetState, GetState } from '../types';
import { TokenEnforcementMode } from '@/integrations/supabase/types/enums';
import { logger } from '@/services/chat/LoggingService';

export function createTokenActions(
  set: SetState<ChatState>,
  get: GetState<ChatState>
): Pick<FeatureActions, 'setTokenEnforcementMode' | 'addTokens' | 'spendTokens' | 'setTokenBalance'> {
  return {
    setTokenEnforcementMode: (mode: TokenEnforcementMode) => {
      set(
        state => ({
          tokenControl: {
            ...state.tokenControl,
            enforcementMode: mode,
            lastUpdated: new Date().toISOString()
          }
        }),
        false,
        `tokens/setEnforcementMode/${mode}`
      );
    },
    
    addTokens: async (amount: number) => {
      if (amount <= 0) {
        logger.warn('Attempted to add non-positive token amount:', amount);
        return false;
      }
      
      try {
        const currentBalance = get().tokenControl.balance;
        
        set(
          state => ({
            tokenControl: {
              ...state.tokenControl,
              balance: currentBalance + amount,
              lastUpdated: new Date().toISOString()
            }
          }),
          false,
          `tokens/add/${amount}`
        );
        
        return true;
      } catch (error) {
        logger.error('Error adding tokens:', error);
        return false;
      }
    },
    
    spendTokens: async (amount: number) => {
      if (amount <= 0) {
        logger.warn('Attempted to spend non-positive token amount:', amount);
        return false;
      }
      
      try {
        const { balance, enforcementMode, queriesUsed, freeQueryLimit } = get().tokenControl;
        
        // Check if we're enforcing token limits
        if (enforcementMode !== 'never') {
          // If we're in free query mode and haven't exhausted free queries
          if (enforcementMode === 'free-queries' && queriesUsed < freeQueryLimit) {
            set(
              state => ({
                tokenControl: {
                  ...state.tokenControl,
                  queriesUsed: queriesUsed + 1,
                  lastUpdated: new Date().toISOString()
                }
              }),
              false,
              `tokens/spend/freeQuery/${queriesUsed + 1}`
            );
            return true;
          }
          
          // Check if we have enough tokens
          if (balance < amount) {
            logger.warn(`Token spend rejected: required ${amount}, available ${balance}`);
            return false;
          }
        }
        
        // Update the balance
        set(
          state => ({
            tokenControl: {
              ...state.tokenControl,
              balance: balance - amount,
              lastUpdated: new Date().toISOString()
            }
          }),
          false,
          `tokens/spend/${amount}`
        );
        
        return true;
      } catch (error) {
        logger.error('Error spending tokens:', error);
        return false;
      }
    },
    
    setTokenBalance: async (amount: number) => {
      if (amount < 0) {
        logger.warn('Attempted to set negative token balance:', amount);
        return false;
      }
      
      try {
        set(
          state => ({
            tokenControl: {
              ...state.tokenControl,
              balance: amount,
              lastUpdated: new Date().toISOString()
            }
          }),
          false,
          `tokens/setBalance/${amount}`
        );
        
        return true;
      } catch (error) {
        logger.error('Error setting token balance:', error);
        return false;
      }
    }
  };
}
