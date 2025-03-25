
import { supabase } from '@/integrations/supabase/client';
import { BridgeEvent, BridgeListener, BridgeMessage, BridgeSettings, ChatMode, ConnectionStatus } from './types';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '@/services/chat/LoggingService';

class ChatBridge {
  private static instance: ChatBridge;
  private listeners: BridgeListener[] = [];
  private messages: BridgeMessage[] = [];
  private connectionStatus: ConnectionStatus = 'disconnected';
  private userId: string | null = null;
  private sessionId: string | null = null;
  private _settings: BridgeSettings = {
    mode: 'chat',
    providers: {
      openai: true,
      anthropic: false,
    },
    appearance: {
      position: 'bottom-right',
      buttonStyle: 'wfpulse',
      buttonSize: 'medium',
      buttonColor: '#0EA5E9',
    },
    notifications: {
      sound: true,
      desktop: false,
    },
    chatWidth: 400,
    chatHeight: 600
  };

  private constructor() {
    this.init();
  }

  public static getInstance(): ChatBridge {
    if (!ChatBridge.instance) {
      ChatBridge.instance = new ChatBridge();
    }
    return ChatBridge.instance;
  }

  private async init() {
    try {
      logger.info('Initializing ChatBridge');
      // Check auth state
      const { data: authData } = await supabase.auth.getUser();
      this.userId = authData?.user?.id || null;
      
      // Load settings from localStorage or user preferences if available
      this.loadSettings();
      
      // Create new session
      this.sessionId = uuidv4();
      
      // Set connection status
      this.setConnectionStatus('connected');
      
      logger.info('ChatBridge initialized', { userId: this.userId, sessionId: this.sessionId });
    } catch (error) {
      logger.error('Failed to initialize ChatBridge', error);
      this.setConnectionStatus('error');
    }
  }

  private loadSettings() {
    try {
      const storedSettings = localStorage.getItem('chat_settings');
      if (storedSettings) {
        const parsedSettings = JSON.parse(storedSettings);
        this._settings = {
          ...this._settings,
          ...parsedSettings,
        };
      }
    } catch (error) {
      logger.error('Failed to load settings', error);
    }
  }

  private setConnectionStatus(status: ConnectionStatus) {
    this.connectionStatus = status;
    this.emit({
      type: 'connection:change',
      payload: status,
      timestamp: Date.now(),
    });
  }

  private emit(event: BridgeEvent) {
    this.listeners.forEach(listener => listener(event));
    
    // Log events to console in dev mode
    if (process.env.NODE_ENV === 'development') {
      console.log(`[ChatBridge] ${event.type}`, event.payload);
    }
    
    // Log to Supabase if connected
    if (this.userId) {
      this.logToSupabase(event).catch(error => {
        logger.error('Failed to log event to Supabase', error);
      });
    }
  }

  private async logToSupabase(event: BridgeEvent) {
    try {
      await supabase.from('system_logs').insert({
        user_id: this.userId,
        source: 'chat_bridge',
        level: 'info',
        message: `Event: ${event.type}`,
        metadata: { 
          session_id: this.sessionId,
          payload: event.payload,
          timestamp: new Date(event.timestamp).toISOString()
        },
      });
    } catch (error) {
      logger.error('Failed to log to Supabase', error);
    }
  }

  public addListener(listener: BridgeListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public getConnectionStatus(): ConnectionStatus {
    return this.connectionStatus;
  }

  public get settings(): BridgeSettings {
    return { ...this._settings };
  }

  public updateSettings(settings: Partial<BridgeSettings>) {
    this._settings = {
      ...this._settings,
      ...settings,
    };
    
    // Save to localStorage
    localStorage.setItem('chat_settings', JSON.stringify(this._settings));
    
    // Emit event
    this.emit({
      type: 'settings:update',
      payload: this._settings,
      timestamp: Date.now(),
    });

    return this._settings;
  }

  public setMode(mode: ChatMode) {
    this._settings.mode = mode;
    
    // Emit event
    this.emit({
      type: 'mode:change',
      payload: mode,
      timestamp: Date.now(),
    });

    return mode;
  }

  public getMessages(): BridgeMessage[] {
    return [...this.messages];
  }

  public async sendMessage(content: string, role: 'user' | 'system' = 'user') {
    if (!content.trim()) {
      return null;
    }

    const message: BridgeMessage = {
      id: uuidv4(),
      content,
      user_id: this.userId,
      type: 'text',
      metadata: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      chat_session_id: this.sessionId || '',
      is_minimized: false,
      position: {},
      window_state: {},
      last_accessed: new Date().toISOString(),
      retry_count: 0,
      message_status: 'sent',
      role,
      processing: true,
    };

    // Add to local messages
    this.messages.push(message);

    // Emit event
    this.emit({
      type: 'message:send',
      payload: message,
      timestamp: Date.now(),
    });

    try {
      // Save to Supabase if authenticated
      if (this.userId) {
        await supabase.from('chat_messages').insert({
          id: message.id,
          user_id: this.userId,
          session_id: this.sessionId,
          content: message.content,
          role: message.role,
          status: 'sent',
        });
      }
      
      return message;
    } catch (error: any) {
      logger.error('Failed to save message', error);
      
      // Update message status
      const updatedMessage = { 
        ...message, 
        message_status: 'failed',
        processing: false,
        error: error.message 
      };
      
      this.updateMessage(updatedMessage);
      
      return updatedMessage;
    }
  }

  public updateMessage(message: BridgeMessage) {
    // Find and update message
    this.messages = this.messages.map(m => 
      m.id === message.id ? { ...m, ...message } : m
    );

    // Emit event
    this.emit({
      type: 'message:update',
      payload: message,
      timestamp: Date.now(),
    });

    return message;
  }

  public receiveMessage(content: string) {
    const message: BridgeMessage = {
      id: uuidv4(),
      content,
      user_id: null,
      type: 'text',
      metadata: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      chat_session_id: this.sessionId || '',
      is_minimized: false,
      position: {},
      window_state: {},
      last_accessed: new Date().toISOString(),
      retry_count: 0,
      message_status: 'sent',
      role: 'assistant',
    };

    // Add to local messages
    this.messages.push(message);

    // Emit event
    this.emit({
      type: 'message:receive',
      payload: message,
      timestamp: Date.now(),
    });

    return message;
  }

  public clearMessages() {
    this.messages = [];
  }
}

export default ChatBridge;
