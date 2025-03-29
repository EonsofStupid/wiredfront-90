
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/services/chat/LoggingService';
import { AdminFeatureKey, AdminFeatureStore } from '@/types/features/adminFeatures';
import { useRoleStore } from '@/stores/role';

/**
 * Default values for admin features
 */
const DEFAULT_ADMIN_FEATURES: Record<AdminFeatureKey, boolean> = {
  advancedMetrics: true,
  userManagement: true,
  apiKeyManagement: true,
  systemSettings: true,
  featureFlagsManagement: true,
  tokenManagement: true,
  ragConfiguration: true,
  modelProviders: true,
  billingManagement: true,
  auditLogs: true
};

/**
 * Admin feature store implementation
 */
export const useAdminFeatures = create<AdminFeatureStore>()(
  persist(
    (set, get) => ({
      features: { ...DEFAULT_ADMIN_FEATURES },
      config: {},
      isInitialized: false,

      /**
       * Toggle a feature on/off
       */
      toggleFeature: (key: AdminFeatureKey) => {
        const currentValue = get().features[key];
        
        // Check admin permissions before allowing toggle
        if (!hasAdminPermission()) {
          toast.error('You don\'t have permission to modify admin features');
          return;
        }
        
        set((state) => ({
          features: {
            ...state.features,
            [key]: !currentValue,
          },
        }));
        
        logger.info(`Admin feature toggled: ${key}`, {
          feature: key,
          value: !currentValue,
          domain: 'admin'
        });
        
        // Log to feature analytics
        logFeatureUsage(key, { action: 'toggle', oldValue: currentValue, newValue: !currentValue, domain: 'admin' })
          .catch(err => logger.error('Error logging feature usage', err));
      },

      /**
       * Enable a feature
       */
      enableFeature: (key: AdminFeatureKey) => {
        const currentValue = get().features[key];
        if (currentValue) return; // Already enabled
        
        // Check admin permissions before allowing enable
        if (!hasAdminPermission()) {
          toast.error('You don\'t have permission to modify admin features');
          return;
        }
        
        set((state) => ({
          features: {
            ...state.features,
            [key]: true,
          },
        }));
        
        logger.info(`Admin feature enabled: ${key}`, {
          feature: key,
          domain: 'admin'
        });
        
        // Log to feature analytics
        logFeatureUsage(key, { action: 'enable', oldValue: false, newValue: true, domain: 'admin' })
          .catch(err => logger.error('Error logging feature usage', err));
      },

      /**
       * Disable a feature
       */
      disableFeature: (key: AdminFeatureKey) => {
        const currentValue = get().features[key];
        if (!currentValue) return; // Already disabled
        
        // Check admin permissions before allowing disable
        if (!hasAdminPermission()) {
          toast.error('You don\'t have permission to modify admin features');
          return;
        }
        
        set((state) => ({
          features: {
            ...state.features,
            [key]: false,
          },
        }));
        
        logger.info(`Admin feature disabled: ${key}`, {
          feature: key,
          domain: 'admin'
        });
        
        // Log to feature analytics
        logFeatureUsage(key, { action: 'disable', oldValue: true, newValue: false, domain: 'admin' })
          .catch(err => logger.error('Error logging feature usage', err));
      },

      /**
       * Set a feature's state directly
       */
      setFeatureState: (key: AdminFeatureKey, enabled: boolean) => {
        const currentValue = get().features[key];
        if (currentValue === enabled) return; // No change
        
        // Check admin permissions before allowing state change
        if (!hasAdminPermission()) {
          toast.error('You don\'t have permission to modify admin features');
          return;
        }
        
        set((state) => ({
          features: {
            ...state.features,
            [key]: enabled,
          },
        }));
        
        logger.info(`Admin feature state set: ${key} = ${enabled}`, {
          feature: key,
          value: enabled,
          domain: 'admin'
        });
        
        // Log to feature analytics
        logFeatureUsage(key, { action: 'setState', oldValue: currentValue, newValue: enabled, domain: 'admin' })
          .catch(err => logger.error('Error logging feature usage', err));
      },

      /**
       * Set feature configuration
       */
      setFeatureConfig: (key: AdminFeatureKey, config: any) => {
        // Check admin permissions before allowing config change
        if (!hasAdminPermission()) {
          toast.error('You don\'t have permission to modify admin features');
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
        // Check admin permissions before allowing reset
        if (!hasAdminPermission()) {
          toast.error('You don\'t have permission to reset admin features');
          return;
        }
        
        set({ 
          features: { ...DEFAULT_ADMIN_FEATURES },
          isInitialized: true
        });
        toast.success('Admin features reset to defaults');
        logger.info('Admin features reset to defaults', { domain: 'admin' });
      },

      /**
       * Initialize features from database
       */
      initialize: async () => {
        try {
          // Check if user has admin permission before loading admin features
          if (!hasAdminPermission()) {
            logger.info('User does not have admin permissions, skipping admin features initialization');
            set({ 
              features: {},  // Empty features for non-admin users
              isInitialized: true 
            });
            return;
          }
          
          const { data: featuresData, error } = await supabase
            .from('feature_flags')
            .select('*')
            .eq('domain', 'admin');

          if (error) {
            logger.error('Error loading admin features', error);
            throw error;
          }

          // Apply features from database
          const features = { ...DEFAULT_ADMIN_FEATURES };
          
          featuresData?.forEach(flag => {
            // Only apply if it's a valid admin feature key
            if (flag.key in features) {
              features[flag.key as AdminFeatureKey] = flag.enabled;
            }
          });

          set({ 
            features,
            isInitialized: true 
          });
          
          logger.info('Admin features initialized', { 
            featureCount: featuresData?.length,
            domain: 'admin' 
          });
          
          return;
        } catch (error) {
          logger.error('Failed to initialize admin features', error);
          // Fallback to defaults if initialization fails
          set({ 
            features: hasAdminPermission() ? { ...DEFAULT_ADMIN_FEATURES } : {},
            isInitialized: true 
          });
        }
      },
    }),
    {
      name: 'admin-features-storage',
      partialize: (state) => ({ 
        features: state.features,
        config: state.config 
      }),
    }
  )
);

/**
 * Check if current user has admin permissions
 */
function hasAdminPermission(): boolean {
  const { hasRole } = useRoleStore.getState();
  return hasRole('admin') || hasRole('super_admin');
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
      domain: context.domain || 'admin',
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

// Export a hook for consuming admin features
export function useAdminFeature(key: AdminFeatureKey): {
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
  } = useAdminFeatures();
  
  return {
    enabled: features[key] ?? false,
    toggle: () => toggleFeature(key),
    enable: () => enableFeature(key),
    disable: () => disableFeature(key),
    config: config[key] || {}
  };
}
