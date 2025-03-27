
import { FeatureKey } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';

// Helper function to log feature toggle to the database
export const logFeatureToggle = async (
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
      metadata: { source: 'chat_client' }
    });

    logger.info(`Feature ${feature} ${newValue ? 'enabled' : 'disabled'}`, { feature, value: newValue });
  } catch (error) {
    logger.error('Error logging feature toggle:', error);
  }
};

// Helper function to log provider changes to the database
export const logProviderChange = async (oldProvider: string | undefined, newProvider: string | undefined) => {
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
      metadata: { source: 'chat_client' }
    });

    logger.info(`Provider changed from ${oldProvider || 'none'} to ${newProvider}`, { 
      oldProvider, 
      newProvider 
    });
  } catch (error) {
    logger.error('Error logging provider change:', error);
  }
};
