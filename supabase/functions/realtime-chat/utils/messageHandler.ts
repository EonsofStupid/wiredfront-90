import { logger } from './logger.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

export class MessageHandler {
  constructor(
    private userId: string,
    private sessionId: string
  ) {}

  async handleMessage(data: any) {
    try {
      // Handle different message types
      switch (data.type) {
        case 'chat':
          await this.handleChatMessage(data);
          break;
        case 'status':
          await this.handleStatusUpdate(data);
          break;
        default:
          logger.warn('Unknown message type', {
            type: data.type,
            userId: this.userId,
            sessionId: this.sessionId
          });
      }
    } catch (error) {
      logger.error('Failed to handle message', {
        error,
        userId: this.userId,
        sessionId: this.sessionId
      });
      throw error;
    }
  }

  private async handleChatMessage(data: any) {
    const { error } = await supabase
      .from('messages')
      .insert({
        content: data.content,
        user_id: this.userId,
        chat_session_id: this.sessionId,
        type: 'text',
        metadata: data.metadata || {}
      });

    if (error) {
      logger.error('Failed to save message', {
        error,
        userId: this.userId,
        sessionId: this.sessionId
      });
      throw error;
    }

    logger.debug('Message saved successfully', {
      userId: this.userId,
      sessionId: this.sessionId
    });
  }

  private async handleStatusUpdate(data: any) {
    // Handle status updates (typing indicators, read receipts, etc.)
    logger.debug('Status update received', {
      status: data.status,
      userId: this.userId,
      sessionId: this.sessionId
    });
  }
}