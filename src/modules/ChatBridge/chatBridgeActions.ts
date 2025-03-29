
// Action types
export const CLEAR_MESSAGES = 'chat/clearMessages';
export const SEND_EVENT = 'chat/sendEvent';
export const UPDATE_TOKENS = 'chat/updateTokens';
export const UPDATE_SETTINGS = 'chat/updateSettings';

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

/**
 * Update token balance through the bridge
 * @param amount The amount to update (positive adds, negative subtracts)
 * @param options Additional options like reason
 */
export const updateTokens = (amount: number, options?: { reason?: string }) => ({
  type: UPDATE_TOKENS,
  payload: {
    amount,
    ...options
  }
});

/**
 * Update chat settings through the bridge
 * @param settings The settings to update
 */
export const updateSettings = (settings: Record<string, any>) => ({
  type: UPDATE_SETTINGS,
  payload: settings
});
