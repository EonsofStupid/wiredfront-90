
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/services/chat/LoggingService';
import { AppFeatureKey, AppFeatureStore } from '@/types/features/appFeatures';

/**
 * Default values for app features
 */
const DEFAULT_APP_FEATURES: Record<AppFeatureKey, boolean> = {
  darkMode: true,
  github: false,
  githubSync: true,
  documentation: true,
  feedback: true,
  tokenEnforcement: false,
  billing: true,
  onboarding: true,
  analytics: true,
  notifications: true
};

/**
 * App feature store implementation
 */
export const useAppFeatures = create<AppFeatureStore>()(
  persist(
    (set, get) => ({
      features: { ...DEFAULT_APP_FEATURES },
      config: {},
      isInitialized: false,

      /**
       * Toggle a feature on/off
       */
      toggleFeature: (key: AppFeatureKey) => {
        const currentValue = get().features[key];
        set((state) => ({
          features: {
            ...state.features,
            [key]: !currentValue,
          },
        }));
        
        logger.info(`App feature toggled: ${key}`, {
          feature: key,
          value: !currentValue,
          domain: 'app'
        });
        
        // Log to feature analytics
        logFeatureUsage(key, { action: 'toggle', oldValue: currentValue, newValue: !currentValue, domain: 'app' })
          .catch(err => logger.error('Error logging feature usage', err));
      },

      /**
       * Enable a feature
       */
      enableFeature: (key: AppFeatureKey) => {
        const currentValue = get().features[key];
        if (currentValue) return; // Already enabled
        
        set((state) => ({
          features: {
            ...state.features,
            [key]: true,
          },
        }));
        
        logger.info(`App feature enabled: ${key}`, {
          feature: key,
          domain: 'app'
        });
        
        // Log to feature analytics
        logFeatureUsage(key, { action: 'enable', oldValue: false, newValue: true, domain: 'app' })
          .catch(err => logger.error('Error logging feature usage', err));
      },

      /**
       * Disable a feature
       */
      disableFeature: (key: AppFeatureKey) => {
        const currentValue = get().features[key];
        if (!currentValue) return; // Already disabled
        
        set((state) => ({
          features: {
            ...state.features,
            [key]: false,
          },
        }));
        
        logger.info(`App feature disabled: ${key}`, {
          feature: key,
          domain: 'app'
        });
        
        // Log to feature analytics
        logFeatureUsage(key, { action: 'disable', oldValue: true, newValue: false, domain: 'app' })
          .catch(err => logger.error('Error logging feature usage', err));
      },

      /**
       * Set a feature's state directly
       */
      setFeatureState: (key: AppFeatureKey, enabled: boolean) => {
        const currentValue = get().features[key];
        if (currentValue === enabled) return; // No change
        
        set((state) => ({
          features: {
            ...state.features,
            [key]: enabled,
          },
        }));
        
        logger.info(`App feature state set: ${key} = ${enabled}`, {
          feature: key,
          value: enabled,
          domain: 'app'
        });
        
        // Log to feature analytics
        logFeatureUsage(key, { action: 'setState', oldValue: currentValue, newValue: enabled, domain: 'app' })
          .catch(err => logger.error('Error logging feature usage', err));
      },

      /**
       * Set feature configuration
       */
      setFeatureConfig: (key: AppFeatureKey, config: any) => {
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
          features: { ...DEFAULT_APP_FEATURES },
          isInitialized: true
        });
        toast.success('App features reset to defaults');
        logger.info('App features reset to defaults', { domain: 'app' });
      },

      /**
       * Initialize features from database
       */
      initialize: async () => {
        try {
          const { data: featuresData, error } = await supabase
            .from('feature_flags')
            .select('*')
            .eq('domain', 'app');

          if (error) {
            logger.error('Error loading app features', error);
            throw error;
          }

          // Apply features from database
          const features = { ...DEFAULT_APP_FEATURES };
          
          featuresData?.forEach(flag => {
            // Only apply if it's a valid app feature key
            if (flag.key in features) {
              features[flag.key as AppFeatureKey] = flag.enabled;
            }
          });

          set({ 
            features,
            isInitialized: true 
          });
          
          logger.info('App features initialized', { 
            featureCount: featuresData?.length,
            domain: 'app' 
          });
          
          return;
        } catch (error) {
          logger.error('Failed to initialize app features', error);
          // Fallback to defaults if initialization fails
          set({ 
            features: { ...DEFAULT_APP_FEATURES },
            isInitialized: true 
          });
        }
      },
    }),
    {
      name: 'app-features-storage',
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
      domain: context.domain || 'app',
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

// Export a hook for consuming app features
export function useAppFeature(key: AppFeatureKey): {
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
  } = useAppFeatures();
  
  return {
    enabled: features[key],
    toggle: () => toggleFeature(key),
    enable: () => enableFeature(key),
    disable: () => disableFeature(key),
    config: config[key] || {}
  };
}
