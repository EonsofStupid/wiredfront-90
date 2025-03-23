# WiredFront Chat Client

## Core Rules

1. **Isolation**

   - ALL chat code lives in `src/components/chat`
   - NO chat logic outside this directory
   - NO prop drilling
   - Self-contained CSS

2. **State Management**

   ```typescript
   // Global State (Zustand)
   // src/stores/chat/chat.store.ts
   interface ChatStore {
     mode: ChatMode;        // chat, dev, image, training, code
     sessionId: string;     // Current session
     isChatOpen: boolean;   // Global visibility
     settings: ChatSettings;// Global settings
   }

   // Component State (Jotai)
   // src/components/chat/atoms/*
   - Input state
   - Message state
   - UI state
   ```

3. **Feature Flags**

   - Database-driven from `public.feature_flags`
   - Managed through Zustand store
   - Controls feature availability

4. **CSS Rules**
   - All styles scoped to chat components
   - Database-driven theme tokens
   - NO global CSS leaks
   - NO inline styles

## Current Structure

```
src/components/chat/
├── atoms/          # Jotai atoms
├── components/     # UI components
├── features/       # Feature modules
├── hooks/          # Custom hooks
├── messaging/      # Message handling
├── modules/        # Core modules
├── providers/      # Context providers
├── store/          # Zustand store
├── styles/         # CSS
├── ChatProvider.tsx
├── DraggableChat.tsx
└── Message.tsx
```

## Database Integration

1. **Theme Tables** (Existing)

   - `public.theme_tokens`
   - `public.theme_categories`
   - `public.themes`

2. **Feature Management** (Existing)

   - `public.feature_flags`
   - `public.user_features`

3. **AI/Vector Store** (Existing)
   - `public.project_vectors`
   - `public.vector_store_configs`
   - `public.user_ai_access`

## Architecture Stack

1. **Python (Driver Layer)**

   ```python
   # AI Orchestration (FastAPI)
   from fastapi import FastAPI
   from pydantic import BaseModel

   class ChatSession(BaseModel):
       mode: ChatMode
       context: dict
       memory: dict

   # Prompt Engine
   from jinja2 import Template
   prompts = {
       'chat': Template("{{ context }} {{ message }}"),
       'dev': Template("{{ codebase }} {{ query }}")
   }
   ```

2. **Rust (Core Systems)**

   ```rust
   // Memory Layer (axum)
   pub struct Memory {
       short_term: HashMap<String, Vec<Message>>,
       long_term: VectorStore,
       context: Context
   }

   // Vector Search
   pub struct VectorStore {
       embeddings: Vec<Embedding>,
       index: HNSWIndex,
       metadata: HashMap<String, String>
   }
   ```

## Component Architecture

1. **AI Orchestration (Python/FastAPI)**

   - Route selection
   - Context management
   - Session handling
   - API integration

2. **Prompt Engine (Python)**

   - Template management
   - Context injection
   - Dynamic prompting
   - Chain orchestration

3. **Memory Layer (Rust/gRPC)**

   - Short-term: Redis
   - Long-term: Vector DB
   - Context window
   - Memory injection

4. **Vector Search (Rust)**

   - pgvector integration
   - Similarity search
   - Metadata handling
   - Index management

5. **Database Layer (Shared)**
   - Supabase/Postgres
   - Redis caching
   - Vector storage
   - Session state

## Memory Strategy

1. **Short-Term Memory**

   ```typescript
   interface STM {
     sessionId: string;
     messages: Message[];
     context: Context;
     expiry: number;
   }
   ```

2. **Long-Term Memory**

   ```typescript
   interface LTM {
     vectors: Vector[];
     metadata: Metadata;
     namespace: string;
     indexes: Index[];
   }
   ```

3. **Context Management**
   ```typescript
   interface Context {
     codebase?: CodeContext;
     conversation?: ConversationContext;
     system?: SystemContext;
     user?: UserContext;
   }
   ```

## Service Integration

1. **Python Services**

   ```typescript
   interface AIServices {
     orchestration: FastAPIService;
     prompts: PromptEngine;
     routing: ModelRouter;
     context: ContextManager;
   }
   ```

2. **Rust Services**
   ```typescript
   interface CoreServices {
     memory: MemoryService;
     vectors: VectorService;
     search: SearchEngine;
     websocket: WSServer;
   }
   ```

## Implementation Steps

1. **State Cleanup**

   - Move global state to Zustand
   - Move component state to Jotai
   - Remove ChatProvider

2. **CSS Isolation**

   - Scope all styles to chat
   - Use theme tokens
   - Remove global styles

3. **Feature Integration**

   - Use existing feature flags
   - Integrate with Zustand
   - Remove redundant checks

4. **Component Cleanup**
   - Remove prop drilling
   - Use atomic state
   - Clean up exports

## Type Definitions

```typescript
// Chat Modes
type ChatMode = "chat" | "dev" | "image" | "training" | "code";

// Message Types
interface Message {
  id: string;
  content: string;
  type: "user" | "assistant";
  timestamp: Date;
}

// Feature Flags
interface FeatureFlags {
  voice: boolean;
  rag: boolean;
  github: boolean;
  codeAssistant: boolean;
}

// Theme Config
interface ThemeConfig {
  tokens: Record<string, string>;
  mode: "light" | "dark" | "system";
}
```

## Testing Requirements

1. **Unit Tests**

   - Component tests
   - State management
   - Feature flags
   - Theme integration

2. **Integration Tests**

   - Chat flow
   - State updates
   - Feature toggles
   - Theme changes

3. **Performance Tests**
   - Load time
   - State updates
   - CSS performance
   - Memory usage

## Performance Optimizations

1. **Memory Management**

   - Rust-based memory segmentation
   - Redis caching layer
   - Context window optimization
   - Garbage collection

2. **Search Performance**

   - HNSW indexing
   - Parallel search
   - Metadata filtering
   - Cache warming

3. **API Optimization**
   - gRPC for internal comms
   - WebSocket for streaming
   - Connection pooling
   - Rate limiting
