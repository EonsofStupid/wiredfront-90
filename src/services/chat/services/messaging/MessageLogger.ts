import { logger } from '../../LoggingService';
import { Message } from '@/types/chat';

export class MessageLogger {
  constructor(private sessionId: string) {}

  logMessageAttempt(message: Partial<Message>) {
    logger.info('Attempting to send message', {
      sessionId: this.sessionId,
      messageId: message.id,
      type: message.type,
      timestamp: new Date().toISOString(),
      context: {
        component: 'MessageService',
        action: 'send_attempt'
      }
    });
  }

  logMessageSuccess(message: Partial<Message>) {
    logger.info('Message sent successfully', {
      sessionId: this.sessionId,
      messageId: message.id,
      type: message.type,
      timestamp: new Date().toISOString(),
      context: {
        component: 'MessageService',
        action: 'send_success'
      }
    });
  }

  logMessageError(error: Error, message?: Partial<Message>) {
    logger.error('Failed to send message', {
      sessionId: this.sessionId,
      messageId: message?.id,
      error,
      timestamp: new Date().toISOString(),
      context: {
        component: 'MessageService',
        action: 'send_error'
      }
    });
  }

  logMessageReceived(message: any) {
    logger.info('Message received', {
      sessionId: this.sessionId,
      messageId: message.id,
      type: message.type,
      timestamp: new Date().toISOString(),
      context: {
        component: 'MessageService',
        action: 'receive'
      }
    });
  }

  logMessageProcessing(message: any) {
    logger.debug('Processing message', {
      sessionId: this.sessionId,
      messageId: message.id,
      type: message.type,
      timestamp: new Date().toISOString(),
      context: {
        component: 'MessageService',
        action: 'process'
      }
    });
  }

  logMessageProcessed(message: any) {
    logger.info('Message processed', {
      sessionId: this.sessionId,
      messageId: message.id,
      type: message.type,
      timestamp: new Date().toISOString(),
      context: {
        component: 'MessageService',
        action: 'process_complete'
      }
    });
  }

  logAttachmentUpload(fileInfo: { name: string, type: string, size: number }) {
    logger.info('Uploading attachment', {
      sessionId: this.sessionId,
      fileInfo,
      timestamp: new Date().toISOString(),
      context: {
        component: 'MessageService',
        action: 'upload_attachment'
      }
    });
  }

  logAttachmentSuccess(fileInfo: { name: string, url: string }) {
    logger.info('Attachment uploaded successfully', {
      sessionId: this.sessionId,
      fileInfo,
      timestamp: new Date().toISOString(),
      context: {
        component: 'MessageService',
        action: 'upload_success'
      }
    });
  }

  logAttachmentError(error: Error, fileInfo?: { name: string }) {
    logger.error('Failed to upload attachment', {
      sessionId: this.sessionId,
      fileInfo,
      error,
      timestamp: new Date().toISOString(),
      context: {
        component: 'MessageService',
        action: 'upload_error'
      }
    });
  }
}