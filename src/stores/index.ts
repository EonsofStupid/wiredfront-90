
/**
 * Central export file for all stores
 */

// Domain stores with namespaced exports
export * from './auth';
export * from './data';
export * from './settings';
export * from './ui';
export * from './features';
export * from './session';
export * from './core';

// Global Zustand stores
export {
  useChatModeStore,
  useCurrentMode,
  useModeActions
} from './features/chat/modeStore';

export {
  useChatMessageStore,
  useMessages,
  useMessageActions
} from './features/chat/messageStore';

export {
  useChatSessionStore,
  useCurrentSession,
  useSessions,
  useSessionActions
} from './features/chat/sessionStore';

// Jotai UI stores
export {
  // Atoms
  isMinimizedAtom,
  scaleAtom,
  showSidebarAtom,
  uiPreferencesAtom,
  layoutStateAtom,
  
  // Actions
  toggleMinimizedAtom,
  setMinimizedAtom,
  setScaleAtom,
  toggleSidebarAtom,
  setSidebarAtom,
  updateUIPreferencesAtom,
  resetLayoutAtom,
  
  // Persistence
  saveLayoutToStorageAtom,
  loadLayoutFromStorageAtom,
  initializeLayoutAtom
} from './ui/chatLayoutStore';

export {
  // Atoms
  dockedAtom,
  positionAtom,
  dockedItemsAtom,
  dockingStateAtom,
  
  // Actions
  setDockedAtom,
  toggleDockedAtom,
  setPositionAtom,
  setDockedItemAtom,
  resetDockingAtom,
  
  // Persistence
  saveDockingToStorageAtom,
  loadDockingFromStorageAtom,
  initializeDockingAtom
} from './ui/chatDockingStore';
