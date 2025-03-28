
# Python LLM Executor for WiredFront

## Overview

The Python LLM executor is responsible for making actual API calls to language models and handling embeddings. It works in conjunction with the Rust orchestrator, which handles routing and decision-making.

## Key Responsibilities

1. Execute API calls to model providers (OpenAI, Anthropic, Gemini, etc.)
2. Run local inference via Ollama, vLLM, or other frameworks
3. Generate embeddings for vector search
4. Handle provider-specific error handling and retries

## Architecture

```
/app
├─ main.py                      # FastAPI entry point
├─ model_handlers/
│   ├─ openai.py                # GPT-3.5/4 APIs
│   ├─ anthropic.py             # Claude APIs
│   ├─ gemini.py                # Gemini APIs
│   ├─ local_model.py           # Ollama/vLLM handlers
│   └─ fallback.py              # Retry chains, confidence escalators
├─ embedding_engine/
│   └─ retriever.py             # Connects to vector DBs
├─ utils/
│   ├─ logger.py
│   ├─ summarizer.py
│   └─ compress_context.py
├─ agent_config.py              # Max token map, chain fallback map
```

## API Endpoints

```
POST /v1/generate
POST /v1/embed
POST /v1/image/generate
POST /v1/status
```

## Input/Output Format

### Input

```json
{
  "trace_id": "uuid",
  "task_type": "code_gen|conversation|etc",
  "provider": "openai|anthropic|gemini|local",
  "model": "gpt-4o|claude-3-opus|etc",
  "prompt": "User input text",
  "system_prompt": "Optional system instructions",
  "context": ["RAG context chunks"],
  "options": {
    "temperature": 0.7,
    "max_tokens": 1000,
    "top_p": 1.0
  }
}
```

### Output

```json
{
  "trace_id": "uuid",
  "output": "Generated response",
  "tokens_used": {
    "input": 123,
    "output": 456,
    "total": 579
  },
  "model_used": "gpt-4o",
  "provider": "openai",
  "processing_time_ms": 1234,
  "cache_hit": false,
  "error": null
}
```

## Implementation Plan

1. **Phase 1: Basic API Integration**
   - OpenAI integration
   - Anthropic integration
   - Basic error handling
   
2. **Phase 2: Advanced Features**
   - Local model integration (Ollama)
   - Token counting and limiting
   - Context compression
   
3. **Phase 3: Optimizations**
   - Parallel request handling
   - Response streaming
   - Advanced retry logic

## Tech Stack

- FastAPI for HTTP interface
- Pydantic for data validation
- AsyncIO for concurrent processing
- OpenAI/Anthropic/Google client libraries
- Optional: vLLM, Ollama for local inference

## Performance Considerations

- Connection pooling for API clients
- Resource-aware local model loading
- Efficient token counting
- Request timeouts and circuit breakers

## Deployment

The service is designed to be deployed as a Docker container, with the following options:

1. Basic service (API calls only)
2. Extended service (with embedding support)
3. Full service (with local model inference)
