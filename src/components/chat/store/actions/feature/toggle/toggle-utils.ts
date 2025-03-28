import { logger } from '@/services/chat/LoggingService';

/**
 * Logs feature toggle events to analytics/database
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
  
  // Here we could add API calls to log to the database
  // or send analytics events
};

/**
 * Logs provider change events
 */
export const logProviderChange = (
  oldProvider: string | undefined,
  newProvider: string | undefined
) => {
  logger.info('Provider changed', { 
    oldProvider, 
    newProvider,
    changed: oldProvider !== newProvider
  });
  
  // Here we could add API calls to log to the database
  // or send analytics events
};
