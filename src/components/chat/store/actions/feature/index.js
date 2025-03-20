import { createToggleActions } from './toggle';
import { createTokenActions } from './token';
export const createFeatureActions = (set, get) => {
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
