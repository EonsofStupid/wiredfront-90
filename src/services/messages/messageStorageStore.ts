
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import { 
  MessageStorage, 
  MessageStorageState 
} from './types';
import { Message } from '@/types/chat';
import { logger } from '@/services/chat/LoggingService';

const initialState: MessageStorageState = {
  messages: {},
  isLoading: false,
  error: null
};

export const useMessageStorage = create<MessageStorage>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        addMessage: (message: Message) => {
          if (!message.id) {
            logger.error('Attempted to add message without ID to storage');
            return;
          }

          logger.debug(`Adding message to storage: ${message.id}`);

          set(state => ({
            messages: {
              ...state.messages,
              [message.id]: message
            }
          }));
        },

        updateMessage: (id: string, updates: Partial<Message>) => {
          set(state => {
            if (!state.messages[id]) {
              logger.warn(`Attempted to update non-existent message: ${id}`);
              return state;
            }

            logger.debug(`Updating message in storage: ${id}`, { updates });

            return {
              messages: {
                ...state.messages,
                [id]: {
                  ...state.messages[id],
                  ...updates
                }
              }
            };
          });
        },

        deleteMessage: (id: string) => {
          set(state => {
            if (!state.messages[id]) {
              logger.warn(`Attempted to delete non-existent message: ${id}`);
              return state;
            }

            logger.debug(`Deleting message from storage: ${id}`);

            const { [id]: removedMessage, ...remainingMessages } = state.messages;
            return {
              messages: remainingMessages
            };
          });
        },

        getMessages: (sessionId: string) => {
          const allMessages = Object.values(get().messages);
          return allMessages
            .filter(message => 
              message.chat_session_id === sessionId || 
              message.sessionId === sessionId
            )
            .sort((a, b) => {
              const timeA = a.timestamp || a.created_at || '';
              const timeB = b.timestamp || b.created_at || '';
              return new Date(timeA).getTime() - new Date(timeB).getTime();
            });
        },

        clearSessionMessages: (sessionId: string) => {
          logger.info(`Clearing messages for session: ${sessionId}`);

          set(state => {
            const updatedMessages = { ...state.messages };
            
            // Remove messages for this session
            Object.keys(updatedMessages).forEach(messageId => {
              const message = updatedMessages[messageId];
              if (message.chat_session_id === sessionId || message.sessionId === sessionId) {
                delete updatedMessages[messageId];
              }
            });

            return { messages: updatedMessages };
          });
        },

        clearAllMessages: () => {
          logger.info('Clearing all messages from storage');
          set({ messages: {} });
        },

        importMessages: (messages: Message[]) => {
          logger.info(`Importing ${messages.length} messages to storage`);

          set(state => {
            const updatedMessages = { ...state.messages };
            
            messages.forEach(message => {
              if (message.id) {
                updatedMessages[message.id] = message;
              }
            });

            return { messages: updatedMessages };
          });
        },

        searchMessages: (query: string, sessionId?: string) => {
          const allMessages = Object.values(get().messages);
          const filteredMessages = sessionId
            ? allMessages.filter(message => 
                (message.chat_session_id === sessionId || message.sessionId === sessionId)
              )
            : allMessages;

          return filteredMessages.filter(message => 
            message.content.toLowerCase().includes(query.toLowerCase())
          );
        }
      }),
      {
        name: 'message-storage',
        partialize: (state) => ({
          messages: state.messages
        }),
      }
    ),
    {
      name: 'Message Storage',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);
