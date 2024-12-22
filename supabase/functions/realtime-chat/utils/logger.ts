type LogLevel = 'info' | 'error' | 'debug' | 'warn';

interface ChatContext {
  conversation_id: string;
  active_personality: string;
  prompt_type: string;
}

interface LogEntry {
  timestamp: string;
  session_id: string;
  user_id: string;
  chat_context: ChatContext;
  input?: {
    raw_text: string;
    processed_text?: string;
  };
  response?: {
    generated_text: string;
    metadata: {
      tokens_used?: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
      };
      generation_time_ms: number;
    };
  };
  system_info: {
    function_name: string;
    execution_time_ms: number;
    status_code: number;
    server_location: string;
  };
  level: LogLevel;
  message: string;
}

export const logger = {
  createLogEntry(
    level: LogLevel,
    message: string,
    sessionId: string,
    userId: string,
    context: Partial<LogEntry> = {}
  ): LogEntry {
    const startTime = performance.now();
    
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      session_id: sessionId,
      user_id: userId,
      chat_context: {
        conversation_id: context.chat_context?.conversation_id || crypto.randomUUID(),
        active_personality: context.chat_context?.active_personality || 'default',
        prompt_type: context.chat_context?.prompt_type || 'message'
      },
      input: context.input,
      response: context.response,
      system_info: {
        function_name: 'realtime-chat',
        execution_time_ms: Math.round(performance.now() - startTime),
        status_code: 200,
        server_location: 'edge-function'
      },
      level,
      message
    };

    console.log(JSON.stringify(logEntry));
    return logEntry;
  },

  info(message: string, sessionId: string, userId: string, context?: Partial<LogEntry>) {
    return this.createLogEntry('info', message, sessionId, userId, context);
  },

  error(message: string, sessionId: string, userId: string, error?: unknown, context?: Partial<LogEntry>) {
    const errorContext = {
      ...context,
      system_info: {
        ...context?.system_info,
        status_code: error instanceof Error ? 500 : 400
      }
    };
    return this.createLogEntry('error', message, sessionId, userId, errorContext);
  },

  debug(message: string, sessionId: string, userId: string, context?: Partial<LogEntry>) {
    return this.createLogEntry('debug', message, sessionId, userId, context);
  },

  warn(message: string, sessionId: string, userId: string, context?: Partial<LogEntry>) {
    return this.createLogEntry('warn', message, sessionId, userId, context);
  }
};