// Helper functions for type conversion
export function convertDBSessionToSession(dbSession) {
    return {
        id: dbSession.id,
        title: dbSession.title || 'Untitled Chat',
        user_id: dbSession.user_id,
        mode: normalizeChatMode(dbSession.mode),
        provider_id: dbSession.provider_id || undefined,
        project_id: dbSession.project_id || undefined,
        metadata: dbSession.metadata,
        context: dbSession.context,
        is_active: dbSession.is_active,
        created_at: dbSession.created_at,
        last_accessed: dbSession.last_accessed,
        tokens_used: dbSession.tokens_used,
        message_count: dbSession.message_count
    };
}
export function convertDBMessageToMessage(dbMessage) {
    return {
        id: dbMessage.id,
        session_id: dbMessage.session_id,
        user_id: dbMessage.user_id || undefined,
        role: dbMessage.role,
        content: dbMessage.content,
        metadata: dbMessage.metadata,
        message_status: dbMessage.status,
        retry_count: dbMessage.retry_count,
        last_retry: dbMessage.last_retry || undefined,
        created_at: dbMessage.created_at,
        updated_at: dbMessage.updated_at,
        timestamp: dbMessage.created_at,
        position_order: dbMessage.position_order
    };
}
