/**
 * Central export file for all stores
 */

// Domain stores with namespaced exports
export * from './auth';
export * from './core';
export * from './data';
export * from './features';
export * from './session';
export * from './settings';
export * from './ui';

// Global Zustand stores
export {
    useAuthActions, useAuthStore, useAuthToken, useIsAuthenticated, useUser
} from './global/auth/store';

export {
    useTheme as useGlobalTheme, usePreferences, useSettingsActions, useSettingsStore
} from './global/settings/store';

export {
    useAppVersion, useCoreActions, useCoreStore, useIsInitialized,
    useIsOnline,
    useLastActive
} from './global/core/store';

// Feature-specific Zustand stores
export {
    useChatModeStore,
    useCurrentMode,
    useModeActions
} from './features/chat/modeStore';

export {
    useChatMessageStore, useMessageActions, useMessages
} from './features/chat/messageStore';

export {
    useChatSessionStore,
    useCurrentSession, useSessionActions, useSessions
} from './features/chat/sessionStore';

export {
    useTokenBalance,
    useTokenEnforcementMode, useTokenStore, useTokenUsage
} from './features/tokens/store';

export {
    useSelectedVectorConfig, useVectorConfigurations, useVectorError, useVectorLoadingState, useVectorStore
} from './features/vector/store';

// Jotai UI stores
export {
    initializeLayoutAtom,
    // Atoms
    isMinimizedAtom, layoutStateAtom, loadLayoutFromStorageAtom, resetLayoutAtom,

    // Persistence
    saveLayoutToStorageAtom, scaleAtom, setMinimizedAtom,
    setScaleAtom, setSidebarAtom, showSidebarAtom,
    // Actions
    toggleMinimizedAtom, toggleSidebarAtom, uiPreferencesAtom, updateUIPreferencesAtom
} from './ui/chatLayoutStore';

export {
    // Atoms
    dockedAtom, dockedItemsAtom,
    dockingStateAtom, initializeDockingAtom, loadDockingFromStorageAtom, positionAtom, resetDockingAtom,

    // Persistence
    saveDockingToStorageAtom,
    // Actions
    setDockedAtom, setDockedItemAtom, setPositionAtom, toggleDockedAtom
} from './ui/chatDockingStore';

export {
    useActivePanel, useSidebarState, useTheme,
    // UI Store
    useUIStore
} from './ui/store';

export * from './global';
