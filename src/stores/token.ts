
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
import { TokenState, TokenActions, TokenStore, TokenUpdateParams } from '@/types/token';
import { TokenEnforcementMode } from '@/types/chat/enums';
import { toast } from 'sonner';

// Define initial token state
const initialState: Omit<TokenState, keyof TokenActions> = {
  balance: 0,
  used: 0,
  limit: 0,
  lastUpdated: new Date().toISOString(),
  tokensPerQuery: 1,
  queriesUsed: 0,
  freeQueryLimit: 5,
  enforcementMode: TokenEnforcementMode.Never,
  enforcementEnabled: false,
  isEnforcementEnabled: false
};

/**
 * Create the token store with Zustand
 */
export const useTokenStore = create<TokenStore>((set, get) => ({
  ...initialState,

  /**
   * Add tokens to the user's balance
   */
  addTokens: async (amount: number, reason?: string): Promise<boolean> => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        throw new Error('User not authenticated');
      }
      
      const currentBalance = get().balance;
      const newBalance = currentBalance + amount;
      
      // Update the database
      const { error } = await supabase
        .from('user_tokens')
        .upsert({
          user_id: userData.user.id,
          balance: newBalance,
          updated_at: new Date().toISOString(),
          last_updated: new Date().toISOString()
        });
      
      if (error) {
        throw error;
      }
      
      // Log the transaction
      await supabase.from('token_transactions').insert({
        user_id: userData.user.id,
        amount,
        transaction_type: 'add',
        description: reason || 'Manual token addition',
        metadata: { source: 'token_store', timestamp: new Date().toISOString() }
      });
      
      // Update the store
      set({
        balance: newBalance,
        lastUpdated: new Date().toISOString()
      });
      
      logger.info('Added tokens', { amount, newBalance, reason });
      
      return true;
    } catch (error) {
      logger.error('Failed to add tokens', { error, amount, reason });
      toast.error('Failed to add tokens');
      return false;
    }
  },
  
  /**
   * Spend tokens from the user's balance
   */
  spendTokens: async (amount: number, reason?: string): Promise<boolean> => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        throw new Error('User not authenticated');
      }
      
      const currentBalance = get().balance;
      
      // Check if user has enough tokens based on enforcement mode
      if (currentBalance < amount) {
        if (get().enforcementMode === TokenEnforcementMode.Hard) {
          logger.warn('Insufficient tokens for hard enforcement', { 
            currentBalance, 
            requestedAmount: amount 
          });
          toast.error('Insufficient token balance');
          return false;
        }
        // In soft or warn mode, we'll continue but log the issue
        logger.warn('Insufficient tokens but allowing due to enforcement mode', {
          currentBalance,
          requestedAmount: amount,
          enforcementMode: get().enforcementMode
        });
        
        if (get().enforcementMode === TokenEnforcementMode.Soft) {
          toast.warning('Low token balance. Features may be degraded.');
        }
      }
      
      const newBalance = Math.max(0, currentBalance - amount);
      const newQueriesUsed = get().queriesUsed + 1;
      
      // Update the database
      const { error } = await supabase
        .from('user_tokens')
        .upsert({
          user_id: userData.user.id,
          balance: newBalance,
          queries_used: newQueriesUsed,
          updated_at: new Date().toISOString(),
          last_updated: new Date().toISOString()
        });
      
      if (error) {
        throw error;
      }
      
      // Log the transaction
      await supabase.from('token_transactions').insert({
        user_id: userData.user.id,
        amount: -amount,
        transaction_type: 'spend',
        description: reason || 'Token expenditure',
        metadata: { source: 'token_store', timestamp: new Date().toISOString() }
      });
      
      // Update the store
      set({
        balance: newBalance,
        queriesUsed: newQueriesUsed,
        lastUpdated: new Date().toISOString()
      });
      
      logger.info('Spent tokens', { amount, newBalance, reason });
      
      return true;
    } catch (error) {
      logger.error('Failed to spend tokens', { error, amount, reason });
      toast.error('Failed to spend tokens');
      return false;
    }
  },
  
  /**
   * Set the token balance to a specific value
   */
  setTokenBalance: async (amount: number): Promise<boolean> => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        throw new Error('User not authenticated');
      }
      
      // Update the database
      const { error } = await supabase
        .from('user_tokens')
        .upsert({
          user_id: userData.user.id,
          balance: amount,
          updated_at: new Date().toISOString(),
          last_updated: new Date().toISOString()
        });
      
      if (error) {
        throw error;
      }
      
      // Log the transaction
      await supabase.from('token_transactions').insert({
        user_id: userData.user.id,
        amount,
        transaction_type: 'set',
        description: 'Set token balance',
        metadata: { source: 'token_store', timestamp: new Date().toISOString() }
      });
      
      // Update the store
      set({
        balance: amount,
        lastUpdated: new Date().toISOString()
      });
      
      logger.info('Set token balance', { amount });
      
      return true;
    } catch (error) {
      logger.error('Failed to set token balance', { error, amount });
      toast.error('Failed to set token balance');
      return false;
    }
  },
  
  /**
   * Set tokens (alias for setTokenBalance for compatibility)
   */
  setTokens: async (amount: number, reason?: string): Promise<boolean> => {
    return await get().setTokenBalance(amount);
  },
  
  /**
   * Set the enforcement mode
   */
  setEnforcementMode: (mode: TokenEnforcementMode) => {
    logger.info('Setting token enforcement mode', { mode });
    
    set({
      enforcementMode: mode,
      enforcementEnabled: mode !== TokenEnforcementMode.Never, // Enable enforcement if not "never"
      isEnforcementEnabled: mode !== TokenEnforcementMode.Never
    });
    
    // Also update in the database if user is authenticated
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        supabase
          .from('user_tokens')
          .upsert({
            user_id: data.user.id,
            enforcement_mode: mode,
            updated_at: new Date().toISOString()
          })
          .then(({ error }) => {
            if (error) {
              logger.error('Failed to update enforcement mode in DB', { error });
            }
          });
      }
    });
  },
  
  /**
   * Set whether token enforcement is enabled
   */
  setEnforcementEnabled: (enabled: boolean) => {
    logger.info('Setting token enforcement enabled', { enabled });
    
    set({
      enforcementEnabled: enabled,
      isEnforcementEnabled: enabled,
      // If enabling enforcement, set mode to 'warn' if it was 'none'
      enforcementMode: enabled && get().enforcementMode === TokenEnforcementMode.Never 
        ? TokenEnforcementMode.Warn 
        : get().enforcementMode
    });
  },
  
  /**
   * Initialize token data
   */
  initialize: async (): Promise<void> => {
    logger.info('Initializing token data');
    
    try {
      set({ isLoading: true });
      
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        logger.warn('No authenticated user when initializing tokens');
        set({ isLoading: false });
        return;
      }
      
      const { data, error } = await supabase
        .from('user_tokens')
        .select('*')
        .eq('user_id', userData.user.id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No record exists, create default
          const defaultTokenData = {
            user_id: userData.user.id,
            balance: 100,
            used: 0,
            limit: 1000,
            queries_used: 0,
            free_query_limit: 5,
            tokens_per_query: 1,
            enforcement_mode: TokenEnforcementMode.Never,
            updated_at: new Date().toISOString(),
            last_updated: new Date().toISOString(),
            created_at: new Date().toISOString()
          };
          
          await supabase.from('user_tokens').insert(defaultTokenData);
          
          set({
            balance: defaultTokenData.balance,
            used: defaultTokenData.used,
            limit: defaultTokenData.limit,
            queriesUsed: defaultTokenData.queries_used,
            freeQueryLimit: defaultTokenData.free_query_limit,
            tokensPerQuery: defaultTokenData.tokens_per_query,
            enforcementMode: defaultTokenData.enforcement_mode,
            enforcementEnabled: false,
            isEnforcementEnabled: false,
            lastUpdated: defaultTokenData.updated_at,
            isLoading: false
          });
          
          logger.info('Created default token record', { defaultTokenData });
          return;
        }
        throw error;
      }
      
      if (data) {
        set({
          id: data.id,
          balance: data.balance,
          used: data.used,
          limit: data.limit,
          resetDate: data.reset_date,
          queriesUsed: data.queries_used || 0,
          freeQueryLimit: data.free_query_limit || 5,
          tokensPerQuery: data.tokens_per_query || 1,
          enforcementMode: data.enforcement_mode || TokenEnforcementMode.Never,
          enforcementEnabled: data.enforcement_mode !== TokenEnforcementMode.Never,
          isEnforcementEnabled: data.enforcement_mode !== TokenEnforcementMode.Never,
          lastUpdated: data.last_updated || data.updated_at,
          isLoading: false
        });
        
        logger.info('Token data loaded', { 
          balance: data.balance, 
          enforcementMode: data.enforcement_mode
        });
      }
    } catch (error) {
      logger.error('Error initializing token data', { error });
      set({ isLoading: false, error: error as Error });
    }
  },
  
  /**
   * Fetch token data from the database
   */
  fetchTokenData: async (): Promise<void> => {
    await get().initialize();
  },
  
  /**
   * Reset token balance
   */
  resetTokens: async (): Promise<boolean> => {
    try {
      const defaultBalance = 1000; // Default balance for reset
      
      set({
        balance: defaultBalance,
        used: 0,
        queriesUsed: 0,
        lastUpdated: new Date().toISOString()
      });
      
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        return false;
      }
      
      const { error } = await supabase
        .from('user_tokens')
        .upsert({
          user_id: userData.user.id,
          balance: defaultBalance,
          used: 0,
          queries_used: 0,
          updated_at: new Date().toISOString(),
          last_updated: new Date().toISOString()
        });
      
      if (error) {
        throw error;
      }
      
      logger.info('Reset token balance', { newBalance: defaultBalance });
      toast.success('Token balance has been reset');
      
      return true;
    } catch (error) {
      logger.error('Failed to reset tokens', { error });
      toast.error('Failed to reset tokens');
      return false;
    }
  },
  
  /**
   * Reset queries used counter
   */
  resetQueriesUsed: () => {
    logger.info('Resetting queries used counter');
    
    set({
      queriesUsed: 0
    });
    
    // Update in database if user is authenticated
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        supabase
          .from('user_tokens')
          .upsert({
            user_id: data.user.id,
            queries_used: 0,
            updated_at: new Date().toISOString()
          })
          .then(({ error }) => {
            if (error) {
              logger.error('Failed to reset queries used in DB', { error });
            }
          });
      }
    });
  },
  
  /**
   * Update token settings
   */
  updateTokenSettings: (settings: Partial<TokenState>) => {
    logger.info('Updating token settings', { settings });
    
    set({ ...settings });
    
    // Update in database if user is authenticated
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        const dbSettings: TokenUpdateParams = {};
        
        if (settings.balance !== undefined) dbSettings.balance = settings.balance;
        if (settings.used !== undefined) dbSettings.used = settings.used;
        if (settings.limit !== undefined) dbSettings.limit = settings.limit;
        if (settings.resetDate !== undefined) dbSettings.reset_date = settings.resetDate;
        if (settings.enforcementMode !== undefined) dbSettings.enforcement_mode = settings.enforcementMode;
        if (settings.queriesUsed !== undefined) dbSettings.queries_used = settings.queriesUsed;
        if (settings.freeQueryLimit !== undefined) dbSettings.free_query_limit = settings.freeQueryLimit;
        if (settings.tokensPerQuery !== undefined) dbSettings.tokens_per_query = settings.tokensPerQuery;
        
        if (Object.keys(dbSettings).length > 0) {
          supabase
            .from('user_tokens')
            .upsert({
              user_id: data.user.id,
              ...dbSettings,
              updated_at: new Date().toISOString()
            })
            .then(({ error }) => {
              if (error) {
                logger.error('Failed to update token settings in DB', { error });
              }
            });
        }
      }
    });
  },
  
  /**
   * Set token warning threshold
   */
  setWarningThreshold: (percent: number) => {
    logger.info('Setting token warning threshold', { percent });
    
    set({ warningThreshold: percent });
  },
  
  /**
   * Set token reset date
   */
  setResetDate: (date: string | null) => {
    logger.info('Setting token reset date', { date });
    
    set({ resetDate: date });
    
    // Update in database if user is authenticated
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        supabase
          .from('user_tokens')
          .upsert({
            user_id: data.user.id,
            reset_date: date,
            updated_at: new Date().toISOString()
          })
          .then(({ error }) => {
            if (error) {
              logger.error('Failed to update reset date in DB', { error });
            }
          });
      }
    });
  },
  
  /**
   * Set token balance directly
   */
  setBalance: (amount: number) => {
    logger.info('Setting token balance directly', { amount });
    
    set({ balance: amount });
  }
}));

/**
 * Clear token store state
 * Used for logout and testing
 */
export const clearTokenStore = () => {
  useTokenStore.setState({ ...initialState });
};

/**
 * Fetch token balance from the database
 * Can be used to refresh the token balance
 */
export const fetchTokenBalance = async (): Promise<number | null> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      logger.warn('No authenticated user found when fetching token balance');
      return null;
    }
    
    const { data, error } = await supabase
      .from('user_tokens')
      .select('balance')
      .eq('user_id', userData.user.id)
      .single();
    
    if (error) {
      logger.error('Failed to fetch token balance', { error });
      return null;
    }
    
    if (data) {
      useTokenStore.setState({ 
        balance: data.balance,
        lastUpdated: new Date().toISOString()
      });
      return data.balance;
    }
    
    return null;
  } catch (error) {
    logger.error('Error fetching token balance', { error });
    return null;
  }
};
