
// Action types
export const CLEAR_MESSAGES = 'chat/clearMessages';
export const SEND_EVENT = 'chat/sendEvent';

/**
 * Clear all messages in the current chat session
 */
export const clearMessages = () => ({
  type: CLEAR_MESSAGES
});

/**
 * Send a custom event through the chat bridge
 * @param eventType The type of event
 * @param data Event data payload
 */
export const sendEvent = (eventType: string, data: any) => ({
  type: SEND_EVENT,
  payload: {
    eventType,
    data
  }
});
