import { ChatApiClient } from './api/client';
import type { ChatMessage, ChatMode, ChatProvider, ChatSession } from './types';

export class ChatService {
  private static apiClient = new ChatApiClient();

  static async createSession(title: string, mode: ChatMode): Promise<ChatSession> {
    return this.apiClient.createSession({ title, mode });
  }

  static async fetchSessions(): Promise<ChatSession[]> {
    return this.apiClient.fetchSessions();
  }

  static async fetchSession(sessionId: string): Promise<ChatSession> {
    return this.apiClient.fetchSession(sessionId);
  }

  static async updateSession(sessionId: string, data: Partial<ChatSession>): Promise<ChatSession> {
    return this.apiClient.updateSession(sessionId, data);
  }

  static async deleteSession(sessionId: string): Promise<void> {
    return this.apiClient.deleteSession(sessionId);
  }

  static async fetchMessages(sessionId: string): Promise<ChatMessage[]> {
    return this.apiClient.fetchMessages(sessionId);
  }

  static async createMessage(data: Omit<ChatMessage, 'id' | 'createdAt'>): Promise<ChatMessage> {
    return this.apiClient.createMessage(data);
  }

  static async updateMessage(messageId: string, data: Partial<ChatMessage>): Promise<ChatMessage> {
    return this.apiClient.updateMessage(messageId, data);
  }

  static async deleteMessage(messageId: string): Promise<void> {
    return this.apiClient.deleteMessage(messageId);
  }

  static async fetchProviders(): Promise<ChatProvider[]> {
    return this.apiClient.fetchProviders();
  }

  static async initializeChat(): Promise<{
    providers: ChatProvider[];
    sessions: ChatSession[];
  }> {
    const [providers, sessions] = await Promise.all([
      this.fetchProviders(),
      this.fetchSessions(),
    ]);

    return { providers, sessions };
  }
}
