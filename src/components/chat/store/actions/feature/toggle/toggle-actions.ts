
import { ChatState } from '../../../types/chat-store-types';
import { FeatureActions, SetState, GetState } from '../types';
import { createFeatureToggleActions } from './feature-toggle-actions';
import { createProviderActions } from './provider-actions';

// Feature toggle and provider actions
export const createToggleActions = (
  set: SetState<ChatState>,
  get: GetState<ChatState>
): Pick<FeatureActions, 'toggleFeature' | 'enableFeature' | 'disableFeature' | 'setFeatureState' | 'updateChatProvider'> => {
  return {
    ...createFeatureToggleActions(set, get),
    ...createProviderActions(set, get)
  };
};
