
// Export all stores from a central location

// Global Zustand stores
export {
  useChatModeStore,
  useCurrentMode,
  useModeActions
} from './global/chatModeStore';

export {
  useChatMessageStore,
  useMessages,
  useMessageActions
} from './global/chatMessageStore';

export {
  useChatSessionStore,
  useCurrentSession,
  useSessions,
  useSessionActions
} from './global/chatSessionStore';

// UI Jotai stores
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
