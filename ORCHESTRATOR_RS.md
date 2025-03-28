
# Rust Orchestrator for WiredFront

## Overview

The Rust orchestrator is the central routing and control layer for the WiredFront AI system. It handles:

1. Fast, efficient routing of AI requests
2. Token-aware context management
3. Cache management
4. Vector database querying
5. Model selection and fallback logic
6. Usage tracking and logging

## Architecture

The Rust orchestrator is designed as an isolated service that communicates with:

- Frontend (via ChatBridge)
- Python LLM executor (for actual model API calls)
- Vector databases (Supabase pgvector, Pinecone, etc.)
- Database layer for logging and metrics

### Key Components

```
/src
├─ main.rs                    // Server bootstrap
├─ orchestrator_router.rs     // Task classification and routing logic
├─ cache.rs                   // LRU cache for prompt/response
├─ rag.rs                     // pgvector, Pinecone, Qdrant, Weaviate
├─ model_selector.rs          // Routing tier map per task
├─ usage_tracker.rs           // Token + cost per session/user
├─ pre_prompt_optimizer.rs    // Summarization, context shrinking
```

## Communication Protocol

All communications use a standardized message envelope format:

```json
{
  "trace_id": "uuid",
  "session_id": "project|user combo",
  "mode": "dev|chat|training|image",
  "task_type": "code_gen|doc_search|image_gen|bug_explain",
  "input": "string",
  "context": ["optional rag chunks"],
  "api_key_override": "optional scoped key",
  "fallback_level": 0
}
```

## Implementation Plan

1. **Core Framework Setup**
   - Actix-web or similar for HTTP API
   - Tokio for async runtime
   - Serde for JSON serialization

2. **Communication Channels**
   - HTTP endpoints for frontend communication
   - Internal queue for reliability
   - Service-to-service API for LLM executor

3. **Performance Considerations**
   - In-memory LRU cache
   - Connection pooling for databases
   - Tiered fallback for model selection

4. **Observability**
   - Structured logging with trace IDs
   - Metrics for request counts, latencies, token usage
   - Error tracking with fallback paths

## Development Timeline

1. **Phase 1: Core Routing (Current)**
   - Basic routing infrastructure
   - Message envelope handling
   - Simple model selection

2. **Phase 2: Vector Integration**
   - RAG integration
   - Context management
   - Caching layer

3. **Phase 3: Full Orchestration**
   - Complete fallback logic
   - Advanced caching strategies
   - Token optimization

4. **Phase 4: Admin Controls**
   - Model routing controls
   - Usage monitoring
   - Fine-tuning data preparation
