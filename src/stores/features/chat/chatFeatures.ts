
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/services/chat/LoggingService';
import { ChatFeatureKey, ChatFeatureStore } from '@/types/features/chatFeatures';

/**
 * Default values for chat features
 */
const DEFAULT_CHAT_FEATURES: Record<ChatFeatureKey, boolean> = {
  voice: true,
  rag: true,
  modeSwitch: true,
  notifications: true,
  codeAssistant: true,
  ragSupport: true,
  knowledgeBase: true,
  standardChat: true,
  imageGeneration: true,
  training: true,
  multiFile: true,
};

/**
 * Chat feature store implementation
 */
export const useChatFeatures = create<ChatFeatureStore>()(
  persist(
    (set, get) => ({
      features: { ...DEFAULT_CHAT_FEATURES },
      config: {},
      isInitialized: false,

      /**
       * Toggle a feature on/off
       */
      toggleFeature: (key: ChatFeatureKey) => {
        const currentValue = get().features[key];
        set((state) => ({
          features: {
            ...state.features,
            [key]: !currentValue,
          },
        }));
        
        logger.info(`Chat feature toggled: ${key}`, {
          feature: key,
          value: !currentValue,
          domain: 'chat'
        });
        
        // Log to feature analytics
        logFeatureUsage(key, { action: 'toggle', oldValue: currentValue, newValue: !currentValue, domain: 'chat' })
          .catch(err => logger.error('Error logging feature usage', err));
      },

      /**
       * Enable a feature
       */
      enableFeature: (key: ChatFeatureKey) => {
        const currentValue = get().features[key];
        if (currentValue) return; // Already enabled
        
        set((state) => ({
          features: {
            ...state.features,
            [key]: true,
          },
        }));
        
        logger.info(`Chat feature enabled: ${key}`, {
          feature: key,
          domain: 'chat'
        });
        
        // Log to feature analytics
        logFeatureUsage(key, { action: 'enable', oldValue: false, newValue: true, domain: 'chat' })
          .catch(err => logger.error('Error logging feature usage', err));
      },

      /**
       * Disable a feature
       */
      disableFeature: (key: ChatFeatureKey) => {
        const currentValue = get().features[key];
        if (!currentValue) return; // Already disabled
        
        set((state) => ({
          features: {
            ...state.features,
            [key]: false,
          },
        }));
        
        logger.info(`Chat feature disabled: ${key}`, {
          feature: key,
          domain: 'chat'
        });
        
        // Log to feature analytics
        logFeatureUsage(key, { action: 'disable', oldValue: true, newValue: false, domain: 'chat' })
          .catch(err => logger.error('Error logging feature usage', err));
      },

      /**
       * Set a feature's state directly
       */
      setFeatureState: (key: ChatFeatureKey, enabled: boolean) => {
        const currentValue = get().features[key];
        if (currentValue === enabled) return; // No change
        
        set((state) => ({
          features: {
            ...state.features,
            [key]: enabled,
          },
        }));
        
        logger.info(`Chat feature state set: ${key} = ${enabled}`, {
          feature: key,
          value: enabled,
          domain: 'chat'
        });
        
        // Log to feature analytics
        logFeatureUsage(key, { action: 'setState', oldValue: currentValue, newValue: enabled, domain: 'chat' })
          .catch(err => logger.error('Error logging feature usage', err));
      },

      /**
       * Set feature configuration
       */
      setFeatureConfig: (key: ChatFeatureKey, config: any) => {
        set((state) => ({
          config: {
            ...state.config,
            [key]: config,
          },
        }));
      },

      /**
       * Reset all features to defaults
       */
      resetFeatures: () => {
        set({ 
          features: { ...DEFAULT_CHAT_FEATURES },
          isInitialized: true
        });
        toast.success('Chat features reset to defaults');
        logger.info('Chat features reset to defaults', { domain: 'chat' });
      },

      /**
       * Initialize features from database
       */
      initialize: async () => {
        try {
          const { data: featuresData, error } = await supabase
            .from('feature_flags')
            .select('*')
            .eq('domain', 'chat');

          if (error) {
            logger.error('Error loading chat features', error);
            throw error;
          }

          // Apply features from database
          const features = { ...DEFAULT_CHAT_FEATURES };
          
          featuresData?.forEach(flag => {
            // Only apply if it's a valid chat feature key
            if (flag.key in features) {
              features[flag.key as ChatFeatureKey] = flag.enabled;
            }
          });

          set({ 
            features,
            isInitialized: true 
          });
          
          logger.info('Chat features initialized', { 
            featureCount: featuresData?.length,
            domain: 'chat' 
          });
          
          return;
        } catch (error) {
          logger.error('Failed to initialize chat features', error);
          // Fallback to defaults if initialization fails
          set({ 
            features: { ...DEFAULT_CHAT_FEATURES },
            isInitialized: true 
          });
        }
      },
    }),
    {
      name: 'chat-features-storage',
      partialize: (state) => ({ 
        features: state.features,
        config: state.config 
      }),
    }
  )
);

/**
 * Log feature usage to analytics service
 */
async function logFeatureUsage(
  featureKey: string, 
  context: Record<string, any> = {}
) {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return;
    
    // Log to feature_toggle_history table
    await supabase.from('feature_toggle_history').insert({
      user_id: userData.user.id,
      feature_name: featureKey,
      old_value: context.oldValue || false,
      new_value: context.newValue || true,
      domain: context.domain || 'chat',
      context
    });
    
    logger.debug(`Feature usage logged: ${featureKey}`, { 
      feature: featureKey, 
      context 
    });
  } catch (error) {
    logger.error(`Error logging feature usage for ${featureKey}:`, error);
  }
}

// Export a hook for consuming chat features
export function useChatFeature(key: ChatFeatureKey): {
  enabled: boolean;
  toggle: () => void;
  enable: () => void;
  disable: () => void;
  config: any;
} {
  const { 
    features, 
    toggleFeature, 
    enableFeature, 
    disableFeature,
    config 
  } = useChatFeatures();
  
  return {
    enabled: features[key],
    toggle: () => toggleFeature(key),
    enable: () => enableFeature(key),
    disable: () => disableFeature(key),
    config: config[key] || {}
  };
}
