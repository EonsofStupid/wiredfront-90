// Helper function to normalize connection status for components
export const normalizeConnectionStatus = (status) => {
    if (typeof status === 'string') {
        return {
            status,
            lastCheck: null,
            errorMessage: null,
            metadata: null
        };
    }
    return {
        status: status.status,
        lastCheck: status.last_check,
        errorMessage: status.error_message || null,
        metadata: status.metadata || null
    };
};
// Helper to check if an object is a GitHubConnectionStatus
export const isConnectionStatusObject = (status) => {
    return typeof status === 'object' && 'user_id' in status;
};
