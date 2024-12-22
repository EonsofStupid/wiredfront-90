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

export class ConnectionError extends WebSocketError {
  constructor(message: string, metadata?: Record<string, any>) {
    super(message, 'CONNECTION_ERROR', metadata);
    this.name = 'ConnectionError';
  }
}

export class AuthenticationError extends WebSocketError {
  constructor(message: string, metadata?: Record<string, any>) {
    super(message, 'AUTH_ERROR', metadata);
    this.name = 'AuthenticationError';
  }
}

export class MessageError extends WebSocketError {
  constructor(message: string, metadata?: Record<string, any>) {
    super(message, 'MESSAGE_ERROR', metadata);
    this.name = 'MessageError';
  }
}