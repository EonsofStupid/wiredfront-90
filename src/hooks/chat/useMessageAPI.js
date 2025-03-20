import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useChatStore } from '@/components/chat/store/chatStore';
import { useSessionManager } from '@/hooks/sessions/useSessionManager';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
import { handleError } from '@/utils/errorHandling';
export function useMessageAPI() {
    const [isLoading, setIsLoading] = useState(false);
    const { addMessage, updateMessage, isWaitingForResponse, setWaitingForResponse } = useChatStore();
    const { currentSessionId } = useSessionManager();
    const sendMessage = useCallback(async (content, role = 'user') => {
        if (!content.trim() || !currentSessionId)
            return null;
        try {
            setIsLoading(true);
            setWaitingForResponse(true);
            // Create a message ID
            const messageId = uuidv4();
            const timestamp = new Date().toISOString();
            // Create a message object for the UI
            const message = {
                id: messageId,
                role,
                content,
                status: 'pending',
                created_at: timestamp,
                session_id: currentSessionId
            };
            // Add to UI immediately
            addMessage(message);
            // Get current user
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError)
                throw authError;
            if (!user)
                throw new Error('User not authenticated');
            // Save to database
            const { data, error } = await supabase
                .from('chat_messages')
                .insert({
                id: messageId,
                session_id: currentSessionId,
                user_id: user.id,
                role,
                content,
                type: 'text',
                status: 'sent',
                created_at: timestamp
            })
                .select()
                .single();
            if (error)
                throw error;
            // Update message status in UI
            updateMessage(messageId, { status: 'sent' });
            logger.info('Message sent', { messageId, sessionId: currentSessionId });
            // Now send a "thinking" message and initiate AI response
            await generateAIResponse(currentSessionId, content);
            return messageId;
        }
        catch (error) {
            handleError(error, 'Failed to send message');
            return null;
        }
        finally {
            setIsLoading(false);
        }
    }, [currentSessionId, addMessage, updateMessage, setWaitingForResponse]);
    const generateAIResponse = useCallback(async (sessionId, userMessage) => {
        try {
            // Create AI message placeholder
            const aiMessageId = uuidv4();
            const timestamp = new Date().toISOString();
            // Add placeholder message to UI
            addMessage({
                id: aiMessageId,
                role: 'assistant',
                content: 'Thinking...',
                status: 'pending',
                created_at: timestamp,
                session_id: sessionId
            });
            // In a real implementation, this would call your AI service
            // For now, we'll simulate a response after a delay
            setTimeout(async () => {
                try {
                    // Get current user
                    const { data: { user }, error: authError } = await supabase.auth.getUser();
                    if (authError)
                        throw authError;
                    if (!user)
                        throw new Error('User not authenticated');
                    const aiResponse = `This is a simulated response to: "${userMessage}"`;
                    // Update message in UI
                    updateMessage(aiMessageId, {
                        content: aiResponse,
                        status: 'sent'
                    });
                    // Save to database
                    await supabase
                        .from('chat_messages')
                        .insert({
                        id: aiMessageId,
                        session_id: sessionId,
                        user_id: user.id,
                        role: 'assistant',
                        content: aiResponse,
                        type: 'text',
                        status: 'sent',
                        created_at: timestamp
                    });
                    // Update session message count
                    await supabase
                        .from('chat_sessions')
                        .update({
                        message_count: supabase.rpc('increment', { inc: 2 }), // +2 for user and AI message
                        last_accessed: new Date().toISOString()
                    })
                        .eq('id', sessionId);
                    logger.info('AI response generated', { messageId: aiMessageId, sessionId });
                }
                catch (error) {
                    updateMessage(aiMessageId, {
                        content: 'Sorry, I encountered an error generating a response.',
                        status: 'error'
                    });
                    handleError(error, 'Failed to generate AI response');
                }
                finally {
                    setWaitingForResponse(false);
                }
            }, 1500);
            return aiMessageId;
        }
        catch (error) {
            handleError(error, 'Failed to setup AI response');
            setWaitingForResponse(false);
            return null;
        }
    }, [addMessage, updateMessage, setWaitingForResponse]);
    return {
        sendMessage,
        isLoading,
        isWaitingForResponse
    };
}
