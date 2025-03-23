
/**
 * WiredFront Naming Conventions
 * 
 * This file defines consistent naming patterns for components, stores,
 * atoms, and other elements in the WiredFront application.
 */

export const namingConventions = {
  /**
   * Zustand Store Naming
   */
  zustandStores: {
    storeHook: 'use{Feature}Store', // e.g., useChatStore, useAuthStore
    storeFile: '{feature}Store.ts', // e.g., chatStore.ts, authStore.ts
    sliceCreator: 'create{Feature}Slice', // e.g., createChatSlice, createAuthSlice
    stateInterface: '{Feature}State', // e.g., ChatState, AuthState
    actionsInterface: '{Feature}Actions', // e.g., ChatActions, AuthActions
    fullStoreType: '{Feature}Store', // e.g., ChatStore, AuthStore
    
    example: `
      // State interface
      interface ChatState {
        messages: Message[];
        isOpen: boolean;
      }
      
      // Actions interface
      interface ChatActions {
        addMessage: (message: Message) => void;
        toggleChat: () => void;
      }
      
      // Combined store type
      type ChatStore = ChatState & ChatActions;
      
      // Store hook
      export const useChatStore = create<ChatStore>()(...);
    `
  },
  
  /**
   * Jotai Atom Naming
   */
  jotaiAtoms: {
    baseAtom: 'base{State}Atom', // e.g., baseInputAtom, baseCounterAtom
    trackedAtom: 'tracked{State}Atom', // e.g., trackedInputAtom, trackedCounterAtom
    derivedAtom: '{derivedState}Atom', // e.g., isValidAtom, formattedValueAtom
    withStorage: '{state}Atom', // e.g., themeAtom, positionAtom (with storage)
    
    example: `
      // Base atom (internal)
      const baseInputAtom = atom('');
      
      // Tracked atom (exported)
      export const trackedInputAtom = atomWithMiddleware(baseInputAtom, {
        debugLabel: 'input'
      });
      
      // Derived atom
      export const isInputValidAtom = atom(
        (get) => get(trackedInputAtom).length > 0
      );
      
      // With storage
      export const themeAtom = atomWithStorage('theme', 'light');
    `
  },
  
  /**
   * Tracked Atoms Hooks
   */
  trackedAtomsHooks: {
    hook: 'use{Feature}TrackedAtoms', // e.g., useChatTrackedAtoms, useFormTrackedAtoms
    
    example: `
      export function useChatTrackedAtoms() {
        const [input, setInput] = useAtom(trackedInputAtom);
        const [isVisible, setIsVisible] = useAtom(trackedVisibilityAtom);
        
        return {
          input,
          setInput,
          isVisible,
          setIsVisible
        };
      }
    `
  },
  
  /**
   * Component Naming
   */
  components: {
    regular: '{Feature}{Purpose}', // e.g., ChatMessage, AuthForm
    container: '{Feature}Container', // e.g., ChatContainer, SidebarContainer
    layout: '{Feature}Layout', // e.g., AppLayout, AdminLayout
    provider: '{Feature}Provider', // e.g., ChatProvider, ThemeProvider
    
    example: `
      // Regular component
      export function ChatMessage({ message }: ChatMessageProps) {
        // ...
      }
      
      // Container component
      export function ChatContainer({ children }: PropsWithChildren) {
        // ...
      }
      
      // Layout component
      export function ChatLayout({ children }: PropsWithChildren) {
        // ...
      }
      
      // Provider component
      export function ChatProvider({ children }: PropsWithChildren) {
        // ...
      }
    `
  },
  
  /**
   * Hook Naming
   */
  hooks: {
    state: 'use{Feature}State', // e.g., useChatState, useAuthState
    action: 'use{Feature}Actions', // e.g., useChatActions, useAuthActions
    effect: 'use{Effect}', // e.g., useAutoScroll, useFetchData
    query: 'use{Entity}Query', // e.g., useUserQuery, useProjectsQuery
    mutation: 'use{Action}{Entity}', // e.g., useUpdateUser, useCreateProject
    
    example: `
      // State hook
      export function useChatState() {
        return useChatStore(
          (state) => ({
            messages: state.messages,
            isOpen: state.isOpen
          })
        );
      }
      
      // Actions hook
      export function useChatActions() {
        return useChatStore(
          (state) => ({
            addMessage: state.addMessage,
            toggleChat: state.toggleChat
          })
        );
      }
      
      // Effect hook
      export function useAutoScroll(ref: RefObject<HTMLElement>) {
        // ...
      }
      
      // Query hook
      export function useUserQuery(userId: string) {
        return useQuery(['user', userId], () => fetchUser(userId));
      }
      
      // Mutation hook
      export function useUpdateUser() {
        return useMutation((user) => updateUser(user));
      }
    `
  },
  
  /**
   * File Structure Naming
   */
  fileStructure: {
    component: '{ComponentName}.tsx', // e.g., ChatMessage.tsx
    hook: 'use{HookName}.ts', // e.g., useChatState.ts
    util: '{utility}.ts', // e.g., formatDate.ts
    types: '{feature}.types.ts', // e.g., chat.types.ts
    store: '{feature}Store.ts', // e.g., chatStore.ts
    atom: '{feature}-atoms.ts', // e.g., chat-atoms.ts
    
    folderStructure: `
      /src/components/chat/
        ├── Chat.tsx                 # Main component
        ├── components/              # Child components
        │   ├── ChatMessage.tsx
        │   ├── ChatInput.tsx
        │   └── ChatHeader.tsx
        ├── hooks/                   # Custom hooks
        │   ├── useChatState.ts
        │   └── useChatActions.ts
        ├── store/                   # Zustand store
        │   ├── chatStore.ts
        │   └── types.ts
        ├── atoms/                   # Jotai atoms
        │   ├── ui-atoms.ts
        │   └── message-atoms.ts
        └── utils/                   # Utilities
            └── formatMessage.ts
    `
  }
};
