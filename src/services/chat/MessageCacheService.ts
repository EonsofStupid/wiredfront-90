import { Message } from '@/features/chat/core/messaging/MessageManager';

class MessageCacheService {
  private cache: Map<string, Message[]> = new Map();
  
  addMessage(sessionId: string, message: Message) {
    const messages = this.cache.get(sessionId) || [];
    messages.push(message);
    this.cache.set(sessionId, messages);
  }
  
  getMessages(sessionId: string): Message[] {
    return this.cache.get(sessionId) || [];
  }
  
  clearSession(sessionId: string) {
    this.cache.delete(sessionId);
  }
  
  clearAll() {
    this.cache.clear();
  }
}

export const messageCache = new MessageCacheService();