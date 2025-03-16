
import { StoreWithDevtools, FeatureActions, FeatureKey } from './types';
import { createToggleActions } from './toggle-actions';
import { createTokenActions } from './token-actions';

// Export the FeatureKey type for use throughout the application
export type { FeatureKey };

// Create the complete feature actions by combining toggle and token actions
export const createFeatureActions: StoreWithDevtools = (set, get, api) => ({
  ...createToggleActions(set, get),
  ...createTokenActions(set, get)
});
