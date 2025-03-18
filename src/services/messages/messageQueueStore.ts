import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { 
  MessageQueue, 
  MessageQueueItem, 
  MessageQueueState, 
  MessageProcessingOptions,
  MessageQueueMetrics
} from './types';
import { Message } from '@/types/chat';
import { logger } from '@/services/chat/LoggingService';

const DEFAULT_PROCESSING_OPTIONS: MessageProcessingOptions = {
  priority: 'normal',
  retryCount: 0,
  maxRetries: 3,
  timeout: 30000 // 30 seconds
};

const initialState: MessageQueueState = {
  queue: [],
  processingMessage: null,
  isProcessing: false,
  isPaused: false,
  error: null
};

export const useMessageQueue = create<MessageQueue>()(
  devtools(
    (set, get) => ({
      ...initialState,

      enqueueMessage: (message: Message, options?: Partial<MessageProcessingOptions>) => {
        const messageId = message.id || uuidv4();
        const messageWithId: Message = {
          ...message,
          id: messageId
        };

        const queueItem: MessageQueueItem = {
          message: messageWithId,
          options: { ...DEFAULT_PROCESSING_OPTIONS, ...options },
          timestamp: new Date().toISOString(),
          attempts: 0,
          lastAttempt: null
        };

        logger.info(`Enqueuing message: ${messageId}`, { message: messageWithId });

        set(state => {
          // Sort queue by priority first, then by timestamp
          const updatedQueue = [...state.queue, queueItem].sort((a, b) => {
            const priorityOrder = { high: 0, normal: 1, low: 2 };
            const priorityA = priorityOrder[a.options.priority];
            const priorityB = priorityOrder[b.options.priority];
            
            if (priorityA !== priorityB) {
              return priorityA - priorityB;
            }
            
            return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
          });

          return { queue: updatedQueue };
        });

        // If there's no processing happening, start processing
        if (!get().isProcessing && !get().isPaused) {
          get().processNextMessage();
        }

        return messageId;
      },

      updateMessage: (id: string, updates: Partial<Message>) => {
        set(state => {
          const queueIndex = state.queue.findIndex(item => item.message.id === id);
          
          if (queueIndex === -1) {
            logger.warn(`Attempted to update non-existent message in queue: ${id}`);
            return state;
          }

          const updatedQueue = [...state.queue];
          updatedQueue[queueIndex] = {
            ...updatedQueue[queueIndex],
            message: {
              ...updatedQueue[queueIndex].message,
              ...updates
            }
          };

          logger.debug(`Updated message in queue: ${id}`, { updates });

          return { queue: updatedQueue };
        });
      },

      dequeueMessage: (id: string) => {
        set(state => {
          const messageIndex = state.queue.findIndex(item => item.message.id === id);
          
          if (messageIndex === -1) {
            logger.warn(`Attempted to dequeue non-existent message: ${id}`);
            return state;
          }

          const updatedQueue = [...state.queue];
          updatedQueue.splice(messageIndex, 1);

          logger.info(`Dequeued message: ${id}`);

          return { queue: updatedQueue };
        });
      },

      processNextMessage: async () => {
        const state = get();
        
        // Don't process if paused or already processing
        if (state.isPaused || state.isProcessing || state.queue.length === 0) {
          return;
        }

        const nextItem = state.queue[0];
        const messageId = nextItem.message.id;

        set({ 
          isProcessing: true,
          processingMessage: messageId,
          error: null
        });

        try {
          logger.info(`Processing message: ${messageId}`, { 
            attempt: nextItem.attempts + 1,
            maxRetries: nextItem.options.maxRetries
          });

          // Update the queue item to track attempts
          set(state => {
            const queueIndex = state.queue.findIndex(item => item.message.id === messageId);
            
            if (queueIndex === -1) return state;

            const updatedQueue = [...state.queue];
            updatedQueue[queueIndex] = {
              ...updatedQueue[queueIndex],
              attempts: updatedQueue[queueIndex].attempts + 1,
              lastAttempt: new Date().toISOString()
            };

            return { queue: updatedQueue };
          });

          // In a real implementation, we would process the message here
          // For now, we'll just simulate a successful processing
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Remove the processed message from the queue
          set(state => {
            const updatedQueue = state.queue.filter(item => item.message.id !== messageId);
            return { 
              queue: updatedQueue,
              isProcessing: false,
              processingMessage: null
            };
          });

          // Process the next message if there are any
          if (get().queue.length > 0 && !get().isPaused) {
            get().processNextMessage();
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          logger.error(`Error processing message: ${messageId}`, { error });

          // Update the message with the error
          set(state => {
            const queueIndex = state.queue.findIndex(item => item.message.id === messageId);
            
            if (queueIndex === -1) return { 
              isProcessing: false,
              processingMessage: null,
              error: errorMessage
            };

            const queueItem = state.queue[queueIndex];
            
            // If we've reached max retries, mark as failed
            if (queueItem.attempts >= queueItem.options.maxRetries) {
              const updatedQueue = [...state.queue];
              updatedQueue[queueIndex] = {
                ...updatedQueue[queueIndex],
                message: {
                  ...updatedQueue[queueIndex].message,
                  message_status: 'failed'
                }
              };

              return { 
                queue: updatedQueue,
                isProcessing: false,
                processingMessage: null,
                error: errorMessage
              };
            }

            // Otherwise leave in queue for retry
            return { 
              isProcessing: false,
              processingMessage: null,
              error: errorMessage
            };
          });

          // Process the next message if there are any
          if (get().queue.length > 0 && !get().isPaused) {
            get().processNextMessage();
          }
        }
      },

      pauseQueue: () => {
        logger.info('Pausing message queue');
        set({ isPaused: true });
      },

      resumeQueue: () => {
        logger.info('Resuming message queue');
        set({ isPaused: false });
        
        // If there are messages and we're not processing, start processing
        if (get().queue.length > 0 && !get().isProcessing) {
          get().processNextMessage();
        }
      },

      clearQueue: () => {
        logger.info('Clearing message queue');
        set({ 
          queue: [],
          isProcessing: false,
          processingMessage: null,
          error: null
        });
      },

      retryMessage: async (id: string) => {
        const state = get();
        const queueIndex = state.queue.findIndex(item => item.message.id === id);
        
        if (queueIndex === -1) {
          logger.warn(`Attempted to retry non-existent message: ${id}`);
          return;
        }

        logger.info(`Retrying message: ${id}`);

        // Move the message to the front of the queue
        set(state => {
          const item = state.queue[queueIndex];
          const updatedQueue = [...state.queue];
          updatedQueue.splice(queueIndex, 1);
          
          // Insert at the front, but respect priority
          const highPriorityMessages = updatedQueue.filter(msg => msg.options.priority === 'high');
          
          return {
            queue: [
              ...highPriorityMessages,
              {
                ...item,
                options: {
                  ...item.options,
                  priority: 'high' // Bump priority on retry
                },
                timestamp: new Date().toISOString() // Update timestamp
              },
              ...updatedQueue.filter(msg => msg.options.priority !== 'high')
            ]
          };
        });

        // If we're not processing and not paused, start processing
        if (!state.isProcessing && !state.isPaused) {
          get().processNextMessage();
        }
      },

      getQueueMetrics: (): MessageQueueMetrics => {
        // In a real implementation, we would calculate actual metrics
        // For now, return placeholder values
        return {
          totalProcessed: 0,
          totalFailed: 0,
          averageProcessingTime: 0,
          queuedMessages: get().queue.length
        };
      }
    }),
    {
      name: 'Message Queue',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);
