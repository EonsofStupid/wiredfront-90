
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/services/chat/LoggingService';
import { BetaFeatureKey, BetaFeatureStore } from '@/types/features/betaFeatures';
import { useRoleStore } from '@/stores/role';

/**
 * Default values for beta features
 */
const DEFAULT_BETA_FEATURES: Record<BetaFeatureKey, boolean> = {
  experimentalModels: false,
  performance: false,
  debugMode: false,
  experimentalUi: false,
  betaRag: false,
  localModelSupport: false,
  experimentalTools: false,
  testingMode: false
};

/**
 * Beta feature store implementation
 */
export const useBetaFeatures = create<BetaFeatureStore>()(
  persist(
    (set, get) => ({
      features: { ...DEFAULT_BETA_FEATURES },
      config: {},
      isInitialized: false,

      /**
       * Toggle a feature on/off
       */
      toggleFeature: (key: BetaFeatureKey) => {
        // Check if user has developer role before allowing toggle
        if (!hasDeveloperPermission()) {
          toast.error('You don\'t have permission to modify beta features');
          return;
        }
        
        const currentValue = get().features[key];
        set((state) => ({
          features: {
            ...state.features,
            [key]: !currentValue,
          },
        }));
        
        logger.info(`Beta feature toggled: ${key}`, {
          feature: key,
          value: !currentValue,
          domain: 'beta'
        });
        
        // Log to feature analytics
        logFeatureUsage(key, { action: 'toggle', oldValue: currentValue, newValue: !currentValue, domain: 'beta' })
          .catch(err => logger.error('Error logging feature usage', err));
      },

      /**
       * Enable a feature
       */
      enableFeature: (key: BetaFeatureKey) => {
        // Check if user has developer role before allowing toggle
        if (!hasDeveloperPermission()) {
          toast.error('You don\'t have permission to modify beta features');
          return;
        }
        
        const currentValue = get().features[key];
        if (currentValue) return; // Already enabled
        
        set((state) => ({
          features: {
            ...state.features,
            [key]: true,
          },
        }));
        
        logger.info(`Beta feature enabled: ${key}`, {
          feature: key,
          domain: 'beta'
        });
        
        // Log to feature analytics
        logFeatureUsage(key, { action: 'enable', oldValue: false, newValue: true, domain: 'beta' })
          .catch(err => logger.error('Error logging feature usage', err));
      },

      /**
       * Disable a feature
       */
      disableFeature: (key: BetaFeatureKey) => {
        // Check if user has developer role before allowing toggle
        if (!hasDeveloperPermission()) {
          toast.error('You don\'t have permission to modify beta features');
          return;
        }
        
        const currentValue = get().features[key];
        if (!currentValue) return; // Already disabled
        
        set((state) => ({
          features: {
            ...state.features,
            [key]: false,
          },
        }));
        
        logger.info(`Beta feature disabled: ${key}`, {
          feature: key,
          domain: 'beta'
        });
        
        // Log to feature analytics
        logFeatureUsage(key, { action: 'disable', oldValue: true, newValue: false, domain: 'beta' })
          .catch(err => logger.error('Error logging feature usage', err));
      },

      /**
       * Set a feature's state directly
       */
      setFeatureState: (key: BetaFeatureKey, enabled: boolean) => {
        // Check if user has developer role before allowing toggle
        if (!hasDeveloperPermission()) {
          toast.error('You don\'t have permission to modify beta features');
          return;
        }
        
        const currentValue = get().features[key];
        if (currentValue === enabled) return; // No change
        
        set((state) => ({
          features: {
            ...state.features,
            [key]: enabled,
          },
        }));
        
        logger.info(`Beta feature state set: ${key} = ${enabled}`, {
          feature: key,
          value: enabled,
          domain: 'beta'
        });
        
        // Log to feature analytics
        logFeatureUsage(key, { action: 'setState', oldValue: currentValue, newValue: enabled, domain: 'beta' })
          .catch(err => logger.error('Error logging feature usage', err));
      },

      /**
       * Set feature configuration
       */
      setFeatureConfig: (key: BetaFeatureKey, config: any) => {
        // Check if user has developer role before allowing toggle
        if (!hasDeveloperPermission()) {
          toast.error('You don\'t have permission to modify beta features');
          return;
        }
        
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
        // Check if user has developer role before allowing toggle
        if (!hasDeveloperPermission()) {
          toast.error('You don\'t have permission to reset beta features');
          return;
        }
        
        set({ 
          features: { ...DEFAULT_BETA_FEATURES },
          isInitialized: true
        });
        toast.success('Beta features reset to defaults');
        logger.info('Beta features reset to defaults', { domain: 'beta' });
      },

      /**
       * Initialize features from database
       */
      initialize: async () => {
        try {
          // Check if user has developer permission
          if (!hasDeveloperPermission()) {
            logger.info('User does not have developer permissions, skipping beta features initialization');
            set({ 
              features: {},  // Empty features for non-developer users
              isInitialized: true 
            });
            return;
          }
          
          const { data: featuresData, error } = await supabase
            .from('feature_flags')
            .select('*')
            .eq('domain', 'beta');

          if (error) {
            logger.error('Error loading beta features', error);
            throw error;
          }

          // Apply features from database
          const features = { ...DEFAULT_BETA_FEATURES };
          
          featuresData?.forEach(flag => {
            // Only apply if it's a valid beta feature key
            if (flag.key in features) {
              features[flag.key as BetaFeatureKey] = flag.enabled;
            }
          });

          set({ 
            features,
            isInitialized: true 
          });
          
          logger.info('Beta features initialized', { 
            featureCount: featuresData?.length,
            domain: 'beta' 
          });
          
          return;
        } catch (error) {
          logger.error('Failed to initialize beta features', error);
          // Fallback to defaults if initialization fails
          set({ 
            features: hasDeveloperPermission() ? { ...DEFAULT_BETA_FEATURES } : {},
            isInitialized: true 
          });
        }
      },
    }),
    {
      name: 'beta-features-storage',
      partialize: (state) => ({ 
        features: state.features,
        config: state.config 
      }),
    }
  )
);

/**
 * Check if current user has developer permissions
 */
function hasDeveloperPermission(): boolean {
  const { hasRole } = useRoleStore.getState();
  return hasRole('developer') || hasRole('admin') || hasRole('super_admin');
}

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
      domain: context.domain || 'beta',
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

// Export a hook for consuming beta features
export function useBetaFeature(key: BetaFeatureKey): {
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
  } = useBetaFeatures();
  
  return {
    enabled: features[key] ?? false,
    toggle: () => toggleFeature(key),
    enable: () => enableFeature(key),
    disable: () => disableFeature(key),
    config: config[key] || {}
  };
}
