import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
export const createToggleActions = (set, get) => ({
    // Feature toggle actions
    toggleFeature: (feature) => {
        // Get the current state
        const state = get();
        const isCurrentlyEnabled = state.features?.[feature] ?? false;
        // Update state
        set((state) => ({
            features: {
                ...state.features,
                [feature]: !isCurrentlyEnabled,
            },
        }), false, { type: 'toggleFeature', feature, value: !isCurrentlyEnabled });
        // Log the change
        logger.info(`Feature ${feature} toggled to ${!isCurrentlyEnabled}`);
        // Record the change to database
        recordFeatureToggle(feature, isCurrentlyEnabled, !isCurrentlyEnabled)
            .catch(err => logger.error(`Failed to record feature toggle: ${err}`));
    },
    enableFeature: (feature) => {
        set((state) => ({
            features: {
                ...state.features,
                [feature]: true,
            },
        }), false, { type: 'enableFeature', feature });
        // Log the enablement
        logger.info(`Feature ${feature} enabled`);
        // Record the change to database
        const wasEnabled = get().features?.[feature] ?? false;
        if (!wasEnabled) {
            recordFeatureToggle(feature, false, true)
                .catch(err => logger.error(`Failed to record feature enable: ${err}`));
        }
    },
    disableFeature: (feature) => {
        set((state) => ({
            features: {
                ...state.features,
                [feature]: false,
            },
        }), false, { type: 'disableFeature', feature });
        // Log the disablement
        logger.info(`Feature ${feature} disabled`);
        // Record the change to database
        const wasEnabled = get().features?.[feature] ?? false;
        if (wasEnabled) {
            recordFeatureToggle(feature, true, false)
                .catch(err => logger.error(`Failed to record feature disable: ${err}`));
        }
    },
    setFeatureState: (feature, isEnabled) => {
        // Get the current state first
        const previousState = get().features?.[feature] ?? false;
        // Only update if it's different
        if (previousState !== isEnabled) {
            set((state) => ({
                features: {
                    ...state.features,
                    [feature]: isEnabled,
                },
            }), false, { type: 'setFeatureState', feature, isEnabled });
            // Log the state change
            logger.info(`Feature ${feature} set to ${isEnabled}`);
            // Record the change to database
            recordFeatureToggle(feature, previousState, isEnabled)
                .catch(err => logger.error(`Failed to record feature state change: ${err}`));
        }
    },
    // Provider actions
    updateChatProvider: (providers) => {
        set((state) => ({
            availableProviders: providers,
        }), false, { type: 'updateChatProvider', providers });
    },
    updateCurrentProvider: (provider) => {
        set((state) => ({
            currentProvider: provider,
        }), false, { type: 'updateCurrentProvider', provider });
    },
    updateAvailableProviders: (providers) => {
        set((state) => ({
            availableProviders: providers,
        }), false, { type: 'updateAvailableProviders', providers });
    },
});
// Record feature toggle to the database
async function recordFeatureToggle(featureName, oldValue, newValue) {
    try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData?.session)
            return;
        const userId = sessionData.session.user.id;
        await supabase.from('feature_toggle_history').insert({
            user_id: userId,
            feature_name: featureName,
            old_value: oldValue,
            new_value: newValue,
            metadata: {
                client_timestamp: new Date().toISOString(),
                client_type: 'web'
            }
        });
    }
    catch (error) {
        logger.error('Failed to record feature toggle', { error });
    }
}
