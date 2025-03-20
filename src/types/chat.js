// Type guard for ChatMode
export const isChatMode = (value) => {
    return [
        'dev',
        'image',
        'training',
        'standard',
        'planning',
        'chat',
        'code'
    ].includes(value);
};
// Type guards
export const isDBSession = (value) => {
    return (typeof value === 'object' &&
        value !== null &&
        typeof value.id === 'string' &&
        typeof value.title === 'string' &&
        typeof value.user_id === 'string' &&
        typeof value.created_at === 'string' &&
        typeof value.last_accessed === 'string' &&
        typeof value.is_active === 'boolean' &&
        typeof value.metadata !== 'undefined' &&
        isChatMode(value.mode) &&
        typeof value.provider_id === 'string' &&
        typeof value.project_id === 'string' &&
        typeof value.tokens_used === 'number' &&
        typeof value.context !== 'undefined' &&
        typeof value.message_count === 'number');
};
export const isDBMessage = (value) => {
    return (typeof value === 'object' &&
        value !== null &&
        typeof value.id === 'string' &&
        typeof value.content === 'string' &&
        typeof value.role === 'string' &&
        ['user', 'assistant', 'system'].includes(value.role) &&
        typeof value.user_id === 'string' &&
        typeof value.type === 'string' &&
        ['text', 'command', 'system'].includes(value.type) &&
        typeof value.metadata !== 'undefined' &&
        typeof value.is_minimized === 'boolean' &&
        typeof value.position !== 'undefined' &&
        typeof value.window_state !== 'undefined' &&
        typeof value.retry_count === 'number' &&
        typeof value.source_type === 'string' &&
        typeof value.provider === 'string' &&
        typeof value.processing_status === 'string' &&
        typeof value.last_retry === 'string' &&
        typeof value.rate_limit_window === 'string');
};
// Helper function to convert Supabase session to DBSession
export const fromSupabaseSession = (session) => {
    if (!isDBSession(session)) {
        throw new Error('Invalid session data');
    }
    return session;
};
