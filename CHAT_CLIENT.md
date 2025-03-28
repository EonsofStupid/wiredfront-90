
# WiredFront Chat Client Architecture

## Core Architecture Principles

1. **Isolation & Independence**

   - ALL chat code lives in `src/components/chat`
   - ChatBridge is the ONLY communication interface with the outside app
   - Self-contained CSS stored in dedicated style files
   - No direct imports from outside the chat module

2. **Directory Structure**

   ```
   src/components/chat/
   ├── chatBridge.ts       # Primary communication interface
   ├── ChatContainer.tsx   # Main container component
   ├── ChatProvider.tsx    # Context provider
   ├── chat-structure/     # Core UI structure components
   │   ├── container/      # Main container layout
   │   ├── content/        # Content area
   │   ├── header/         # Chat header
   │   ├── input/          # Input components
   │   ├── messages/       # Message display
   │   └── sidebar/        # Sidebar components
   ├── features/           # Feature-specific modules
   │   ├── conversations/  # Conversation management
   │   ├── modes/          # Chat mode switching
   │   ├── tokens/         # Token management
   │   └── [more features] # Other self-contained features
   ├── hooks/              # Custom hooks
   ├── messaging/          # Message handling logic
   ├── providers/          # Context providers
   ├── shared/             # Shared UI components
   ├── store/              # State management
   │   ├── actions/        # Store actions
   │   ├── conversation/   # Conversation store
   │   ├── token/          # Token store
   │   └── types/          # Store types
   ├── styles/             # CSS styling
   │   ├── tokens.css      # CSS variables
   │   ├── components.css  # Component styles
   │   └── animations.css  # Animation styles
   └── types/              # Type definitions
   ```

3. **State Management**

   - **Global State (Zustand)**: Centralized stores for app-wide state
     ```typescript
     interface ChatStore {
       isOpen: boolean;
       isMinimized: boolean;
       position: ChatPosition;
       currentMode: ChatMode;
       features: Record<string, boolean>;
       providers: Provider[];
       currentProvider: Provider | null;
     }
     ```

   - **Component State (Jotai)**: Atomic state for UI components
     ```typescript
     // Component-level atoms 
     const inputValueAtom = atom('');
     const isTypingAtom = atom(false);
     const messageListAtom = atom<Message[]>([]);
     ```

4. **ChatBridge Communication Pattern**

   All external communication must go through ChatBridge:
   ```typescript
   // External app code
   import { ChatBridge } from '@/components/chat/chatBridge';

   // Send a message
   ChatBridge.sendMessage('Hello');
   
   // Get chat state
   const state = ChatBridge.getChatState();
   
   // Update settings
   ChatBridge.updateChatSettings({ 
     currentMode: 'dev', 
     features: { tokenEnforcement: true }
   });
   ```

5. **Type System Structure**

   - **Single source of truth**: All types defined in `src/components/chat/types/`
   - **Clear hierarchy**: Core types → Store types → Component types
   - **Consistent naming**: Descriptive, consistent naming conventions
   - **Export strategy**: Proper barrel exports through index files

6. **CSS Architecture**

   - **Scoped styles**: All styles scoped to `.chat-*` namespace
   - **Variable-based**: Use of CSS variables for theming
   - **Component isolation**: Each component's styles in dedicated files 
   - **No leakage**: Chat styles can't affect rest of app

## Feature Implementation

1. **Message Handling**
   - MessageManager for message state and operations
   - Clear typing for all message operations
   - Structured storage of messages by conversation

2. **Conversation Management**
   - Full CRUD operations for conversations
   - Proper metadata handling
   - Switching between conversations

3. **Chat Modes**
   - Mode-specific components and UI
   - Proper transitions between modes
   - Mode metadata and settings

4. **Token Management**
   - Token balance tracking
   - Usage limits and enforcement
   - User feedback and warnings

5. **Provider Management**
   - Available providers list
   - Provider switching
   - Model selection

## Testing & Quality

1. **Isolation Testing**
   - Each component testable in isolation
   - Clear mocking boundaries
   - Interface-driven testing

2. **Type Safety**
   - Comprehensive type coverage
   - No implicit any types
   - Proper generic constraints

3. **Performance**
   - Memoization for expensive operations
   - Virtualized message lists
   - Optimized re-renders

## Integration with External Systems

1. **App → Chat**
   - All settings passed through ChatBridge
   - Features toggled via feature flags
   - Clear API for external control

2. **Chat → App** 
   - Event handlers for state changes
   - Callbacks for important actions
   - Strongly typed event payloads

## Enhancements Roadmap

1. **Performance Optimizations**
   - Message virtualization for large conversations
   - Lazy loading of features
   - Optimized re-rendering

2. **Advanced Features**
   - Voice-to-text integration
   - Knowledge base connections
   - GitHub integration
   - Image mode support

3. **Developer Experience**
   - Comprehensive documentation
   - Component playground
   - Testing utilities
