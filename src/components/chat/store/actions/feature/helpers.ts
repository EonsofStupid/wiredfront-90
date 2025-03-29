
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
import { FeatureKey } from './types';

/**
 * Log a feature toggle to the database
 */
export const logFeatureToggle = async (
  featureKey: string,
  oldValue: boolean | null,
  newValue: boolean
): Promise<void> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      logger.warn('No authenticated user found when logging feature toggle');
      return;
    }
    
    // Insert feature toggle record
    const { error } = await supabase
      .from('feature_toggle_history')
      .insert({
        feature_name: featureKey,
        user_id: userData.user.id,
        old_value: oldValue,
        new_value: newValue,
        context: {
          source: 'chat_store',
          timestamp: new Date().toISOString()
        }
      });
    
    if (error) {
      throw error;
    }
    
    logger.info(`Feature toggle logged: ${String(featureKey)}`, { 
      feature: featureKey, 
      oldValue, 
      newValue 
    });
  } catch (error) {
    logger.error('Failed to log feature toggle', { error, featureKey });
  }
};

/**
 * Get the current state of a feature
 */
export const getFeatureState = (
  features: Record<FeatureKey, boolean>,
  key: FeatureKey,
  defaultValue: boolean = false
): boolean => {
  return features[key] ?? defaultValue;
};
