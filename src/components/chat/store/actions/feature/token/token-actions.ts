
import { TokenEnforcementMode } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
import { FeatureKey } from '../types';
import { ChatProvider } from '../../../types/chat-store-types';

export const createTokenActions = (set: any, get: any) => ({
  setTokenEnforcementMode: (mode: TokenEnforcementMode) => {
    set(
      (state: any) => ({
        tokenControl: {
          ...state.tokenControl,
          enforcementMode: mode
        }
      }),
      false,
      { type: 'setTokenEnforcementMode', mode }
    );

    // Log the mode change
    logger.info(`Token enforcement mode set to: ${mode}`);
  },

  addTokens: async (amount: number) => {
    try {
      set(
        (state: any) => ({
          tokenControl: {
            ...state.tokenControl,
            balance: state.tokenControl.balance + amount
          }
        }),
        false,
        { type: 'addTokens', amount }
      );

      // Log token addition
      logger.info(`Added ${amount} tokens to balance`);

      // Record token addition in database
      await recordTokenTransaction('add', amount, {
        reason: 'manual_add',
      });

      return true;
    } catch (error) {
      logger.error('Failed to add tokens', { error });
      return false;
    }
  },

  spendTokens: async (amount: number) => {
    const state = get();
    const { enforcementMode, balance } = state.tokenControl;

    // If there's no enforcement, spending always succeeds
    if (enforcementMode === 'never') {
      logger.info('Token spending bypassed due to enforcement mode: never');
      return true;
    }

    // Check if user has enough tokens (but only if enforcement is active)
    if (enforcementMode === 'always' && balance < amount) {
      logger.warn(`Token spend blocked: Requested ${amount}, balance ${balance}`);
      return false;
    }

    // Handle role-based enforcement
    if (enforcementMode === 'mode_based') {
      // Implementation depends on the current mode
      // For example, different modes might have different rules
      const { activeMode } = state;
      if (activeMode === 'training' && balance < amount * 2) {
        logger.warn(`Training mode token spend blocked: Requested ${amount}, balance ${balance}`);
        return false; 
      }
    }

    // If we get here, spending is allowed
    try {
      set(
        (state: any) => ({
          tokenControl: {
            ...state.tokenControl,
            balance: state.tokenControl.balance - amount
          }
        }),
        false, 
        { type: 'spendTokens', amount }
      );

      // Record token spending in database
      await recordTokenTransaction('spend', amount, {
        reason: 'api_usage',
      });

      return true;
    } catch (error) {
      logger.error('Failed to spend tokens', { error });
      return false;
    }
  },

  setTokenBalance: async (amount: number) => {
    try {
      set(
        (state: any) => ({
          tokenControl: {
            ...state.tokenControl,
            balance: amount
          }
        }),
        false,
        { type: 'setTokenBalance', amount }
      );

      // Record token balance update in database
      await recordTokenTransaction('set', amount, {
        reason: 'admin_adjustment',
      });

      return true;
    } catch (error) {
      logger.error('Failed to set token balance', { error });
      return false;
    }
  },
});

// Record token transactions to the database
async function recordTokenTransaction(
  transactionType: 'add' | 'spend' | 'set',
  amount: number,
  metadata: Record<string, any> = {}
) {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData?.session) return;

    const userId = sessionData.session.user.id;

    await supabase.from('token_transaction_log').insert({
      user_id: userId,
      amount: transactionType === 'spend' ? -amount : amount,
      transaction_type: transactionType,
      description: `${transactionType} ${amount} tokens`,
      metadata
    });
  } catch (error) {
    logger.error('Failed to record token transaction', { error });
  }
}
