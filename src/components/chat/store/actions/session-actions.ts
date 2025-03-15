
import { StateCreator } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { ChatMode, ChatSession, ChatState } from "../types/chat-store-types";
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
import { toast } from 'sonner';

export type SessionActions = {
  createSession: (mode: ChatMode, options?: Partial<Omit<ChatSession, 'id' | 'mode' | 'tokensUsed' | 'createdAt' | 'updatedAt'>>) => string;
  switchSession: (sessionId: string) => void;
  updateSession: (sessionId: string, updates: Partial<ChatSession>) => void;
  clearSessions: () => void;
  consumeToken: (sessionId: string, count?: number) => boolean;
  addTokens: (amount: number) => void;
  getCurrentPageMode: () => ChatMode;
};

type StoreWithDevtools = StateCreator<
  ChatState,
  [["zustand/devtools", never], ["zustand/persist", unknown]],
  [],
  SessionActions
>;

export const createSessionActions: StoreWithDevtools = (set, get) => ({
  createSession: (mode, options = {}) => {
    const timestamp = new Date().toISOString();
    const sessionId = uuidv4();
    
    // Create a new session
    const newSession: ChatSession = {
      id: sessionId,
      mode,
      tokensUsed: 0,
      createdAt: timestamp,
      updatedAt: timestamp,
      ...options
    };
    
    set(
      (state) => ({
        ...state,
        currentMode: mode,
        currentSession: newSession,
        sessions: {
          ...state.sessions,
          [sessionId]: newSession
        },
        messages: [] // Clear messages when creating a new session
      }),
      false,
      { type: 'sessions/create', sessionId, mode }
    );
    
    // Log session creation to the database
    try {
      logSessionChange(sessionId, mode, 'create');
    } catch (error) {
      logger.error('Failed to log session creation:', error);
    }
    
    return sessionId;
  },
  
  switchSession: (sessionId) => {
    set(
      (state) => {
        const session = state.sessions[sessionId];
        if (!session) {
          toast.error('Session not found');
          return state;
        }
        
        // Update current session and mode
        return {
          ...state,
          currentSession: session,
          currentMode: session.mode,
          messages: [], // Clear messages, they'll be loaded from the database
        };
      },
      false,
      { type: 'sessions/switch', sessionId }
    );
    
    // Log session switch to the database
    try {
      const { currentSession } = get();
      if (currentSession) {
        logSessionChange(currentSession.id, currentSession.mode, 'switch');
      }
    } catch (error) {
      logger.error('Failed to log session switch:', error);
    }
  },
  
  updateSession: (sessionId, updates) => {
    set(
      (state) => {
        const session = state.sessions[sessionId];
        if (!session) {
          toast.error('Session not found');
          return state;
        }
        
        const updatedSession = {
          ...session,
          ...updates,
          updatedAt: new Date().toISOString()
        };
        
        // Update session in store
        return {
          ...state,
          sessions: {
            ...state.sessions,
            [sessionId]: updatedSession
          },
          currentSession: state.currentSession?.id === sessionId ? updatedSession : state.currentSession
        };
      },
      false,
      { type: 'sessions/update', sessionId, updates }
    );
    
    // Log session update to the database
    try {
      const { sessions } = get();
      const session = sessions[sessionId];
      if (session) {
        logSessionChange(sessionId, session.mode, 'update', updates);
      }
    } catch (error) {
      logger.error('Failed to log session update:', error);
    }
  },
  
  clearSessions: () => {
    set(
      (state) => ({
        ...state,
        sessions: {},
        currentSession: null,
        messages: []
      }),
      false,
      { type: 'sessions/clear' }
    );
    
    // Log sessions clearing to the database
    try {
      logSessionChange('all', 'chat', 'clear');
    } catch (error) {
      logger.error('Failed to log sessions clearing:', error);
    }
  },
  
  consumeToken: (sessionId, count = 1) => {
    let success = false;
    
    set(
      (state) => {
        const { tokenUsage } = state;
        
        // Check if enough tokens are available
        if (tokenUsage.available < count) {
          toast.error(`Not enough tokens available. You need ${count} token${count !== 1 ? 's' : ''}.`);
          success = false;
          return state;
        }
        
        // Update token usage
        const newTokenUsage = {
          ...tokenUsage,
          available: tokenUsage.available - count,
          used: tokenUsage.used + count
        };
        
        // Update session token usage
        const session = state.sessions[sessionId];
        if (!session) {
          toast.error('Session not found');
          success = false;
          return state;
        }
        
        const updatedSession = {
          ...session,
          tokensUsed: session.tokensUsed + count,
          updatedAt: new Date().toISOString()
        };
        
        success = true;
        
        // Return updated state
        return {
          ...state,
          tokenUsage: newTokenUsage,
          sessions: {
            ...state.sessions,
            [sessionId]: updatedSession
          },
          currentSession: state.currentSession?.id === sessionId ? updatedSession : state.currentSession
        };
      },
      false,
      { type: 'tokens/consume', sessionId, count }
    );
    
    // Log token consumption to the database
    try {
      if (success) {
        const { currentSession } = get();
        if (currentSession) {
          logTokenUsage(currentSession.id, currentSession.mode, count);
        }
      }
    } catch (error) {
      logger.error('Failed to log token consumption:', error);
    }
    
    return success;
  },
  
  addTokens: (amount) => {
    set(
      (state) => ({
        ...state,
        tokenUsage: {
          ...state.tokenUsage,
          available: state.tokenUsage.available + amount,
          lastRefilled: new Date().toISOString()
        }
      }),
      false,
      { type: 'tokens/add', amount }
    );
    
    // Log token addition to the database
    try {
      logTokenAddition(amount);
    } catch (error) {
      logger.error('Failed to log token addition:', error);
    }
  },
  
  getCurrentPageMode: () => {
    // Determine the current mode based on the page
    // This could be enhanced to use URL or other context
    const pathname = window.location.pathname;
    
    if (pathname.includes('/editor') || pathname.includes('/development')) {
      return 'dev';
    } else if (pathname.includes('/gallery')) {
      return 'image';
    } else if (pathname.includes('/training')) {
      return 'training';
    }
    
    return 'chat';
  }
});

// Helper function to log session changes to the database
const logSessionChange = async (
  sessionId: string,
  mode: ChatMode,
  action: 'create' | 'switch' | 'update' | 'clear',
  updates?: Partial<ChatSession>
) => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return;

    // Log to feature usage table
    await supabase.from('feature_usage').insert({
      user_id: userData.user.id,
      feature_name: `session_${action}`,
      context: { 
        sessionId,
        mode,
        updates: updates || {},
        timestamp: new Date().toISOString()
      }
    });

    logger.info(`Session ${action}: ${sessionId}, Mode: ${mode}`, { sessionId, mode, action });
  } catch (error) {
    logger.error(`Error logging session ${action}:`, error);
  }
};

// Helper function to log token usage to the database
const logTokenUsage = async (sessionId: string, mode: ChatMode, count: number) => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return;

    // Log to feature usage table
    await supabase.from('feature_usage').insert({
      user_id: userData.user.id,
      feature_name: 'token_consumption',
      context: { 
        sessionId,
        mode,
        count,
        timestamp: new Date().toISOString()
      }
    });

    logger.info(`Token consumption: ${count} for session ${sessionId}`, { sessionId, mode, count });
  } catch (error) {
    logger.error('Error logging token usage:', error);
  }
};

// Helper function to log token addition to the database
const logTokenAddition = async (amount: number) => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return;

    // Log to feature usage table
    await supabase.from('feature_usage').insert({
      user_id: userData.user.id,
      feature_name: 'token_addition',
      context: { 
        amount,
        timestamp: new Date().toISOString()
      }
    });

    logger.info(`Token addition: ${amount}`, { amount });
  } catch (error) {
    logger.error('Error logging token addition:', error);
  }
};
