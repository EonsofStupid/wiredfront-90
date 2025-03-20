// Types
export * from './types';

// Atoms
export * from './atoms';

// Hooks (to be implemented)
export const useTheme = () => {
  // TODO: Implement hook that combines all theme atoms
  return {
    // state
    mode: 'system' as const,
    colorScheme: 'light' as const,
    isDark: false,

    // actions
    setMode: () => {},
    setColorScheme: () => {},
    reset: () => {},
    initialize: () => {}
  };
};
