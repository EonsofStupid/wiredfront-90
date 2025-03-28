# WiredFront - AI Orchestration Architecture

## Core Architecture Principles

1. **Isolation & Independence**

   - ALL chat code lives in `src/components/chat`
   - ChatBridge is the ONLY communication interface with the outside app
   - Self-contained CSS stored in dedicated style files
   - No direct imports from outside the chat module

2. **Directory Structure**

   ```
   src/
   ├─ components/chat/          # Chat client UI components
   │   ├─ chatBridge.ts         # Legacy bridge (forwards to modules/ChatBridge)
   │   ├─ ChatContainer.tsx     # Main container component
   │   ├─ ChatProvider.tsx      # Context provider
   │   ├─ hooks/                # Chat-specific hooks
   │   ├─ messaging/            # Message handling
   │   ├─ providers/            # Context providers
   │   ├─ store/                # Chat UI state
   │   └─ types/                # Chat-specific types
   │
   ├─ modules/                  # Core orchestration modules
   │   ├─ ChatBridge/           # Primary communication interface
   │   ├─ ModeManager/          # Mode switching and context
   │   ├─ VectorBridge/         # Vector store abstraction
   │   ├─ ModelBridge/          # Model provider and fallbacks
   │   ├─ PromptLogger/         # Logging and analytics
   │   └─ AdminOverlay/         # Admin monitoring panel
   │
   ├─ services/                 # Support services
   │   ├─ chat/                 # Chat support services
   │   ├─ rag/                  # RAG services
   │   └─ llm/                  # LLM integration services
   │
   ├─ types/                    # Global types
   │   ├─ chat/                 # Chat type definitions
   │   │   ├─ communication.ts  # Message envelope types
   │   │   ├─ enums.ts          # Shared enums
   │   │   └─ bridge.ts         # Bridge interfaces
   ```

3. **Orchestration Architecture**

   External applications:
   ```
   apps/
   ├─ orchestrator-rs/          # Rust-based core router (future)
   ├─ orchestrator-py/          # Python LLM executor (future)
   └─ vector-server/            # Optional vector DB (future)
   ```

4. **State Management**

   - **Global State (Zustand)**: Centralized stores for app-wide state
     ```typescript
     // Chat global state
     interface ChatStore {
       isOpen: boolean;
       isMinimized: boolean;
       position: ChatPosition;
       currentMode: ChatMode;
       features: Record<string, boolean>;
       providers: Provider[];
       currentProvider: Provider | null;
     }
     
     // Document global state
     interface DocumentStore {
       documents: Document[];
       currentDocument: Document | null;
       isLoading: boolean;
       // ...
     }
     
     // Project global state
     interface ProjectStore {
       projects: Project[];
       currentProject: Project | null;
       collaborators: User[];
       // ...
     }
     ```

   - **Component State (Jotai)**: Atomic state for UI components
     ```typescript
     // Component-level atoms 
     const inputValueAtom = atom('');
     const isTypingAtom = atom(false);
     const messageListAtom = atom<Message[]>([]);
     ```

5. **Communication Protocol**

   All AI request communications use a standardized message envelope:
   ```typescript
   interface MessageEnvelope {
     traceId: string;
     sessionId: string;
     mode: ChatMode;
     taskType: TaskType;
     input: string;
     context?: string[];
     systemPrompt?: string;
     // ...other fields
   }
   
   interface ResponseEnvelope {
     traceId: string;
     output: string;
     model: string;
     provider: string;
     tokensUsed: {
       input: number;
       output: number;
       total: number;
     };
     // ...other fields
   }
   ```

6. **Provider Fallback Logic**

   Each task type has a defined fallback chain:
   ```typescript
   const fallbackChains = {
     code_gen: ['codellama-70b', 'gpt-4o', 'claude-3-opus'],
     conversation: ['gpt-4o-mini', 'gpt-4o', 'claude-3-opus'],
     // ...other task types
   };
   ```

7. **Logging & Observability**

   Every AI interaction is logged with:
   - Trace ID for request tracking
   - Token usage for billing and quotas
   - Performance metrics
   - Cache and vector search information
   - Fallback paths taken

## Module Responsibilities

1. **ChatBridge**
   - Single communication interface between UI and backend
   - Message envelope creation and routing
   - Response handling and state updates

2. **ModeManager**
   - Mode-specific context and behavior
   - Route-based mode switching
   - Feature availability per mode

3. **VectorBridge**
   - Vector database abstraction
   - Multi-database support (Supabase, Pinecone, etc.)
   - Vector search and storage operations

4. **ModelBridge**
   - Provider selection and fallback chains
   - Token counting and optimization
   - Caching for frequent requests

5. **PromptLogger**
   - Comprehensive logging of all interactions
   - Token usage tracking for billing
   - Analytics for performance and quality

## Planned Enhancements

1. **Rust Orchestrator**
   - High-performance request routing
   - Advanced caching strategies
   - Token-aware context management

2. **Python LLM Executor**
   - Provider-specific API handling
   - Local model inference
   - Embedding generation for RAG

3. **AdminOverlay**
   - Real-time monitoring of AI usage
   - Cost and token analytics
   - Model performance comparisons

4. **Enhanced RAG**
   - Multi-database vector search
   - Hybrid search strategies
   - Source-aware context building

## App Refactoring Plan

Similar to the chat client refactoring, the app will be refactored to use:

1. **Global Stores (Zustand)**
   - DocumentStore
   - ProjectStore
   - ImageStore
   - TrainingStore
   - EditorStore

2. **Component State (Jotai)**
   - UI component state
   - Form state
   - Interaction state

3. **Modular Services**
   - DocumentService
   - ProjectService
   - ImageService
   - TrainingService
   - EditorService

4. **Shared Types**
   - Clear type definitions
   - Enum consistency
   - Interface contracts

This architecture enables:
- Clear separation of concerns
- Testable, isolated components
- Flexible provider switching
- Comprehensive logging and analytics
- Future extension to local models and vector stores
