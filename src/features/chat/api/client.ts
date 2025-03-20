import { supabase } from '@/lib/supabase';
import type { ChatMessage, ChatMode, ChatProvider, ChatSession } from '../types';

export class ChatApiClient {
  async createSession(data: { title: string; mode: ChatMode }): Promise<ChatSession> {
    const { data: session, error } = await supabase
      .from('chat_sessions')
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return session;
  }

  async fetchSessions(): Promise<ChatSession[]> {
    const { data: sessions, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return sessions;
  }

  async fetchSession(sessionId: string): Promise<ChatSession> {
    const { data: session, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (error) throw error;
    return session;
  }

  async updateSession(sessionId: string, data: Partial<ChatSession>): Promise<ChatSession> {
    const { data: session, error } = await supabase
      .from('chat_sessions')
      .update(data)
      .eq('id', sessionId)
      .select()
      .single();

    if (error) throw error;
    return session;
  }

  async deleteSession(sessionId: string): Promise<void> {
    const { error } = await supabase
      .from('chat_sessions')
      .delete()
      .eq('id', sessionId);

    if (error) throw error;
  }

  async fetchMessages(sessionId: string): Promise<ChatMessage[]> {
    const { data: messages, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return messages;
  }

  async createMessage(data: Omit<ChatMessage, 'id' | 'createdAt'>): Promise<ChatMessage> {
    const { data: message, error } = await supabase
      .from('chat_messages')
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return message;
  }

  async updateMessage(messageId: string, data: Partial<ChatMessage>): Promise<ChatMessage> {
    const { data: message, error } = await supabase
      .from('chat_messages')
      .update(data)
      .eq('id', messageId)
      .select()
      .single();

    if (error) throw error;
    return message;
  }

  async deleteMessage(messageId: string): Promise<void> {
    const { error } = await supabase
      .from('chat_messages')
      .delete()
      .eq('id', messageId);

    if (error) throw error;
  }

  async fetchProviders(): Promise<ChatProvider[]> {
    const { data: providers, error } = await supabase
      .from('chat_providers')
      .select('*')
      .eq('is_enabled', true)
      .order('name', { ascending: true });

    if (error) throw error;
    return providers;
  }
}
