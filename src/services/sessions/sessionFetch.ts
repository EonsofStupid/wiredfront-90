import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';

// Define the correct table name
const CONVERSATIONS_TABLE = 'chat_conversations';

/**
 * Fetches all chat sessions for the current user
 */
export const fetchAllSessions = async () => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from(CONVERSATIONS_TABLE)
      .select('*')
      .eq('user_id', userData.user.id)
      .order('last_accessed', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return {
      sessions: data,
      error: null
    };
  } catch (error) {
    logger.error('Error fetching sessions', { error });
    return {
      sessions: [],
      error
    };
  }
};

/**
 * Fetches a single chat session by ID
 */
export const fetchSessionById = async (sessionId: string) => {
  try {
    const { data, error } = await supabase
      .from(CONVERSATIONS_TABLE)
      .select('*')
      .eq('id', sessionId)
      .single();
    
    if (error) {
      throw error;
    }
    
    return {
      session: data,
      error: null
    };
  } catch (error) {
    logger.error(`Error fetching session with ID ${sessionId}`, { error });
    return {
      session: null,
      error
    };
  }
};

/**
 * Touches a chat session to update its last_accessed timestamp
 */
export const touchSession = async (sessionId: string) => {
  try {
    const { error } = await supabase
      .from(CONVERSATIONS_TABLE)
      .update({
        last_accessed: new Date().toISOString()
      })
      .eq('id', sessionId);
    
    if (error) {
      throw error;
    }
    
    return {
      success: true,
      error: null
    };
  } catch (error) {
    logger.error(`Error touching session with ID ${sessionId}`, { error });
    return {
      success: false,
      error
    };
  }
};
