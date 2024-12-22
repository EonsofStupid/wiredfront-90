export class WebSocketError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly metadata?: Record<string, any>
  ) {
    super(message);
    this.name = 'WebSocketError';
  }
}

export class TokenExpiredError extends WebSocketError {
  constructor(message: string = 'Authentication token expired') {
    super(message, 'TOKEN_EXPIRED');
    this.name = 'TokenExpiredError';
  }
}

export class MessageSendError extends WebSocketError {
  constructor(
    message: string = 'Failed to send message',
    public readonly messageId: string,
    public readonly retryAttempt: number
  ) {
    super(message, 'MESSAGE_SEND_FAILED', { messageId, retryAttempt });
    this.name = 'MessageSendError';
  }
}

export class OpenAIError extends WebSocketError {
  constructor(message: string, public readonly openAIErrorCode: string) {
    super(message, 'OPENAI_ERROR', { openAIErrorCode });
    this.name = 'OpenAIError';
  }
}