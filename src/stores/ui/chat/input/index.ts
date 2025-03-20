// Types
export * from './types';

// Atoms
export * from './atoms';

// Hooks (to be implemented)
export const useChatInput = () => {
  // TODO: Implement hook that combines all input atoms
  return {
    // state
    value: '',
    isWaitingForResponse: false,
    error: null,
    isComposing: false,
    lastSubmitted: null,

    // actions
    setValue: () => {},
    clear: () => {},
    setWaiting: () => {},
    setError: () => {},
    setComposing: () => {},
    submit: () => {},
    reset: () => {}
  };
};
