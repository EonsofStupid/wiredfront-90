import { Message } from '@/types/chat';
import { MessageLogger } from './MessageLogger';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export class MessageProcessor {
  private logger: MessageLogger;

  constructor(private sessionId: string) {
    this.logger = new MessageLogger(sessionId);
  }

  async processIncomingMessage(message: any) {
    this.logger.logMessageReceived(message);
    toast.info('New message received');

    try {
      this.logger.logMessageProcessing(message);
      
      // Process different message types
      if (message.type === 'text') {
        await this.processTextMessage(message);
      } else if (message.type === 'command') {
        await this.processCommandMessage(message);
      } else if (message.type === 'system') {
        await this.processSystemMessage(message);
      }

      this.logger.logMessageProcessed(message);
      toast.success('Message processed successfully');
    } catch (error) {
      this.logger.logMessageError(error as Error, message);
      toast.error('Failed to process message');
      throw error;
    }
  }

  private async processTextMessage(message: any) {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        content: message.content,
        type: 'text',
        chat_session_id: this.sessionId,
        user_id: message.user_id
      });

    if (error) throw error;
    return data;
  }

  private async processCommandMessage(message: any) {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        content: message.content,
        type: 'command',
        chat_session_id: this.sessionId,
        user_id: message.user_id,
        metadata: { command: message.command }
      });

    if (error) throw error;
    return data;
  }

  private async processSystemMessage(message: any) {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        content: message.content,
        type: 'system',
        chat_session_id: this.sessionId,
        user_id: message.user_id,
        metadata: message.metadata
      });

    if (error) throw error;
    return data;
  }
}