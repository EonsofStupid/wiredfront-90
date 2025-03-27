
// Re-export all stores
export * from './chat-session';

// Create temporary useUIStore placeholder to resolve errors
export const useUIStore = () => {
  return {
    layout: {
      sidebarExpanded: true,
    },
    toggleSidebar: () => {},
  };
};
