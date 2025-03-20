// Type guard for checking if an action is valid
export const isValidAction = (action, type) => {
    return (typeof action === 'object' &&
        action !== null &&
        'type' in action &&
        action.type === type);
};
// Type guard for checking if a payload exists and matches expected type
export const hasPayload = (action, payloadGuard) => {
    return 'payload' in action && payloadGuard(action.payload);
};
// Type guard for User
export const isUser = (value) => {
    return (typeof value === 'object' &&
        value !== null &&
        'id' in value &&
        'email' in value &&
        'name' in value &&
        'role' in value &&
        'preferences' in value);
};
// Type guard for AsyncState
export const isAsyncState = (value) => {
    return (typeof value === 'object' &&
        value !== null &&
        'status' in value &&
        'error' in value &&
        'lastUpdated' in value);
};
// Type guard for UIState
export const isUIState = (value) => {
    return (typeof value === 'object' &&
        value !== null &&
        'theme' in value &&
        'sidebarOpen' in value &&
        'activePanel' in value);
};
// Type guard for AuthState
export const isAuthState = (value) => {
    return (typeof value === 'object' &&
        value !== null &&
        'user' in value &&
        'isAuthenticated' in value &&
        'token' in value);
};
// Type guard for DataState
export const isDataState = (value) => {
    return (typeof value === 'object' &&
        value !== null &&
        'metrics' in value &&
        'analytics' in value &&
        'lastFetch' in value &&
        isAsyncState(value));
};
// Type guard for SettingsState
export const isSettingsState = (value) => {
    return (typeof value === 'object' &&
        value !== null &&
        'preferences' in value &&
        'dashboardLayout' in value &&
        'notifications' in value);
};
// Type guard for NotificationSettings
export const isNotificationSettings = (value) => {
    return (typeof value === 'object' &&
        value !== null &&
        'email' in value &&
        'push' in value &&
        'frequency' in value &&
        'types' in value &&
        Array.isArray(value.types));
};
// Validation utility for checking if a state update is valid
export const isValidStateUpdate = (currentState, update) => {
    return Object.keys(update).every((key) => key in currentState);
};
// Type assertion function with runtime validation
export function assertType(value, guard, message = 'Type assertion failed') {
    if (!guard(value)) {
        throw new TypeError(message);
    }
}
