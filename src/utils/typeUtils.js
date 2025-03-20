// Type guard to check if a response is a SystemLog
export function isSystemLog(obj) {
    return (typeof obj === 'object' &&
        obj !== null &&
        typeof obj.id === 'string' &&
        typeof obj.timestamp === 'string' &&
        typeof obj.level === 'string' &&
        typeof obj.source === 'string' &&
        typeof obj.message === 'string');
}
// Type guard to check if a response is a NavigationLog
export function isNavigationLog(obj) {
    return (isSystemLog(obj) &&
        obj.source === 'navigation' &&
        typeof obj.metadata === 'object' &&
        obj.metadata !== null &&
        typeof obj.metadata.from === 'string' &&
        typeof obj.metadata.to === 'string' &&
        typeof obj.metadata.timestamp === 'string');
}
// Type guard to check if a Supabase response is an error
export function isQueryError(result) {
    return result && result.error instanceof Object;
}
// Type guard to check if a Supabase response is successful
export function isQuerySuccess(result) {
    return result && Array.isArray(result.data);
}
// Safely transform data with type checking
export function safeDataTransform(data, typeGuard) {
    if (!Array.isArray(data))
        return [];
    return data.filter(typeGuard);
}
// Safely get array data from a response that might be null
export function safeArrayAccess(data) {
    if (!data)
        return [];
    if (!Array.isArray(data))
        return [];
    return data;
}
// Safely parse JSON with fallback
export function safeJsonParse(jsonString, fallback) {
    if (!jsonString)
        return fallback;
    try {
        return JSON.parse(jsonString);
    }
    catch (e) {
        console.error('Failed to parse JSON:', e);
        return fallback;
    }
}
// Safely extract data from a Supabase response
export function safeExtractData(response) {
    if (response?.error) {
        console.error('Error in Supabase response:', response.error);
        return null;
    }
    return response?.data || null;
}
