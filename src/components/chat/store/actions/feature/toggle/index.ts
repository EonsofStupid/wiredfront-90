
import { ChatState } from '../../../types/chat-store-types';
import { FeatureActions, SetState, GetState } from '../types';
import { createFeatureToggleActions } from './feature-toggle-actions';
import { createProviderActions } from './provider-actions';
import { createPositionActions } from './position-actions';
import { logger } from '@/services/chat/LoggingService';

/**
 * Creates all toggle-related actions for the chat store
 */
export const createToggleActions = (
  set: SetState<ChatState>,
  get: GetState<ChatState>
): Pick<FeatureActions, 'toggleFeature' | 'enableFeature' | 'disableFeature' | 'setFeatureState' | 'togglePosition' | 'setPosition' | 'updateChatProvider' | 'updateAvailableProviders'> => {
  return {
    ...createFeatureToggleActions(set, get),
    ...createProviderActions(set, get),
    ...createPositionActions(set, get)
  };
};

// Export individual action creators
export { createFeatureToggleActions } from './feature-toggle-actions';
export { createProviderActions } from './provider-actions';
export { createPositionActions } from './position-actions';
