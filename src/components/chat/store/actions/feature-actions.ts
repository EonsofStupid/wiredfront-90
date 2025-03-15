
import { StateCreator } from 'zustand';
import { ChatState, ChatProvider } from "../types/chat-store-types";
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';

export type FeatureKey = 'voice' | 'rag' | 'modeSwitch' | 'notifications' | 'github' | 
                         'codeAssistant' | 'ragSupport' | 'githubSync' | 'tokenEnforcement';

export type FeatureActions = {
  toggleFeature: (feature: FeatureKey) => void;
  enableFeature: (feature: FeatureKey) => void;
  disableFeature: (feature: FeatureKey) => void;
  setFeatureState: (feature: FeatureKey, isEnabled: boolean) => void;
  updateChatProvider: (providers: ChatProvider[]) => void;
  
  // Token management actions
  setTokenEnforcementMode: (mode: string) => void;
  addTokens: (amount: number) => Promise<boolean>;
  spendTokens: (amount: number) => Promise<boolean>;
  setTokenBalance: (amount: number) => Promise<boolean>;
};

type StoreWithDevtools = StateCreator<
  ChatState,
  [["zustand/devtools", never]],
  [],
  FeatureActions
>;

// Helper function to log feature toggle to the database
const logFeatureToggle = async (
  feature: FeatureKey, 
  oldValue: boolean | undefined, 
  newValue: boolean
) => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return;

    // Log to feature_toggle_history table
    await supabase.from('feature_toggle_history').insert({
      user_id: userData.user.id,
      feature_name: feature,
      old_value: oldValue,
      new_value: newValue,
      metadata: { source: 'client_app' }
    });

    // Log feature usage
    await supabase.from('feature_usage').insert({
      user_id: userData.user.id,
      feature_name: feature,
      context: { action: 'toggle', new_state: newValue }
    });

    logger.info(`Feature ${feature} ${newValue ? 'enabled' : 'disabled'}`, { feature, value: newValue });
  } catch (error) {
    logger.error('Error logging feature toggle:', error);
  }
};

// Helper function to update user token balance
const updateUserTokens = async (userId: string, amount: number): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('user_tokens')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      logger.error('Error fetching user tokens:', error);
      return false;
    }
    
    if (!data) {
      // Create new token record if it doesn't exist
      const { error: insertError } = await supabase
        .from('user_tokens')
        .insert({ user_id: userId, balance: amount });
      
      if (insertError) {
        logger.error('Error creating user tokens:', insertError);
        return false;
      }
    } else {
      // Update existing token record
      const { error: updateError } = await supabase
        .from('user_tokens')
        .update({ balance: amount })
        .eq('user_id', userId);
      
      if (updateError) {
        logger.error('Error updating user tokens:', updateError);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    logger.error('Error in updateUserTokens:', error);
    return false;
  }
};

export const createFeatureActions: StoreWithDevtools = (set, get) => ({
  toggleFeature: (feature) =>
    set(
      (state) => {
        const newValue = !state.features[feature];
        
        // Log the change to the database
        logFeatureToggle(feature, state.features[feature], newValue);
        
        return {
          ...state,
          features: {
            ...state.features,
            [feature]: newValue,
          },
        };
      },
      false,
      { type: 'features/toggle', feature }
    ),

  enableFeature: (feature) =>
    set(
      (state) => {
        // Only log if the feature wasn't already enabled
        if (!state.features[feature]) {
          logFeatureToggle(feature, state.features[feature], true);
        }
        
        return {
          ...state,
          features: {
            ...state.features,
            [feature]: true,
          },
        };
      },
      false,
      { type: 'features/enable', feature }
    ),

  disableFeature: (feature) =>
    set(
      (state) => {
        // Only log if the feature wasn't already disabled
        if (state.features[feature]) {
          logFeatureToggle(feature, state.features[feature], false);
        }
        
        return {
          ...state,
          features: {
            ...state.features,
            [feature]: false,
          },
        };
      },
      false,
      { type: 'features/disable', feature }
    ),

  setFeatureState: (feature, isEnabled) =>
    set(
      (state) => {
        // Only log if there's an actual change
        if (state.features[feature] !== isEnabled) {
          logFeatureToggle(feature, state.features[feature], isEnabled);
        }
        
        return {
          ...state,
          features: {
            ...state.features,
            [feature]: isEnabled,
          },
        };
      },
      false,
      { type: 'features/setState', feature, isEnabled }
    ),

  updateChatProvider: (providers) =>
    set(
      (state) => {
        const newDefaultProvider = providers.find((p) => p.isDefault) || providers[0] || state.currentProvider;
        
        // If the provider is changing, log it
        if (state.currentProvider?.id !== newDefaultProvider?.id) {
          logProviderChange(state.currentProvider?.name, newDefaultProvider?.name);
        }
        
        return {
          ...state,
          availableProviders: providers,
          currentProvider: newDefaultProvider,
          providers: {
            ...state.providers,
            availableProviders: providers,
          },
        };
      },
      false,
      { type: 'providers/update', count: providers.length }
    ),
    
  // Token management actions
  setTokenEnforcementMode: (mode) =>
    set(
      (state) => ({
        ...state,
        tokenControl: {
          ...state.tokenControl,
          enforcementMode: mode
        }
      }),
      false,
      { type: 'tokens/setEnforcementMode', mode }
    ),
  
  addTokens: async (amount) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return false;
      
      const userId = userData.user.id;
      const currentBalance = get().tokenControl.balance;
      const newBalance = currentBalance + amount;
      
      const success = await updateUserTokens(userId, newBalance);
      
      if (success) {
        set(
          (state) => ({
            ...state,
            tokenControl: {
              ...state.tokenControl,
              balance: newBalance,
              lastUpdated: new Date().toISOString()
            }
          }),
          false,
          { type: 'tokens/add', amount }
        );
      }
      
      return success;
    } catch (error) {
      logger.error('Error adding tokens:', error);
      return false;
    }
  },
  
  spendTokens: async (amount) => {
    try {
      // Check if token enforcement is disabled
      if (!get().features.tokenEnforcement) {
        return true; // Allow operation without spending tokens when disabled
      }
      
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return false;
      
      const userId = userData.user.id;
      const currentBalance = get().tokenControl.balance;
      
      // Check if user has enough tokens
      if (currentBalance < amount) {
        return false;
      }
      
      const newBalance = currentBalance - amount;
      const success = await updateUserTokens(userId, newBalance);
      
      if (success) {
        set(
          (state) => ({
            ...state,
            tokenControl: {
              ...state.tokenControl,
              balance: newBalance,
              lastUpdated: new Date().toISOString()
            }
          }),
          false,
          { type: 'tokens/spend', amount }
        );
      }
      
      return success;
    } catch (error) {
      logger.error('Error spending tokens:', error);
      return false;
    }
  },
  
  setTokenBalance: async (amount) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return false;
      
      const userId = userData.user.id;
      const success = await updateUserTokens(userId, amount);
      
      if (success) {
        set(
          (state) => ({
            ...state,
            tokenControl: {
              ...state.tokenControl,
              balance: amount,
              lastUpdated: new Date().toISOString()
            }
          }),
          false,
          { type: 'tokens/setBalance', amount }
        );
      }
      
      return success;
    } catch (error) {
      logger.error('Error setting token balance:', error);
      return false;
    }
  }
});

// Helper function to log provider changes to the database
const logProviderChange = async (oldProvider: string | undefined, newProvider: string | undefined) => {
  if (!newProvider) return;
  
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return;

    await supabase.from('provider_change_log').insert({
      user_id: userData.user.id,
      provider_name: newProvider,
      old_provider: oldProvider,
      new_provider: newProvider,
      reason: 'user_action',
      metadata: { source: 'client_app' }
    });

    logger.info(`Provider changed from ${oldProvider || 'none'} to ${newProvider}`, { 
      oldProvider, 
      newProvider 
    });
  } catch (error) {
    logger.error('Error logging provider change:', error);
  }
};
