
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { ChatMode, MessageRole, MessageStatus } from '@/types/chat';
import { ChatSession, Message } from '@/types/chat';

interface ChatState {
  // Messages state
  messages: Message[];
  
  // Sessions state
  sessions: ChatSession[];
  currentSession: ChatSession | null;
  
  // Mode state
  currentMode: ChatMode;

  // Layout/UI actions are handled via Jotai atoms
  
  // Messages actions
  addMessage: (message: Message) => string;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  removeMessage: (id: string) => void;
  clearMessages: () => void;
  sendMessage: (content: string, sessionId: string) => Promise<string>;
  
  // Session actions
  fetchSessions: () => Promise<void>;
  setCurrentSession: (session: ChatSession) => void;
  createSession: (options?: { title?: string; initialMessage?: string }) => Promise<ChatSession>;
  updateSession: (sessionId: string, updates: Partial<ChatSession>) => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;
  
  // Mode actions
  setCurrentMode: (mode: ChatMode) => void;
  getModeLabel: (mode: ChatMode) => string;
  getModeDescription: (mode: ChatMode) => string;
}

export const useChatStore = create<ChatState>()(
  devtools(
    persist(
      (set, get) => ({
        // Default state
        messages: [],
        sessions: [],
        currentSession: null,
        currentMode: 'chat',
        
        // Messages actions
        addMessage: (message) => {
          const id = message.id || uuidv4();
          const timestamp = message.timestamp || new Date().toISOString();
          
          const newMessage: Message = {
            ...message,
            id,
            timestamp,
            status: message.status || 'sent',
          };
          
          set((state) => ({
            messages: [...state.messages, newMessage],
          }));
          
          return id;
        },
        
        updateMessage: (id, updates) => {
          set((state) => ({
            messages: state.messages.map((message) => 
              message.id === id ? { ...message, ...updates } : message
            ),
          }));
        },
        
        removeMessage: (id) => {
          set((state) => ({
            messages: state.messages.filter((message) => message.id !== id),
          }));
        },
        
        clearMessages: () => {
          set({ messages: [] });
        },
        
        sendMessage: async (content, sessionId) => {
          if (!content.trim() || !sessionId) {
            throw new Error('Cannot send empty message or missing session ID');
          }
          
          // Create a temporary message ID
          const tempId = uuidv4();
          const timestamp = new Date().toISOString();
          
          // Add pending message to store
          get().addMessage({
            id: tempId,
            content,
            role: 'user',
            timestamp,
            status: 'pending',
            sessionId
          });
          
          try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Update message status
            get().updateMessage(tempId, { status: 'sent' });
            
            // Simulate assistant response
            setTimeout(() => {
              get().addMessage({
                id: uuidv4(),
                content: `Response to: ${content}`,
                role: 'assistant',
                timestamp: new Date().toISOString(),
                status: 'sent',
                sessionId
              });
            }, 1000);
            
            return tempId;
          } catch (error) {
            // Update message status on failure
            get().updateMessage(tempId, { status: 'failed' });
            throw error;
          }
        },
        
        // Session actions
        fetchSessions: async () => {
          // In a real app, this would fetch from an API
          // For now, we'll just use what's in the store
          return Promise.resolve();
        },
        
        setCurrentSession: (session) => {
          set({ currentSession: session });
        },
        
        createSession: async (options = {}) => {
          const session: ChatSession = {
            id: uuidv4(),
            title: options.title || 'New Chat',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            messages: []
          };
          
          set((state) => ({
            sessions: [...state.sessions, session],
            currentSession: session
          }));
          
          if (options.initialMessage) {
            await get().sendMessage(options.initialMessage, session.id);
          }
          
          return session;
        },
        
        updateSession: async (sessionId, updates) => {
          set((state) => ({
            sessions: state.sessions.map(session => 
              session.id === sessionId 
                ? { ...session, ...updates, updatedAt: new Date().toISOString() } 
                : session
            ),
            currentSession: state.currentSession?.id === sessionId 
              ? { ...state.currentSession, ...updates, updatedAt: new Date().toISOString() } 
              : state.currentSession
          }));
          
          return Promise.resolve();
        },
        
        deleteSession: async (sessionId) => {
          set((state) => ({
            sessions: state.sessions.filter(session => session.id !== sessionId),
            currentSession: state.currentSession?.id === sessionId 
              ? null 
              : state.currentSession
          }));
          
          return Promise.resolve();
        },
        
        // Mode actions
        setCurrentMode: (mode) => {
          set({ currentMode: mode });
        },
        
        getModeLabel: (mode) => {
          const labels: Record<ChatMode, string> = {
            'chat': 'Chat',
            'code': 'Code Assistant',
            'assistant': 'Assistant'
          };
          return labels[mode] || 'Chat';
        },
        
        getModeDescription: (mode) => {
          const descriptions: Record<ChatMode, string> = {
            'chat': 'General chat mode',
            'code': 'Code assistance mode',
            'assistant': 'AI assistant mode'
          };
          return descriptions[mode] || 'General chat mode';
        }
      }),
      {
        name: 'chat-store',
        partialize: (state) => ({
          sessions: state.sessions,
          currentSession: state.currentSession,
          currentMode: state.currentMode,
        })
      }
    )
  )
);

// Selectors for frequently used state slices
export const useMessages = () => useChatStore(state => state.messages);
export const useCurrentSession = () => useChatStore(state => state.currentSession);
export const useSessions = () => useChatStore(state => state.sessions);
export const useCurrentMode = () => useChatStore(state => state.currentMode);
