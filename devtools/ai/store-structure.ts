
/**
 * WiredFront Store Structure Guidelines
 * 
 * This file defines the directory and file structure for state management
 * in the WiredFront application.
 */

export const storeStructure = {
  /**
   * Global Stores
   * 
   * Location: /src/stores
   * Purpose: Application-wide state that persists across the entire app
   */
  globalStores: {
    directory: '/src/stores',
    pattern: {
      index: 'Export all store modules',
      auth: 'Authentication-related state',
      ui: 'UI preferences and layout state',
      settings: 'User settings and preferences',
      data: 'Shared data caches',
      role: 'User role and permissions'
    },
    fileStructure: `
      /src/stores/
        ├── index.ts              # Re-exports all stores
        ├── auth/
        │   ├── index.ts          # Re-exports auth store
        │   ├── store.ts          # Main auth store implementation
        │   └── types.ts          # Auth-related types
        ├── ui/
        │   ├── index.ts
        │   ├── store.ts          # UI state store
        │   └── types.ts          # UI-related types
        ├── settings/
        │   ├── index.ts
        │   ├── store.ts          # Settings store implementation
        │   └── types.ts          # Settings-related types
        ├── data/
        │   ├── index.ts
        │   ├── store.ts          # Data cache store
        │   └── types.ts          # Data-related types
        └── core/                 # Shared store utilities
            ├── index.ts
            ├── middleware.ts     # Custom middleware
            ├── types.ts          # Common store types
            └── utils.ts          # Store utility functions
    `
  },
  
  /**
   * Feature State
   * 
   * Location: /src/components/{feature}/store
   * Purpose: State specific to a particular feature or module
   */
  featureStores: {
    directory: '/src/components/{feature}/store',
    pattern: {
      index: 'Export store and types',
      store: 'Feature-specific store implementation',
      types: 'Feature-specific types',
      actions: 'Store actions organized by domain',
      core: 'Core store initialization',
      ui: 'UI-specific actions',
      features: 'Feature flag and capability actions'
    },
    fileStructure: `
      /src/components/chat/store/
        ├── index.ts                # Re-exports everything
        ├── chatStore.ts            # Main chat store
        ├── types/
        │   └── chat-store-types.ts # Chat store type definitions
        ├── core/
        │   ├── initialization.ts   # Store initialization
        │   └── store.ts            # Core store utilities
        ├── features/
        │   └── actions.ts          # Feature-related actions
        └── ui/
            └── actions.ts          # UI-related actions
    `
  },
  
  /**
   * Jotai Structure
   * 
   * Location: /src/components/{feature}/atoms
   * Purpose: Component-local state using Jotai atoms
   */
  jotaiStructure: {
    directory: '/src/components/{feature}/atoms',
    pattern: {
      'ui-atoms.ts': 'UI-related atoms',
      'state-atoms.ts': 'Feature state atoms',
      'derived-atoms.ts': 'Computed/derived atoms',
      'tracked-atoms.ts': 'Middleware-wrapped atoms'
    },
    fileStructure: `
      /src/components/chat/atoms/
        ├── ui-atoms.ts           # UI state atoms
        ├── message-atoms.ts      # Message-related atoms
        ├── session-atoms.ts      # Session-related atoms
        └── tracked-atoms.ts      # All middleware-wrapped atoms
    `,
    middlewarePattern: `
      // Example pattern for tracked atoms
      import { atom } from 'jotai';
      import { atomWithStorage } from 'jotai/utils';
      
      // Base atom - internal only, not exported
      const basePositionAtom = atom({ x: 0, y: 0 });
      
      // Tracked atom - exported for use
      export const trackedPositionAtom = atomWithMiddleware(
        basePositionAtom,
        {
          onWrite: (next) => {
            // Validation, logging, etc.
            return next;
          },
          debugLabel: 'position'
        }
      );
    `
  },
  
  /**
   * Custom Hooks for State Access
   * 
   * Location: /src/components/{feature}/hooks
   * Purpose: Encapsulate state access logic in custom hooks
   */
  stateHooks: {
    directory: '/src/components/{feature}/hooks',
    pattern: {
      'use{Feature}State.ts': 'Custom hook accessing feature state',
      'use{Feature}Actions.ts': 'Custom hook for feature actions',
      'use{Feature}TrackedAtoms.ts': 'Hook for accessing tracked atoms'
    },
    fileStructure: `
      /src/components/chat/hooks/
        ├── useChatState.ts       # Access chat state
        ├── useChatActions.ts     # Perform chat actions
        └── useChatTrackedAtoms.ts # Access tracked atoms
    `,
    hooksPattern: `
      // Example tracked atoms hook
      import { useAtom } from 'jotai';
      import { 
        trackedMessageAtom,
        trackedInputAtom,
        trackedVisibilityAtom
      } from '../atoms/tracked-atoms';
      
      export function useChatTrackedAtoms() {
        const [message, setMessage] = useAtom(trackedMessageAtom);
        const [input, setInput] = useAtom(trackedInputAtom);
        const [isVisible, setIsVisible] = useAtom(trackedVisibilityAtom);
        
        return {
          message,
          setMessage,
          input,
          setInput,
          isVisible,
          setIsVisible
        };
      }
    `
  }
};
