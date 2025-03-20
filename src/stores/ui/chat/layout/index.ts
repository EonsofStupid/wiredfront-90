// Types
export * from './types';

// Atoms
export * from './atoms';

// Hooks (to be implemented)
export const useChatLayout = () => {
  // TODO: Implement hook that combines all layout atoms
  return {
    // state
    isMinimized: false,
    scale: 1,
    showSidebar: false,
    uiPreferences: {
      theme: 'dark',
      fontSize: 'medium',
      messageBehavior: 'enter_send',
      notifications: true,
      showTimestamps: true
    },

    // actions
    toggleMinimized: () => {},
    setMinimized: () => {},
    setScale: () => {},
    toggleSidebar: () => {},
    setSidebar: () => {},
    updatePreferences: () => {},
    reset: () => {},
    saveToStorage: async () => true,
    loadFromStorage: async () => true,
    initialize: async () => {}
  };
};
