
# WiredFront Modules Architecture

This directory contains the core modules that enable the WiredFront architectural principles:

## Core Principles

1. **Modular-by-Design**: Each system component is self-contained with well-defined inputs/outputs.
2. **Bidirectional Flow**: All messaging uses explicit channels with structured metadata.
3. **Full Isolation of Features**: Each mode (Dev, Chat, Training, Image) has its own context.
4. **Full Logging from Day One**: Every operation is logged for telemetry and debugging.
5. **Built to Tailor and Evolve**: The system evolves through feedback and usage data.

## Module Structure

- **ChatBridge**: Primary communication channel between the app and chat components
- **ModeManager**: Manages different chat modes (Dev, Chat, Image, Training)
- **VectorBridge**: Abstracts vector search operations (RAG)
- **ModelBridge**: Handles model selection, fallbacks, and calling
- **PromptLogger**: Logs all prompts, responses, and metrics

## Usage Example

```typescript
// Using the ChatBridge
import { useChatBridge } from '@/modules/ChatBridge';

function MyComponent() {
  const chatBridge = useChatBridge();
  
  async function handleSendMessage() {
    await chatBridge.sendMessage('Hello, world!');
  }
  
  return <button onClick={handleSendMessage}>Send</button>;
}

// Using ModeManager
import { useMode } from '@/modules/ModeManager';

function ModeSwitcher() {
  const { currentMode, setMode, availableModes } = useMode();
  
  return (
    <select 
      value={currentMode} 
      onChange={(e) => setMode(e.target.value as any)}
    >
      {availableModes.map(mode => (
        <option key={mode.id} value={mode.id}>{mode.displayName}</option>
      ))}
    </select>
  );
}
```

## Message Structure

All messages include:
- `trace_id`: Unique identifier for tracking a request through the system
- `session_id`: Conversation or session identifier
- `timestamp`: When the message was created
- `metadata`: Additional context and tracking data

## Tracing and Logging

All operations are logged via the PromptLogger module, enabling:
- Performance tracking
- Error analysis
- Usage patterns
- Fine-tuning data collection
