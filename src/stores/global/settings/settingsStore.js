import { logger } from '@/services/chat/LoggingService';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
const defaultSettings = {
    locale: 'en-US',
    prefersReducedMotion: false,
    developerMode: false,
    defaultView: 'dashboard',
    refreshInterval: 30000,
    notifications: true,
    timezone: 'UTC',
    highContrast: false,
    reduceMotion: false,
    largeText: false,
    username: '',
    language: 'en',
    livePreview: {
        enabled: false,
        autoStart: false,
        logLevel: 'info'
    }
};
const defaultCacheSettings = {
    enabled: false,
    ttl: 3600,
    maxSize: 100,
    redis: {
        host: 'localhost',
        port: 6379,
        tls: false,
        database: 0,
    },
};
export const useSettingsStore = create()(devtools(persist((set) => ({
    settings: defaultSettings,
    dashboardLayout: { panels: [] },
    notifications: {
        email: true,
        push: true,
        frequency: 'daily',
        types: ['alerts', 'updates'],
        marketing: false,
    },
    cache: defaultCacheSettings,
    updateSettings: (updates) => {
        set(state => ({
            settings: { ...state.settings, ...updates }
        }));
        logger.info('Settings updated', { updates });
    },
    resetSettings: () => {
        set({
            settings: defaultSettings,
            dashboardLayout: { panels: [] },
            notifications: {
                email: true,
                push: true,
                frequency: 'daily',
                types: ['alerts', 'updates'],
                marketing: false,
            },
            cache: defaultCacheSettings
        });
        logger.info('Settings reset to defaults');
    },
    saveDashboardLayout: (layout) => {
        set({ dashboardLayout: layout });
        logger.info('Dashboard layout saved', { layout });
    },
    updateNotifications: (settings) => {
        set(state => ({
            notifications: { ...state.notifications, ...settings }
        }));
        logger.info('Notification settings updated', { settings });
    },
    updateCacheSettings: (settings) => {
        set(state => ({
            cache: { ...state.cache, ...settings }
        }));
        logger.info('Cache settings updated', { settings });
    }
}), {
    name: 'app-settings',
    partialize: (state) => ({
        settings: state.settings,
        dashboardLayout: state.dashboardLayout,
        notifications: state.notifications,
        cache: state.cache,
    })
}), {
    name: 'SettingsStore',
    enabled: process.env.NODE_ENV !== 'production'
}));
// Selector hooks
export const useAppSettings = () => useSettingsStore(state => state.settings);
export const useDashboardLayout = () => useSettingsStore(state => state.dashboardLayout);
export const useNotificationSettings = () => useSettingsStore(state => state.notifications);
export const useCacheSettings = () => useSettingsStore(state => state.cache);
