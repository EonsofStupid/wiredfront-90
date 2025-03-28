
import { ChatState } from '../../../types/chat-store-types';
import { FeatureActions } from '../types';
import { createFeatureToggleActions } from './feature-toggle-actions';
import { createProviderActions } from './provider-actions';
import { createPositionActions } from './position-actions';
import { logger } from '@/services/chat/LoggingService';

// Define SetState and GetState types specifically for this file
type SetState<T> = (
  partial: T | Partial<T> | ((state: T) => T | Partial<T>),
  replace?: boolean
) => void;

type GetState<T> = () => T;

/**
 * Creates toggle-related actions for the chat store
 * This is a root creator that combines various toggle action creators
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
