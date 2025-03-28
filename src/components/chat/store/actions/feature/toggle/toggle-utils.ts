
import { logger } from '@/services/chat/LoggingService';

/**
 * Utility functions for toggling features and settings
 */

export const logToggleAction = (action: string, key: string, value: any) => {
  logger.info(`Toggle action: ${action}`, { key, value });
};

export const validateProvider = (provider: any): boolean => {
  if (!provider) return false;
  
  // Basic validation for required provider fields
  return !!(
    provider.id && 
    provider.name && 
    typeof provider.isEnabled === 'boolean'
  );
};
