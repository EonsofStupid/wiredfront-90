import { logger } from '@/services/chat/LoggingService';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
export const useCoreStore = create()(devtools(persist((set) => ({
    appVersion: '0.1.0',
    featureFlags: {
        betaFeatures: false,
        experimentalTools: false
    },
    isOnboarded: false,
    setFeatureFlag: (flag, value) => {
        set(state => ({
            featureFlags: { ...state.featureFlags, [flag]: value }
        }));
        logger.info('Feature flag updated', { flag, value });
    },
    setOnboarded: (value) => {
        set({ isOnboarded: value });
        logger.info('Onboarding status updated', { isOnboarded: value });
    }
}), {
    name: 'app-core'
}), {
    name: 'CoreStore',
    enabled: process.env.NODE_ENV !== 'production'
}));
// Selector hooks
export const useFeatureFlags = () => useCoreStore(state => state.featureFlags);
export const useIsOnboarded = () => useCoreStore(state => state.isOnboarded);
