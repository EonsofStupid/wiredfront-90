
import { StateCreator } from 'zustand';
import { ChatState, ChatProvider } from "../types/chat-store-types";
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';

export type FeatureKey = 'voice' | 'rag' | 'modeSwitch' | 'notifications' | 'github' | 
                         'codeAssistant' | 'ragSupport' | 'githubSync';

export type FeatureActions = {
  toggleFeature: (feature: FeatureKey) => void;
  enableFeature: (feature: FeatureKey) => void;
  disableFeature: (feature: FeatureKey) => void;
  setFeatureState: (feature: FeatureKey, isEnabled: boolean) => void;
  updateChatProvider: (providers: ChatProvider[]) => void;
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
