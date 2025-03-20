import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
const MESSAGES_PER_PAGE = 20;
export const chatMessagesService = {
    /**
     * Fetch messages with pagination
     */
    async fetchMessages(sessionId, options = {}) {
        try {
            const { cursor, limit = MESSAGES_PER_PAGE, ascending = false } = options;
            let query = supabase
                .from('chat_messages')
                .select('*')
                .eq('session_id', sessionId)
                .order('created_at', { ascending });
            if (cursor) {
                // If ascending, get messages created after the cursor
                // If descending, get messages created before the cursor
                if (ascending) {
                    query = query.gt('created_at', cursor);
                }
                else {
                    query = query.lt('created_at', cursor);
                }
            }
            query = query.limit(limit + 1); // Get one extra to check if there are more
            const { data, error } = await query;
            if (error)
                throw error;
            const hasMore = data && data.length > limit;
            const messages = hasMore ? data.slice(0, limit) : data || [];
            const nextCursor = messages.length > 0
                ? messages[messages.length - 1].created_at
                : undefined;
            return { messages, hasMore, nextCursor };
        }
        catch (error) {
            logger.error('Error fetching messages:', error);
            throw error;
        }
    },
    /**
     * Send a new message with retry capability
     */
    async sendMessage(message, maxRetries = 3) {
        const attemptSend = async (retryCount) => {
            try {
                const { data, error } = await supabase
                    .from('chat_messages')
                    .insert([message])
                    .select('*')
                    .single();
                if (error)
                    throw error;
                return data;
            }
            catch (error) {
                if (retryCount > 0) {
                    logger.warn(`Retrying message send. Attempts remaining: ${retryCount}`, { error });
                    // Exponential backoff: 1s, 2s, 4s, etc.
                    const delay = Math.pow(2, maxRetries - retryCount) * 1000;
                    await new Promise(resolve => setTimeout(resolve, delay));
                    return attemptSend(retryCount - 1);
                }
                logger.error('Failed to send message after retries:', error);
                throw error;
            }
        };
        return attemptSend(maxRetries);
    },
    /**
     * Update message status
     */
    async updateMessageStatus(messageId, status) {
        try {
            const { data, error } = await supabase
                .from('chat_messages')
                .update({ status })
                .eq('id', messageId)
                .select('*')
                .single();
            if (error)
                throw error;
            return data;
        }
        catch (error) {
            logger.error('Error updating message status:', error);
            throw error;
        }
    },
    /**
     * Subscribe to new messages in a session
     */
    subscribeToMessages(sessionId, callback) {
        return supabase
            .channel(`messages-${sessionId}`)
            .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'chat_messages',
            filter: `session_id=eq.${sessionId}`
        }, payload => {
            callback(payload.new);
        })
            .subscribe();
    }
};
