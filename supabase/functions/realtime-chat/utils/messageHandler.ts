import { logger } from './logger.ts';
import { supabase } from './supabaseClient.ts';

export class MessageHandler {
  constructor(
    private userId: string,
    private sessionId: string
  ) {}

  async handleMessage(data: any) {
    try {
      const { error: dbError } = await supabase
        .from('messages')
        .insert({
          content: typeof data === 'string' ? data : JSON.stringify(data),
          user_id: this.userId,
          chat_session_id: this.sessionId,
          type: 'text'
        });

      if (dbError) {
        throw dbError;
      }

      logger.debug('Message processed successfully', {
        userId: this.userId,
        sessionId: this.sessionId,
        context: {
          type: 'message',
          status: 'processed'
        }
      });
    } catch (error) {
      logger.error('Failed to process message', {
        userId: this.userId,
        sessionId: this.sessionId,
        error,
        context: {
          type: 'error',
          action: 'process_message'
        }
      });
      throw error;
    }
  }
}