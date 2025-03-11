import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { ChatSession, ChatSessionFile, ChatSessionMetadata, SessionState } from '../types';

interface SessionStore extends SessionState {
  // Session CRUD operations
  createSession: (title?: string, metadata?: ChatSessionMetadata) => Promise<string | null>;
  switchSession: (sessionId: string) => Promise<void>;
  updateSessionTitle: (sessionId: string, title: string) => Promise<void>;
  updateSessionMetadata: (sessionId: string, metadata: Partial<ChatSessionMetadata>) => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;
  
  // File management
  addFileToSession: (sessionId: string, file: Omit<ChatSessionFile, 'id' | 'session_id' | 'uploaded_at'>) => Promise<string | null>;
  removeFileFromSession: (sessionId: string, fileId: string) => Promise<void>;
  
  // Session loading and refresh
  loadSessions: () => Promise<void>;
  refreshSessions: () => Promise<void>;
  
  // Other utilities
  cleanupInactiveSessions: (days?: number) => Promise<void>;
  updateLastAccessed: (sessionId: string) => Promise<void>;
}

export const useSessionStore = create<SessionStore>()(
  persist(
    (set, get) => ({
      sessions: [],
      currentSessionId: null,
      isLoading: false,
      error: null,
      
      createSession: async (title = 'New Chat', metadata) => {
        try {
          set({ isLoading: true, error: null });
          
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) {
            set({ error: 'No authenticated user' });
            return null;
          }
          
          // Generate a new session ID
          const sessionId = uuidv4();
          
          // Create a new session in Supabase
          const { error } = await supabase
            .from('chat_sessions')
            .insert({
              id: sessionId,
              user_id: user.id,
              is_active: true,
              title,
              metadata: metadata || {},
              last_accessed: new Date().toISOString()
            });
            
          if (error) {
            set({ error: error.message });
            return null;
          }
          
          // Set all other sessions as inactive
          await supabase
            .from('chat_sessions')
            .update({ is_active: false })
            .neq('id', sessionId)
            .eq('user_id', user.id);
          
          // Update the local state
          const newSession: ChatSession = {
            id: sessionId,
            user_id: user.id,
            is_active: true,
            title,
            metadata: metadata || {},
            created_at: new Date().toISOString(),
            last_accessed: new Date().toISOString(),
            files: []
          };
          
          set(state => ({
            sessions: [newSession, ...state.sessions],
            currentSessionId: sessionId
          }));
          
          return sessionId;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to create session';
          set({ error: errorMessage });
          return null;
        } finally {
          set({ isLoading: false });
        }
      },
      
      switchSession: async (sessionId) => {
        try {
          set({ isLoading: true, error: null });
          
          // Set the selected session as active and others as inactive
          const { error } = await supabase
            .from('chat_sessions')
            .update({ 
              is_active: true,
              last_accessed: new Date().toISOString()
            })
            .eq('id', sessionId);
            
          if (error) {
            set({ error: error.message });
            return;
          }
          
          // Set all other sessions as inactive
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await supabase
              .from('chat_sessions')
              .update({ is_active: false })
              .neq('id', sessionId)
              .eq('user_id', user.id);
          }
          
          // Update the local state
          set(state => ({
            sessions: state.sessions.map(session => ({
              ...session,
              is_active: session.id === sessionId,
              last_accessed: session.id === sessionId ? new Date().toISOString() : session.last_accessed
            })),
            currentSessionId: sessionId
          }));
          
          // Refresh sessions to ensure we have the latest data
          await get().refreshSessions();
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to switch session';
          set({ error: errorMessage });
        } finally {
          set({ isLoading: false });
        }
      },
      
      updateSessionTitle: async (sessionId, title) => {
        try {
          set({ isLoading: true, error: null });
          
          // Update the session title in Supabase
          const { error } = await supabase
            .from('chat_sessions')
            .update({ title })
            .eq('id', sessionId);
            
          if (error) {
            set({ error: error.message });
            return;
          }
          
          // Update the local state
          set(state => ({
            sessions: state.sessions.map(session => 
              session.id === sessionId ? { ...session, title } : session
            )
          }));
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to update session title';
          set({ error: errorMessage });
        } finally {
          set({ isLoading: false });
        }
      },
      
      updateSessionMetadata: async (sessionId, metadata) => {
        try {
          set({ isLoading: true, error: null });
          
          // Get the current session
          const session = get().sessions.find(s => s.id === sessionId);
          if (!session) {
            set({ error: 'Session not found' });
            return;
          }
          
          // Merge the new metadata with existing metadata
          const updatedMetadata = {
            ...(session.metadata || {}),
            ...metadata
          };
          
          // Update the session metadata in Supabase
          const { error } = await supabase
            .from('chat_sessions')
            .update({ metadata: updatedMetadata })
            .eq('id', sessionId);
            
          if (error) {
            set({ error: error.message });
            return;
          }
          
          // Update the local state
          set(state => ({
            sessions: state.sessions.map(session => 
              session.id === sessionId ? { ...session, metadata: updatedMetadata } : session
            )
          }));
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to update session metadata';
          set({ error: errorMessage });
        } finally {
          set({ isLoading: false });
        }
      },
      
      deleteSession: async (sessionId) => {
        try {
          set({ isLoading: true, error: null });
          
          // Delete the session from Supabase
          const { error } = await supabase
            .from('chat_sessions')
            .delete()
            .eq('id', sessionId);
            
          if (error) {
            set({ error: error.message });
            return;
          }
          
          // Update the local state
          const { currentSessionId, sessions } = get();
          const updatedSessions = sessions.filter(session => session.id !== sessionId);
          
          // If the deleted session was the current one, switch to another one
          let newCurrentSessionId = currentSessionId;
          if (currentSessionId === sessionId) {
            newCurrentSessionId = updatedSessions.length > 0 ? updatedSessions[0].id : null;
            
            // If there's a new current session, update it in Supabase
            if (newCurrentSessionId) {
              await get().switchSession(newCurrentSessionId);
            } else {
              // If no sessions are left, create a new one
              await get().createSession();
            }
          }
          
          set({
            sessions: updatedSessions,
            currentSessionId: newCurrentSessionId
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to delete session';
          set({ error: errorMessage });
        } finally {
          set({ isLoading: false });
        }
      },
      
      addFileToSession: async (sessionId, file) => {
        try {
          set({ isLoading: true, error: null });
          
          // Generate a file ID
          const fileId = uuidv4();
          
          const newFile: ChatSessionFile = {
            id: fileId,
            session_id: sessionId,
            name: file.name,
            type: file.type,
            url: file.url,
            size: file.size,
            status: file.status,
            uploaded_at: new Date().toISOString(),
            metadata: file.metadata
          };
          
          // In a real implementation, we would store files in a separate table
          // For now, we'll update the session's files array directly
          
          // Get the current session
          const session = get().sessions.find(s => s.id === sessionId);
          if (!session) {
            set({ error: 'Session not found' });
            return null;
          }
          
          // Update session metadata to include the new file
          const updatedFiles = [...(session.files || []), newFile];
          
          // Update the session in Supabase
          const { error } = await supabase
            .from('chat_sessions')
            .update({ 
              files: updatedFiles,
              last_accessed: new Date().toISOString()
            })
            .eq('id', sessionId);
            
          if (error) {
            set({ error: error.message });
            return null;
          }
          
          // Update the local state
          set(state => ({
            sessions: state.sessions.map(session => 
              session.id === sessionId ? { 
                ...session, 
                files: updatedFiles,
                last_accessed: new Date().toISOString()
              } : session
            )
          }));
          
          return fileId;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to add file to session';
          set({ error: errorMessage });
          return null;
        } finally {
          set({ isLoading: false });
        }
      },
      
      removeFileFromSession: async (sessionId, fileId) => {
        try {
          set({ isLoading: true, error: null });
          
          // Get the current session
          const session = get().sessions.find(s => s.id === sessionId);
          if (!session || !session.files) {
            set({ error: 'Session or files not found' });
            return;
          }
          
          // Filter out the file to remove
          const updatedFiles = session.files.filter(file => file.id !== fileId);
          
          // Update the session in Supabase
          const { error } = await supabase
            .from('chat_sessions')
            .update({ 
              files: updatedFiles,
              last_accessed: new Date().toISOString()
            })
            .eq('id', sessionId);
            
          if (error) {
            set({ error: error.message });
            return;
          }
          
          // Update the local state
          set(state => ({
            sessions: state.sessions.map(session => 
              session.id === sessionId ? { 
                ...session, 
                files: updatedFiles,
                last_accessed: new Date().toISOString()
              } : session
            )
          }));
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to remove file from session';
          set({ error: errorMessage });
        } finally {
          set({ isLoading: false });
        }
      },
      
      loadSessions: async () => {
        try {
          set({ isLoading: true, error: null });
          
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) {
            set({ error: 'No authenticated user' });
            return;
          }
          
          // Fetch sessions from Supabase
          const { data, error } = await supabase
            .from('chat_sessions')
            .select('*')
            .eq('user_id', user.id)
            .order('last_accessed', { ascending: false });
            
          if (error) {
            set({ error: error.message });
            return;
          }
          
          // Find the active session
          const activeSessions = data.filter(session => session.is_active);
          const currentSessionId = activeSessions.length > 0 
            ? activeSessions[0].id 
            : (data.length > 0 ? data[0].id : null);
          
          set({
            sessions: data as ChatSession[],
            currentSessionId
          });
          
          // If there are no sessions, create a default one
          if (data.length === 0) {
            await get().createSession('New Chat');
          }
          // If there's no active session but we have sessions, set the first one as active
          else if (activeSessions.length === 0 && currentSessionId) {
            await get().switchSession(currentSessionId);
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to load sessions';
          set({ error: errorMessage });
        } finally {
          set({ isLoading: false });
        }
      },
      
      refreshSessions: async () => {
        // Reuse the loadSessions logic for refreshing
        await get().loadSessions();
      },
      
      cleanupInactiveSessions: async (days = 7) => {
        try {
          set({ isLoading: true, error: null });
          
          // Calculate the date threshold
          const daysAgo = new Date();
          daysAgo.setDate(daysAgo.getDate() - days);
          
          // Delete old sessions from Supabase
          const { error } = await supabase
            .from('chat_sessions')
            .delete()
            .lt('last_accessed', daysAgo.toISOString())
            .eq('is_active', false);
            
          if (error) {
            set({ error: error.message });
            return;
          }
          
          // Refresh the sessions list
          await get().refreshSessions();
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to cleanup inactive sessions';
          set({ error: errorMessage });
        } finally {
          set({ isLoading: false });
        }
      },
      
      updateLastAccessed: async (sessionId) => {
        try {
          // Update the last_accessed timestamp in Supabase
          const { error } = await supabase
            .from('chat_sessions')
            .update({ last_accessed: new Date().toISOString() })
            .eq('id', sessionId);
            
          if (error) {
            console.error('Error updating last_accessed:', error);
          }
          
          // Update the local state
          set(state => ({
            sessions: state.sessions.map(session => 
              session.id === sessionId ? { 
                ...session, 
                last_accessed: new Date().toISOString() 
              } : session
            )
          }));
        } catch (error) {
          console.error('Error in updateLastAccessed:', error);
        }
      }
    }),
    {
      name: 'chat-sessions-storage',
      partialize: (state) => ({
        sessions: state.sessions,
        currentSessionId: state.currentSessionId
      })
    }
  )
);

// Set up a periodic update for the current session's last_accessed timestamp
if (typeof window !== 'undefined') {
  setInterval(() => {
    const { currentSessionId, updateLastAccessed } = useSessionStore.getState();
    if (currentSessionId) {
      updateLastAccessed(currentSessionId);
    }
  }, 5 * 60 * 1000); // Every 5 minutes
}
