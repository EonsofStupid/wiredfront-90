
import { ChatMode, MessageRole } from '@/components/chat/types/chat/enums';
import { EventEmitter } from '@/utils/event-emitter';
import { v4 as uuid } from 'uuid';
import { Provider, ProviderType } from '@/components/chat/types/provider-types';
import { logger } from '@/services/chat/LoggingService';
import { SendMessageOptions, ChatSettings, ChatBridgeState, ChatBridgeEvent } from '@/components/chat/types/chat/bridge';

/**
 * ChatBridge provides a unified interface for interacting with AI providers
 */
export class ChatBridge {
  private bridgeId: string;
  private eventEmitter: EventEmitter;
  private state: ChatBridgeState = {
    isOpen: false,
    isMinimized: false,
    currentMode: ChatMode.Chat,
    userInput: '',
    isWaitingResponse: false,
    currentProviderId: null,
    currentConversationId: null,
    features: [],
    position: {
      x: 0,
      y: 0
    },
    docked: true
  };
  
  private settings: ChatSettings = {
    apiProvider: 'openai',
    temperature: 0.7,
    maxTokens: 1000,
    uiPreferences: {
      theme: 'system',
      fontSize: 'medium',
      enterSends: true,
      showTimestamps: false
    },
    advancedSettings: {
      codeBlock: {
        copyButton: true,
        lineNumbers: true
      },
      streaming: true,
      useMarkdown: true,
      quickResponses: true
    }
  };
  
  constructor() {
    this.bridgeId = uuid();
    this.eventEmitter = new EventEmitter();
    
    logger.info('ChatBridge initialized', { bridgeId: this.bridgeId });
  }
  
  /**
   * Send a message to the AI provider
   */
  public async sendMessage(message: string, options?: SendMessageOptions): Promise<string> {
    if (!message.trim()) {
      throw new Error('Message cannot be empty');
    }
    
    const messageId = uuid();
    const mode = options?.mode || this.state.currentMode;
    const conversationId = options?.conversationId || this.state.currentConversationId;
    const providerId = options?.providerId || this.state.currentProviderId;
    
    this.setState({ isWaitingResponse: true });
    
    try {
      // Here we would integrate with the actual AI service
      logger.info('Sending message', {
        messageId,
        mode,
        conversationId,
        providerId,
        isRetry: options?.isRetry || false
      });
      
      // For now, just simulate a response
      setTimeout(() => {
        this.eventEmitter.emit('message:received', {
          id: uuid(),
          content: `Response to: ${message}`,
          role: MessageRole.Assistant,
          metadata: { provider: this.settings.apiProvider }
        });
        
        this.setState({ isWaitingResponse: false });
      }, 1000);
      
      // Emit sent event
      this.eventEmitter.emit('message:sent', {
        id: messageId,
        content: message,
        role: MessageRole.User,
        metadata: { mode }
      });
      
      return messageId;
    } catch (error) {
      this.setState({ isWaitingResponse: false });
      this.eventEmitter.emit('message:error', {
        error,
        messageId
      });
      throw error;
    }
  }
  
  /**
   * Get conversation messages
   */
  public async getMessages(conversationId?: string, limit?: number): Promise<any[]> {
    const targetConversationId = conversationId || this.state.currentConversationId;
    if (!targetConversationId) {
      return [];
    }
    
    // Here we would fetch actual messages
    // For now, return empty array
    return [];
  }
  
  /**
   * Clear all messages
   */
  public async clearMessages(): Promise<void> {
    this.eventEmitter.emit('session:cleared', {
      conversationId: this.state.currentConversationId
    });
  }
  
  /**
   * Get current state
   */
  public getState(): ChatBridgeState {
    return { ...this.state };
  }
  
  /**
   * Update state partially
   */
  public setState(updates: Partial<ChatBridgeState>): void {
    const oldState = { ...this.state };
    this.state = { ...this.state, ...updates };
    
    // Emit state changed event
    this.eventEmitter.emit('state:changed', {
      oldState,
      newState: this.state
    });
    
    // Additional events for specific state changes
    if (updates.currentMode !== undefined && updates.currentMode !== oldState.currentMode) {
      this.eventEmitter.emit('mode:changed', {
        oldMode: oldState.currentMode,
        newMode: updates.currentMode
      });
    }
    
    if (updates.isMessageLoading !== undefined) {
      logger.warn('isMessageLoading is deprecated, use isWaitingResponse instead');
    }
  }
  
  /**
   * Set current chat mode
   */
  public setMode(mode: ChatMode): boolean {
    if (this.state.currentMode === mode) {
      return false;
    }
    
    this.setState({ currentMode: mode });
    return true;
  }
  
  /**
   * Get current chat mode
   */
  public getCurrentMode(): ChatMode {
    return this.state.currentMode;
  }
  
  /**
   * Update chat settings
   */
  public updateSettings(updates: Partial<ChatSettings>): void {
    this.settings = { ...this.settings, ...updates };
    this.eventEmitter.emit('settings:updated', {
      settings: this.settings
    });
  }
  
  /**
   * Get chat settings
   */
  public getSettings(): ChatSettings {
    return { ...this.settings };
  }
  
  /**
   * Get current provider
   */
  public getProvider(): string | null {
    return this.state.currentProviderId;
  }
  
  /**
   * Set current provider
   */
  public setProvider(providerId: string): void {
    if (this.state.currentProviderId === providerId) {
      return;
    }
    
    const oldProviderId = this.state.currentProviderId;
    this.setState({ currentProviderId: providerId });
    
    this.eventEmitter.emit('provider:changed', {
      oldProviderId,
      newProviderId: providerId
    });
  }
  
  /**
   * Register event handler
   */
  public on<T = any>(event: ChatBridgeEvent, handler: (payload: T) => void): () => void {
    this.eventEmitter.on(event, handler);
    return () => this.eventEmitter.off(event, handler);
  }
  
  /**
   * Unregister event handler
   */
  public off<T = any>(event: ChatBridgeEvent, handler: (payload: T) => void): void {
    this.eventEmitter.off(event, handler);
  }
  
  /**
   * Emit custom event
   */
  public emit<T = any>(event: ChatBridgeEvent, payload: T): void {
    this.eventEmitter.emit(event, payload);
  }
}

export const chatBridge = new ChatBridge();
