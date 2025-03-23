/**
 * WiredFront State Management Guidelines
 * 
 * This file defines when and how to use different state management approaches in
 * the WiredFront application, particularly focusing on Zustand vs Jotai usage.
 */

export const stateGuidelines = {
  /**
   * Zustand Guidelines
   * 
   * Use Zustand for global application state that needs to be accessed
   * across multiple components or pages.
   */
  zustand: {
    useCases: [
      'Global application state',
      'User authentication state',
      'Theme and layout preferences',
      'Cross-cutting features that span multiple components',
      'Persistent state that needs to survive page reloads'
    ],
    
    implementation: {
      slicePattern: true, // Use slices for modular state management
      typedStores: true,  // Always define proper TypeScript interfaces
      middleware: ['persist', 'devtools', 'immer'],
      
      example: `
        // Example of a well-structured Zustand store
        import { create } from 'zustand';
        import { devtools, persist } from 'zustand/middleware';
        
        // Step 1: Define the state interface
        interface ChatState {
          messages: Message[];
          isMinimized: boolean;
          // ... other state properties
        }
        
        // Step 2: Define actions interface
        interface ChatActions {
          addMessage: (message: Message) => void;
          toggleMinimize: () => void;
          // ... other actions
        }
        
        // Step 3: Combine into a single store type
        type ChatStore = ChatState & ChatActions;
        
        // Step 4: Create the store with middleware
        export const useChatStore = create<ChatStore>()(
          devtools(
            persist(
              (set) => ({
                // Initial state
                messages: [],
                isMinimized: false,
                
                // Actions
                addMessage: (message) => set((state) => ({
                  messages: [...state.messages, message]
                })),
                toggleMinimize: () => set((state) => ({
                  isMinimized: !state.isMinimized
                }))
              }),
              { name: 'chat-store' } // Persist configuration
            )
          )
        );
      `
    }
  },
  
  /**
   * Jotai Guidelines
   * 
   * Use Jotai for component-local state that doesn't need to be globally accessible
   * but may be shared among closely related components.
   */
  jotai: {
    useCases: [
      'Component-local state',
      'Derived state calculations',
      'Form state management',
      'UI-specific state',
      'State that needs to be reactive to changes in other atoms'
    ],
    
    implementation: {
      atomWithMiddleware: true, // Always wrap atoms with middleware for consistency
      colocatedAtoms: true,     // Store atoms next to their components
      trackedAtomsPattern: true, // Use tracked atoms for component-specific state
      
      example: `
        // Example of well-structured Jotai atoms
        import { atom } from 'jotai';
        import { atomWithMiddleware } from '@/lib/jotai/middleware';
        
        // Base atom (internal use only)
        const baseInputValueAtom = atom('');
        
        // Tracked atom (exported for component use)
        export const trackedInputValueAtom = atomWithMiddleware(
          baseInputValueAtom,
          {
            middleware: {
              onWrite: (next) => {
                // Validation, side effects, etc.
                return next;
              }
            },
            debugLabel: 'inputValue'
          }
        );
        
        // Derived atom (calculated from other atoms)
        export const isInputValidAtom = atom(
          (get) => {
            const value = get(trackedInputValueAtom);
            return value.length > 0;
          }
        );
      `
    }
  },
  
  /**
   * Rules for tracked atoms
   * 
   * These rules define how to properly implement tracked atoms
   * for component-specific state.
   */
  trackedAtoms: {
    rules: [
      'Always export only tracked atoms, never base atoms',
      'Use atomWithMiddleware to wrap all base atoms',
      'Colocate tracked atoms with their respective components',
      'Create custom hooks that consume tracked atoms for related components',
      'Add debug labels to all tracked atoms'
    ]
  },
  
  /**
   * Guidelines for Zustand slices
   */
  slices: {
    rules: [
      'Create separate slice files for different domains',
      'Export typed slice creators, not the slices themselves',
      'Define clear interfaces for state and actions',
      'Use immer for immutable updates when appropriate',
      'Add descriptive action types for devtools'
    ]
  },
  
  /**
   * When to use each approach
   */
  decisionMatrix: {
    useZustand: [
      'State needs to be accessed by multiple unrelated components',
      'State needs to persist across page reloads',
      'Complex state with many interdependent fields',
      'State that forms the core application data model',
      'State that needs transaction-like updates (multiple fields at once)'
    ],
    useJotai: [
      'UI-specific state (open/closed, selected tabs, etc.)',
      'Form input values and validation',
      'Derived or computed values',
      'Component-specific settings',
      'State that primarily affects a single component hierarchy'
    ]
  }
};
