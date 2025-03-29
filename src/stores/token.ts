
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
import { 
  TokenState, 
  TokenActions, 
  TokenStore, 
  TokenUpdateParams, 
  TokenAnalytics,
  TokenResetConfig,
  TokenTransaction,
  TokenUsage
} from '@/types/token';
import { TokenEnforcementMode } from '@/types/chat/enums';
import { toast } from 'sonner';
import { tokenStateSchema, tokenDbSchema, tokenUpdateSchema } from '@/schemas/token';
import { validateWithZod } from '@/utils/validation';

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
  isEnforcementEnabled: false,
  usageByProvider: {},
  usageByFeature: {},
  costPerToken: 0.0001,
  totalEarned: 0,
  totalSpent: 0,
  tier: 'free',
  resetFrequency: 'monthly'
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
      const totalEarned = (get().totalEarned || 0) + amount;
      const newBalance = currentBalance + amount;
      
      // Update the database
      const { error } = await supabase
        .from('user_tokens')
        .upsert({
          user_id: userData.user.id,
          balance: newBalance,
          total_earned: totalEarned,
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
        totalEarned,
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
      const totalSpent = (get().totalSpent || 0) + amount;
      
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
      
      // Update usage statistics by provider if available
      let usageByProvider = { ...get().usageByProvider };
      let usageByFeature = { ...get().usageByFeature };
      const provider = reason?.includes(':') ? reason.split(':')[0] : undefined;
      const feature = reason?.includes(':') ? reason.split(':')[1] : undefined;
      
      if (provider) {
        usageByProvider[provider] = (usageByProvider[provider] || 0) + amount;
      }
      
      if (feature) {
        usageByFeature[feature] = (usageByFeature[feature] || 0) + amount;
      }
      
      // Update the database
      const { error } = await supabase
        .from('user_tokens')
        .upsert({
          user_id: userData.user.id,
          balance: newBalance,
          total_spent: totalSpent,
          queries_used: newQueriesUsed,
          usage_by_provider: usageByProvider,
          usage_by_feature: usageByFeature,
          updated_at: new Date().toISOString(),
          last_updated: new Date().toISOString()
        });
      
      if (error) {
        throw error;
      }
      
      // Calculate cost if cost_per_token is set
      const cost = get().costPerToken ? amount * get().costPerToken : undefined;
      
      // Log the transaction
      await supabase.from('token_transactions').insert({
        user_id: userData.user.id,
        amount: -amount,
        transaction_type: 'spend',
        description: reason || 'Token expenditure',
        metadata: { source: 'token_store', timestamp: new Date().toISOString() },
        cost,
        provider,
        feature
      });
      
      // Update the store
      set({
        balance: newBalance,
        queriesUsed: newQueriesUsed,
        totalSpent,
        usageByProvider,
        usageByFeature,
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
            created_at: new Date().toISOString(),
            total_earned: 100,
            total_spent: 0,
            cost_per_token: 0.0001,
            usage_by_provider: {},
            usage_by_feature: {},
            tier: 'free',
            reset_frequency: 'monthly'
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
            totalEarned: defaultTokenData.total_earned,
            totalSpent: defaultTokenData.total_spent,
            costPerToken: defaultTokenData.cost_per_token,
            usageByProvider: defaultTokenData.usage_by_provider,
            usageByFeature: defaultTokenData.usage_by_feature,
            tier: defaultTokenData.tier,
            resetFrequency: defaultTokenData.reset_frequency,
            isLoading: false
          });
          
          logger.info('Created default token record', { defaultTokenData });
          return;
        }
        throw error;
      }
      
      if (data) {
        // Validate data against schema
        const validData = validateWithZod(tokenDbSchema, data, {
          logErrors: true,
          showToast: false,
          context: 'User token'
        });
        
        if (!validData) {
          logger.error('Invalid token data from database', { data });
          // Still continue with the raw data since it's better than nothing
        }
        
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
          totalEarned: data.total_earned || 0,
          totalSpent: data.total_spent || 0,
          costPerToken: data.cost_per_token || 0.0001,
          dailyLimit: data.daily_limit,
          monthlyLimit: data.monthly_limit,
          nextResetDate: data.next_reset_date,
          usageByProvider: data.usage_by_provider || {},
          usageByFeature: data.usage_by_feature || {},
          tier: data.tier || 'free',
          resetFrequency: data.reset_frequency || 'monthly',
          isLoading: false
        });
        
        logger.info('Token data loaded', { 
          balance: data.balance, 
          enforcementMode: data.enforcement_mode
        });
        
        // Check if we need to do a scheduled reset
        if (data.next_reset_date) {
          const nextReset = new Date(data.next_reset_date);
          if (nextReset <= new Date()) {
            // Reset is due
            get().resetTokens();
          }
        }
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
      const resetAmount = 1000; // Default balance for reset
      const resetFrequency = get().resetFrequency || 'monthly';
      
      // Calculate next reset date based on frequency
      const nextReset = await get().scheduleNextReset(resetFrequency);
      
      set({
        balance: resetAmount,
        used: 0,
        queriesUsed: 0,
        nextResetDate: nextReset,
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
          balance: resetAmount,
          used: 0,
          queries_used: 0,
          next_reset_date: nextReset,
          updated_at: new Date().toISOString(),
          last_updated: new Date().toISOString()
        });
      
      if (error) {
        throw error;
      }
      
      // Log the transaction
      await supabase.from('token_transactions').insert({
        user_id: userData.user.id,
        amount: resetAmount,
        transaction_type: 'reset',
        description: `Scheduled ${resetFrequency} reset`,
        metadata: { previous_balance: get().balance }
      });
      
      logger.info('Reset token balance', { newBalance: resetAmount, nextResetDate: nextReset });
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
    
    // Validate settings against schema
    const validatedSettings = validateWithZod(
      tokenStateSchema.partial(), 
      settings,
      { 
        logErrors: true,
        showToast: false,
        context: 'Token settings'
      }
    );
    
    if (!validatedSettings) {
      toast.error('Invalid token settings');
      return;
    }
    
    set({ ...validatedSettings });
    
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
        if (settings.costPerToken !== undefined) dbSettings.cost_per_token = settings.costPerToken;
        if (settings.dailyLimit !== undefined) dbSettings.daily_limit = settings.dailyLimit;
        if (settings.monthlyLimit !== undefined) dbSettings.monthly_limit = settings.monthlyLimit;
        if (settings.nextResetDate !== undefined) dbSettings.next_reset_date = settings.nextResetDate;
        if (settings.usageByProvider !== undefined) dbSettings.usage_by_provider = settings.usageByProvider;
        if (settings.usageByFeature !== undefined) dbSettings.usage_by_feature = settings.usageByFeature;
        if (settings.tier !== undefined) dbSettings.tier = settings.tier;
        if (settings.resetFrequency !== undefined) dbSettings.reset_frequency = settings.resetFrequency;
        
        // Validate update params
        const validatedParams = validateWithZod(tokenUpdateSchema, dbSettings, {
          logErrors: true,
          showToast: false,
          context: 'Token update params'
        });
        
        if (!validatedParams) {
          logger.error('Invalid token update parameters', { dbSettings });
          return;
        }
        
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
    if (percent < 0 || percent > 100) {
      logger.error('Invalid warning threshold, must be between 0-100', { percent });
      return;
    }
    
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
  },
  
  /**
   * Configure token reset schedule
   */
  configureReset: async (config: TokenResetConfig): Promise<boolean> => {
    logger.info('Configuring token reset schedule', { config });
    
    try {
      // Calculate next reset date based on frequency
      let nextResetDate: string | null = null;
      
      if (config.frequency !== 'never') {
        const now = new Date();
        let nextReset = new Date(now);
        
        if (config.frequency === 'daily') {
          // Next day
          nextReset.setDate(nextReset.getDate() + 1);
          nextReset.setHours(0, 0, 0, 0);
        } else if (config.frequency === 'weekly') {
          // Next occurrence of the specified day of week
          const currentDay = now.getDay();
          const targetDay = config.resetDayOfWeek || 0; // Default to Sunday
          const daysToAdd = (targetDay + 7 - currentDay) % 7;
          nextReset.setDate(nextReset.getDate() + daysToAdd);
          nextReset.setHours(0, 0, 0, 0);
        } else if (config.frequency === 'monthly') {
          // Next occurrence of the specified day of month
          const targetDay = config.resetDay || 1; // Default to 1st of month
          nextReset.setDate(1); // Go to first day of current month
          nextReset.setMonth(nextReset.getMonth() + 1); // Go to first day of next month
          nextReset.setDate(Math.min(targetDay, new Date(nextReset.getFullYear(), nextReset.getMonth() + 1, 0).getDate()));
          nextReset.setHours(0, 0, 0, 0);
        }
        
        nextResetDate = nextReset.toISOString();
      }
      
      // Update the database
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        throw new Error('User not authenticated');
      }
      
      const { error } = await supabase
        .from('user_tokens')
        .upsert({
          user_id: userData.user.id,
          reset_frequency: config.frequency,
          next_reset_date: nextResetDate,
          updated_at: new Date().toISOString()
        });
      
      if (error) {
        throw error;
      }
      
      // Update the store
      set({
        resetFrequency: config.frequency,
        nextResetDate: nextResetDate,
        lastUpdated: new Date().toISOString()
      });
      
      logger.info('Reset schedule configured', { 
        frequency: config.frequency, 
        nextResetDate
      });
      
      return true;
    } catch (error) {
      logger.error('Failed to configure reset schedule', { error });
      toast.error('Failed to configure token reset schedule');
      return false;
    }
  },
  
  /**
   * Schedule the next reset based on frequency
   */
  scheduleNextReset: async (frequency: 'daily' | 'weekly' | 'monthly'): Promise<string | null> => {
    if (frequency === 'never') {
      return null;
    }
    
    const now = new Date();
    let nextReset = new Date(now);
    
    if (frequency === 'daily') {
      // Next day
      nextReset.setDate(nextReset.getDate() + 1);
      nextReset.setHours(0, 0, 0, 0);
    } else if (frequency === 'weekly') {
      // Next Sunday
      const currentDay = now.getDay();
      const daysToAdd = (7 - currentDay) % 7;
      nextReset.setDate(nextReset.getDate() + daysToAdd);
      nextReset.setHours(0, 0, 0, 0);
    } else if (frequency === 'monthly') {
      // First day of next month
      nextReset.setDate(1);
      nextReset.setMonth(nextReset.getMonth() + 1);
      nextReset.setHours(0, 0, 0, 0);
    }
    
    return nextReset.toISOString();
  },
  
  /**
   * Get usage analytics
   */
  getUsageAnalytics: async (): Promise<TokenAnalytics> => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        throw new Error('User not authenticated');
      }
      
      // Fetch token data first
      const { data: tokenData } = await supabase
        .from('user_tokens')
        .select('*')
        .eq('user_id', userData.user.id)
        .single();
      
      // Fetch recent token usage
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: usageData } = await supabase
        .from('token_usage')
        .select('*')
        .eq('user_id', userData.user.id)
        .gte('timestamp', thirtyDaysAgo.toISOString())
        .order('timestamp', { ascending: false });
      
      // Calculate usage trends
      const usageTrends: Array<{date: string; tokens: number; cost: number}> = [];
      
      if (usageData) {
        // Group by day
        const groupedByDay = usageData.reduce((acc, usage) => {
          const date = new Date(usage.timestamp).toISOString().split('T')[0];
          if (!acc[date]) {
            acc[date] = { tokens: 0, cost: 0 };
          }
          acc[date].tokens += usage.total_tokens || 0;
          acc[date].cost += usage.cost || 0;
          return acc;
        }, {} as Record<string, {tokens: number; cost: number}>);
        
        // Convert to array
        Object.entries(groupedByDay).forEach(([date, data]) => {
          usageTrends.push({
            date,
            tokens: data.tokens,
            cost: data.cost
          });
        });
        
        // Sort by date ascending
        usageTrends.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      }
      
      // Calculate cost breakdown
      const costByProvider: Record<string, number> = {};
      const costByFeature: Record<string, number> = {};
      let totalCost = 0;
      
      if (usageData) {
        usageData.forEach(usage => {
          if (usage.provider && usage.cost) {
            costByProvider[usage.provider] = (costByProvider[usage.provider] || 0) + usage.cost;
            totalCost += usage.cost;
          }
          
          if (usage.feature_key && usage.cost) {
            costByFeature[usage.feature_key] = (costByFeature[usage.feature_key] || 0) + usage.cost;
          }
        });
      }
      
      // Build the analytics object
      const analytics: TokenAnalytics = {
        totalUsed: tokenData?.used || 0,
        totalEarned: tokenData?.total_earned || 0,
        totalSpent: tokenData?.total_spent || 0,
        usageByProvider: tokenData?.usage_by_provider || {},
        usageByFeature: tokenData?.usage_by_feature || {},
        queriesUsed: tokenData?.queries_used || 0,
        costAnalysis: {
          totalCost,
          averageCostPerQuery: usageData && usageData.length > 0 ? totalCost / usageData.length : 0,
          costByProvider,
          costByFeature
        },
        usageTrends
      };
      
      return analytics;
    } catch (error) {
      logger.error('Failed to get usage analytics', { error });
      // Return a minimal analytics object
      return {
        totalUsed: get().used || 0,
        totalEarned: get().totalEarned || 0,
        totalSpent: get().totalSpent || 0,
        usageByProvider: get().usageByProvider || {},
        usageByFeature: get().usageByFeature || {},
        queriesUsed: get().queriesUsed || 0,
        costAnalysis: {
          totalCost: 0,
          averageCostPerQuery: 0,
          costByProvider: {},
          costByFeature: {}
        }
      };
    }
  },
  
  /**
   * Get usage by provider
   */
  getUsageByProvider: () => {
    return get().usageByProvider || {};
  },
  
  /**
   * Get usage by feature
   */
  getUsageByFeature: () => {
    return get().usageByFeature || {};
  },
  
  /**
   * Get usage trends for a specified number of days
   */
  getUsageTrends: async (days = 30): Promise<Array<{date: string; tokens: number; cost: number}>> => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        throw new Error('User not authenticated');
      }
      
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      const { data: usageData } = await supabase
        .from('token_usage')
        .select('*')
        .eq('user_id', userData.user.id)
        .gte('timestamp', startDate.toISOString())
        .order('timestamp', { ascending: true });
      
      if (!usageData) {
        return [];
      }
      
      // Group by day
      const groupedByDay = usageData.reduce((acc, usage) => {
        const date = new Date(usage.timestamp).toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = { tokens: 0, cost: 0 };
        }
        acc[date].tokens += usage.total_tokens || 0;
        acc[date].cost += usage.cost || 0;
        return acc;
      }, {} as Record<string, {tokens: number; cost: number}>);
      
      // Convert to array
      const trends: Array<{date: string; tokens: number; cost: number}> = [];
      Object.entries(groupedByDay).forEach(([date, data]) => {
        trends.push({
          date,
          tokens: data.tokens,
          cost: data.cost
        });
      });
      
      // Fill in missing dates with zeros
      const allDates: string[] = [];
      for (let i = 0; i < days; i++) {
        const d = new Date(startDate);
        d.setDate(d.getDate() + i);
        allDates.push(d.toISOString().split('T')[0]);
      }
      
      const result = allDates.map(date => {
        const existing = trends.find(t => t.date === date);
        return existing || { date, tokens: 0, cost: 0 };
      });
      
      return result;
    } catch (error) {
      logger.error('Failed to get usage trends', { error });
      return [];
    }
  },
  
  /**
   * Get cost breakdown for token usage
   */
  getCostBreakdown: async (): Promise<{
    totalCost: number;
    averageCostPerQuery: number;
    costByProvider: Record<string, number>;
    costByFeature: Record<string, number>;
  }> => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        throw new Error('User not authenticated');
      }
      
      // Fetch recent token usage
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: usageData } = await supabase
        .from('token_usage')
        .select('*')
        .eq('user_id', userData.user.id)
        .gte('timestamp', thirtyDaysAgo.toISOString());
      
      if (!usageData) {
        return {
          totalCost: 0,
          averageCostPerQuery: 0,
          costByProvider: {},
          costByFeature: {}
        };
      }
      
      // Calculate cost breakdown
      const costByProvider: Record<string, number> = {};
      const costByFeature: Record<string, number> = {};
      let totalCost = 0;
      
      usageData.forEach(usage => {
        if (usage.provider && usage.cost) {
          costByProvider[usage.provider] = (costByProvider[usage.provider] || 0) + usage.cost;
          totalCost += usage.cost;
        }
        
        if (usage.feature_key && usage.cost) {
          costByFeature[usage.feature_key] = (costByFeature[usage.feature_key] || 0) + usage.cost;
        }
      });
      
      return {
        totalCost,
        averageCostPerQuery: usageData.length > 0 ? totalCost / usageData.length : 0,
        costByProvider,
        costByFeature
      };
    } catch (error) {
      logger.error('Failed to get cost breakdown', { error });
      return {
        totalCost: 0,
        averageCostPerQuery: 0,
        costByProvider: {},
        costByFeature: {}
      };
    }
  },
  
  /**
   * Forecast token usage for the next X days
   */
  forecastUsage: async (days: number): Promise<{
    projectedTokens: number;
    projectedCost: number;
    depletion: boolean;
    depletionDate?: string;
  }> => {
    try {
      // Get recent usage trends
      const trends = await get().getUsageTrends(30);
      
      if (trends.length === 0) {
        return {
          projectedTokens: 0,
          projectedCost: 0,
          depletion: false
        };
      }
      
      // Calculate average daily usage
      const totalTokens = trends.reduce((sum, day) => sum + day.tokens, 0);
      const averageDailyTokens = totalTokens / trends.length;
      
      // Calculate average daily cost
      const totalCost = trends.reduce((sum, day) => sum + day.cost, 0);
      const averageDailyCost = totalCost / trends.length;
      
      // Project usage for the requested days
      const projectedTokens = averageDailyTokens * days;
      const projectedCost = averageDailyCost * days;
      
      // Check if balance will be depleted
      const currentBalance = get().balance;
      const depletion = projectedTokens > currentBalance;
      
      // Calculate depletion date if applicable
      let depletionDate: string | undefined;
      if (depletion && averageDailyTokens > 0) {
        const daysUntilDepletion = Math.floor(currentBalance / averageDailyTokens);
        const depleteDate = new Date();
        depleteDate.setDate(depleteDate.getDate() + daysUntilDepletion);
        depletionDate = depleteDate.toISOString();
      }
      
      return {
        projectedTokens,
        projectedCost,
        depletion,
        depletionDate
      };
    } catch (error) {
      logger.error('Failed to forecast usage', { error });
      return {
        projectedTokens: 0,
        projectedCost: 0,
        depletion: false
      };
    }
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

/**
 * Add a token usage record
 * This is used to track token usage across the application
 */
export const recordTokenUsage = async (usage: Omit<TokenUsage, 'id' | 'timestamp'>): Promise<boolean> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      logger.warn('No authenticated user found when recording token usage');
      return false;
    }
    
    const { error } = await supabase.from('token_usage').insert({
      ...usage,
      user_id: userData.user.id,
      timestamp: new Date().toISOString()
    });
    
    if (error) {
      logger.error('Failed to record token usage', { error, usage });
      return false;
    }
    
    return true;
  } catch (error) {
    logger.error('Error recording token usage', { error });
    return false;
  }
};
