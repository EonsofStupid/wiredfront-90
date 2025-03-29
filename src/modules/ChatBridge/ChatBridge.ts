
import { ChatMode, MessageRole } from '@/types/enums';
import { EventEmitter } from '@/utils/event-emitter';
import { v4 as uuid } from 'uuid';
import { Provider } from '@/types/provider-types';
import { logger } from '@/services/chat/LoggingService';
import { 
  SendMessageOptions, 
  ChatSettings, 
  ChatBridgeState, 
  ChatBridgeEvent,
  ChatBridgeInterface
} from '@/components/chat/types/chat/bridge';

/**
 * ChatBridge provides a unified interface for interacting with AI providers
 */
export class ChatBridge implements ChatBridgeInterface {
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
    features: {},
    position: 'bottom-right',
    docked: true,
    isMessageLoading: false
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
   * Get user settings (for compatibility)
   */
  public getUserSettings(): any {
    return this.getSettings();
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

  /**
   * Toggle feature flag
   */
  public toggleFeature(key: string): void {
    const features = { ...this.state.features };
    features[key] = !features[key];
    this.setState({ features });
  }

  /**
   * Toggle position of chat
   */
  public togglePosition(): void {
    const currentPosition = this.state.position;
    const newPosition = currentPosition === 'bottom-right' ? 'bottom-left' : 'bottom-right';
    this.setState({ position: newPosition });
  }

  /**
   * Toggle docked state
   */
  public toggleDocked(): void {
    this.setState({ docked: !this.state.docked });
  }

  /**
   * Update token information
   */
  public updateTokens(value: any): void {
    // This would update token information
    logger.info('Updating tokens', { value });
  }

  /**
   * Set admin settings
   */
  public setAdminSettings(settings: any): void {
    logger.info('Setting admin settings', { settings });
    // Implementation would depend on the specific settings
  }

  /**
   * Send a custom event
   */
  public sendEvent(event: string, payload?: any): void {
    logger.info('Sending custom event', { event, payload });
    this.eventEmitter.emit(event as any, payload);
  }

  /**
   * Create a new conversation
   */
  public createConversation(params: any): void {
    logger.info('Creating conversation', { params });
    // Implementation would create a conversation
  }

  /**
   * Switch to a different conversation
   */
  public switchConversation(id: string): void {
    logger.info('Switching conversation', { id });
    this.setState({ currentConversationId: id });
    this.eventEmitter.emit('conversation:changed', { id });
  }

  /**
   * Archive a conversation
   */
  public archiveConversation(id: string): void {
    logger.info('Archiving conversation', { id });
    // Implementation would archive the conversation
  }

  /**
   * Delete a conversation
   */
  public deleteConversation(id: string): void {
    logger.info('Deleting conversation', { id });
    // Implementation would delete the conversation
  }

  /**
   * Toggle chat open/closed state
   */
  public toggleChat(): void {
    this.setState({ isOpen: !this.state.isOpen });
  }

  /**
   * Update chat settings (for compatibility)
   */
  public updateChatSettings(settings: any): void {
    this.updateSettings(settings);
  }
}

export const chatBridge = new ChatBridge();
