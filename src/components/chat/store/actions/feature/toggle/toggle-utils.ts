
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';

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
      metadata: { source: 'client_app', action: 'update_current_provider' }
    });

    logger.info(`Provider changed from ${oldProvider || 'none'} to ${newProvider}`, { 
      oldProvider, 
      newProvider 
    });
  } catch (error) {
    logger.error('Error logging provider change:', error);
  }
};

// Helper function to log feature usage - using the token_transaction_log table instead of feature_usage
export const logFeatureUsage = async (featureKey: string, userId: string | undefined, context: Record<string, any> = {}) => {
  if (!userId) return;
  
  try {
    // Log in token_transaction_log table instead of feature_usage
    await supabase.from('token_transaction_log').insert({
      user_id: userId,
      amount: 0, // No tokens spent for feature usage
      transaction_type: 'feature_toggle',
      description: `Feature ${featureKey} usage`,
      metadata: { 
        feature: featureKey,
        action: context.action || 'usage',
        context
      }
    });
    
    logger.info(`Feature usage logged: ${featureKey}`, { feature: featureKey, context });
    return true;
  } catch (error) {
    logger.error(`Error logging feature usage for ${featureKey}:`, error);
    return false;
  }
};
