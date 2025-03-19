
import { supabase } from '@/integrations/supabase/client';
import { EnhancedChatSession } from '@/types/chat-preferences';
import { logger } from '@/services/chat/LoggingService';

export const chatSessionsService = {
  /**
   * Fetch all chat sessions for the current user
   */
  async fetchSessions(): Promise<EnhancedChatSession[]> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('User not authenticated');
      }
      
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', userData.user.id)
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      logger.error('Error fetching chat sessions:', error);
      throw error;
    }
  },
  
  /**
   * Create a new chat session
   */
  async createSession(
    session: Partial<EnhancedChatSession>
  ): Promise<EnhancedChatSession> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('User not authenticated');
      }
      
      const newSession = {
        user_id: userData.user.id,
        title: session.title || 'New Chat',
        mode: session.mode || 'chat',
        metadata: session.metadata || {}
      };
      
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert([newSession])
        .select('*')
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      logger.error('Error creating chat session:', error);
      throw error;
    }
  },
  
  /**
   * Update an existing chat session
   */
  async updateSession(
    sessionId: string,
    updates: Partial<EnhancedChatSession>
  ): Promise<EnhancedChatSession> {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .update(updates)
        .eq('id', sessionId)
        .select('*')
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      logger.error('Error updating chat session:', error);
      throw error;
    }
  }
};
