import { convertFeatureKeyToChatFeature } from '../types';
import { logger } from '@/services/chat/LoggingService';
import { supabase } from '@/integrations/supabase/client';
export function createFeatureToggleActions(set, get) {
    return {
        toggleFeature: async (feature) => {
            // Convert to a valid feature state key
            const featureStateKey = convertFeatureKeyToChatFeature(feature);
            // Skip if feature can't be mapped to a valid key
            if (!featureStateKey) {
                logger.warn(`Feature ${String(feature)} cannot be toggled: invalid feature key`);
                return;
            }
            const currentState = get().features[featureStateKey];
            try {
                // Update state optimistically
                set(state => ({
                    features: {
                        ...state.features,
                        [featureStateKey]: !currentState
                    }
                }), false, { type: 'toggleFeature', feature: featureStateKey });
                // Log the toggle
                await supabase.from('feature_toggle_history').insert({
                    feature_name: String(feature),
                    old_value: currentState,
                    new_value: !currentState,
                    metadata: { source: 'client' }
                });
                logger.info(`Feature ${String(feature)} toggled to ${!currentState}`);
            }
            catch (error) {
                // Revert on error
                logger.error('Failed to toggle feature:', error);
                set(state => ({
                    features: {
                        ...state.features,
                        [featureStateKey]: currentState
                    }
                }), false, { type: 'toggleFeature', feature: featureStateKey });
            }
        },
        enableFeature: (feature) => {
            // Convert to a valid feature state key
            const featureStateKey = convertFeatureKeyToChatFeature(feature);
            // Skip if feature can't be mapped to a valid key
            if (!featureStateKey) {
                logger.warn(`Feature ${String(feature)} cannot be enabled: invalid feature key`);
                return;
            }
            if (!(featureStateKey in get().features)) {
                logger.warn(`Feature '${String(featureStateKey)}' does not exist in the store`);
                return;
            }
            set(state => ({
                features: {
                    ...state.features,
                    [featureStateKey]: true
                }
            }), false, { type: 'enableFeature', feature: featureStateKey });
        },
        disableFeature: (feature) => {
            // Convert to a valid feature state key
            const featureStateKey = convertFeatureKeyToChatFeature(feature);
            // Skip if feature can't be mapped to a valid key
            if (!featureStateKey) {
                logger.warn(`Feature ${String(feature)} cannot be disabled: invalid feature key`);
                return;
            }
            if (!(featureStateKey in get().features)) {
                logger.warn(`Feature '${String(featureStateKey)}' does not exist in the store`);
                return;
            }
            set(state => ({
                features: {
                    ...state.features,
                    [featureStateKey]: false
                }
            }), false, { type: 'disableFeature', feature: featureStateKey });
        },
        setFeatureState: (feature, isEnabled) => {
            // Convert to a valid feature state key
            const featureStateKey = convertFeatureKeyToChatFeature(feature);
            // Skip if feature can't be mapped to a valid key
            if (!featureStateKey) {
                logger.warn(`Feature ${String(feature)} state cannot be set: invalid feature key`);
                return;
            }
            if (!(featureStateKey in get().features)) {
                logger.warn(`Feature '${String(featureStateKey)}' does not exist in the store`);
                return;
            }
            set(state => ({
                features: {
                    ...state.features,
                    [featureStateKey]: isEnabled
                }
            }), false, { type: 'setFeatureState', feature: featureStateKey, isEnabled });
        }
    };
}
