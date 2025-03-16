
import { createToggleActions } from './toggle';
import { createTokenActions } from './token'; 
import { SetState, GetState } from './types';
import { ChatState } from '../../types/chat-store-types';

export const createFeatureActions = (set: SetState<ChatState>, get: GetState<ChatState>) => {
  // Create individual action groups
  const toggleActions = createToggleActions(set, get);
  const tokenActions = createTokenActions(set, get);

  // Combine all feature-related actions
  return {
    ...toggleActions,
    ...tokenActions,
  };
};

// Re-export types
export * from './types';
