
import { logger } from '@/services/chat/LoggingService';

/**
 * Logs provider changes for analytics and debugging
 */
export const logProviderChange = (oldProvider: string | undefined, newProvider: string | undefined) => {
  if (oldProvider === newProvider) {
    logger.debug('Provider unchanged', { provider: newProvider });
    return;
  }
  
  logger.info('Provider changed', { 
    from: oldProvider || 'none', 
    to: newProvider || 'none' 
  });
  
  // Here you can add additional analytics or logging
};

/**
 * Logs feature toggle events
 */
export const logFeatureToggle = (
  feature: string,
  oldValue: boolean | undefined,
  newValue: boolean
) => {
  logger.info(`Feature toggle: ${feature}`, { 
    feature, 
    oldValue, 
    newValue, 
    changed: oldValue !== newValue 
  });
};
