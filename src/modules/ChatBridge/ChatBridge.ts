
import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';
import EventEmitter from '@/utils/event-emitter';
import { logger } from '@/services/chat/LoggingService';
import { useChatFeatures } from '@/stores/features/chat/chatFeatures';
import { MessageRole, ChatMode } from '@/types/enums';
import { ChatBridgeInterface, ChatBridgeEvent, EventHandler, SendMessageOptions, ChatBridgeState, ChatSettings } from '@/components/chat/types/chat/bridge';

/**
 * ChatBridge class - central communication interface between chat UI and app
 */
class ChatBridge implements ChatBridgeInterface {
  private eventEmitter: EventEmitter = new EventEmitter();
  private settings: ChatSettings = {
    apiProvider: 'openai',
    temperature: 0.7,
    maxTokens: 2048,
    uiPreferences: {
      theme: 'dark',
      fontSize: 'medium',
      enterSends: true,
      showTimestamps: true,
    },
    advancedSettings: {
      codeBlock: {
        copyButton: true,
        lineNumbers: true,
      },
      streaming: true,
      useMarkdown: true,
      quickResponses: false,
    },
  };

  constructor() {
    logger.info('ChatBridge initialized');

    // Initialize any required services
    this.initServices();
  }

  /**
   * Initialize required services
   */
  private initServices() {
    // Initialize chat features
    useChatFeatures.getState().initialize();
  }

  /**
   * Send a message to the chat interface
   */
  async sendMessage(message: string, options: SendMessageOptions = {}): Promise<string> {
    const messageId = uuidv4();
    
    logger.info('Message sent via ChatBridge', {
      messageId,
      mode: options.mode || this.getCurrentMode(),
      length: message.length
    });
    
    // Get chat features for validation
    const chatFeatures = useChatFeatures.getState().features;
    
    // Check if message can be sent based on current features
    const mode = options.mode || this.getCurrentMode();
    
    // Validate mode against features
    if (
      (mode === ChatMode.Training && !chatFeatures.training) ||
      (mode === ChatMode.Image && !chatFeatures.imageGeneration) ||
      (mode === ChatMode.Code && !chatFeatures.codeAssistant)
    ) {
      logger.warn(`Message rejected: ${mode} mode is disabled`, { mode });
      throw new Error(`${mode} mode is currently disabled`);
    }
    
    // Emit message sent event
    this.emit('message:sent', {
      id: messageId,
      content: message,
      role: MessageRole.User,
      mode,
      options
    });
    
    return messageId;
  }

  /**
   * Get messages from the current conversation
   */
  async getMessages(conversationId?: string, limit: number = 50): Promise<any[]> {
    // This would typically fetch from a store or service
    logger.debug('getMessages called via ChatBridge', { conversationId, limit });
    return [];
  }

  /**
   * Clear all messages in the current conversation
   */
  async clearMessages(): Promise<void> {
    logger.info('Messages cleared via ChatBridge');
    this.emit('session:cleared', null);
    return;
  }

  /**
   * Get current ChatBridge state
   */
  getState(): ChatBridgeState {
    // Get chat features
    const chatFeatures = useChatFeatures.getState().features;
    
    return {
      isOpen: false,
      isMinimized: false,
      currentMode: ChatMode.Chat,
      userInput: '',
      isWaitingResponse: false,
      currentProviderId: null,
      currentConversationId: null,
      features: chatFeatures,
      position: 'bottom-right',
      docked: true,
      isMessageLoading: false
    };
  }

  /**
   * Update ChatBridge state
   */
  setState(state: Partial<ChatBridgeState>): void {
    logger.debug('ChatBridge state updated', state);
    this.emit('state:changed', state);
  }

  /**
   * Set chat mode
   */
  setMode(mode: ChatMode): boolean {
    logger.info('Chat mode changed', { mode });
    this.emit('mode:changed', { mode });
    return true;
  }

  /**
   * Get current chat mode
   */
  getCurrentMode(): ChatMode {
    return ChatMode.Chat; // Default, would be fetched from a store in practice
  }

  /**
   * Update chat settings
   */
  updateSettings(settings: Partial<ChatSettings>): void {
    this.settings = {
      ...this.settings,
      ...settings
    };
    
    logger.debug('Chat settings updated', settings);
    this.emit('settings:updated', this.settings);
  }

  /**
   * Get current chat settings
   */
  getSettings(): ChatSettings {
    return this.settings;
  }

  /**
   * Get current provider ID
   */
  getProvider(): string | null {
    return this.settings.apiProvider;
  }

  /**
   * Set provider ID
   */
  setProvider(providerId: string): void {
    this.settings.apiProvider = providerId;
    logger.info('Chat provider changed', { providerId });
    this.emit('provider:changed', { providerId });
  }

  /**
   * Register an event handler
   */
  on<T = any>(event: ChatBridgeEvent, handler: EventHandler<T>): () => void {
    return this.eventEmitter.on(event, handler);
  }

  /**
   * Remove an event handler
   */
  off<T = any>(event: ChatBridgeEvent, handler: EventHandler<T>): void {
    this.eventEmitter.off(event, handler);
  }

  /**
   * Emit an event
   */
  emit<T = any>(event: ChatBridgeEvent, payload: T): void {
    this.eventEmitter.emit(event, payload);
  }

  /**
   * Toggle a feature on or off
   */
  toggleFeature(key: string): void {
    const chatFeatures = useChatFeatures.getState();
    if (key in chatFeatures.features) {
      chatFeatures.toggleFeature(key as any);
      logger.info('Feature toggled via ChatBridge', { feature: key });
    }
  }

  /**
   * Toggle chat position
   */
  togglePosition(): void {
    logger.info('Position toggled via ChatBridge');
    this.emit('state:changed', { position: 'toggled' });
  }

  /**
   * Toggle docked state
   */
  toggleDocked(): void {
    logger.info('Docked state toggled via ChatBridge');
    this.emit('state:changed', { docked: 'toggled' });
  }

  /**
   * Update token information
   */
  updateTokens(value: any): void {
    logger.info('Token information updated via ChatBridge');
  }

  /**
   * Set admin settings
   */
  setAdminSettings(settings: any): void {
    logger.info('Admin settings updated via ChatBridge');
  }

  /**
   * Send a custom event
   */
  sendEvent(event: string, payload?: any): void {
    logger.info('Custom event sent via ChatBridge', { event, payload });
    this.eventEmitter.emit(event, payload);
  }

  /**
   * Create a new conversation
   */
  createConversation(params: any): void {
    logger.info('New conversation created via ChatBridge', params);
    this.emit('conversation:changed', { action: 'create', ...params });
  }

  /**
   * Switch to a different conversation
   */
  switchConversation(id: string): void {
    logger.info('Switched conversation via ChatBridge', { conversationId: id });
    this.emit('conversation:changed', { action: 'switch', conversationId: id });
  }

  /**
   * Archive a conversation
   */
  archiveConversation(id: string): void {
    logger.info('Archived conversation via ChatBridge', { conversationId: id });
    this.emit('conversation:changed', { action: 'archive', conversationId: id });
  }

  /**
   * Delete a conversation
   */
  deleteConversation(id: string): void {
    logger.info('Deleted conversation via ChatBridge', { conversationId: id });
    this.emit('conversation:changed', { action: 'delete', conversationId: id });
  }
  
  /**
   * Toggle chat open/close
   */
  toggleChat(): void {
    logger.info('Chat toggled via ChatBridge');
    this.emit('state:changed', { isOpen: 'toggled' });
  }
}

// Singleton instance of ChatBridge
export const chatBridge = new ChatBridge();

// Zustand store for ChatBridge (alternative access method)
export const useChatBridgeStore = create<{ bridge: ChatBridge }>()(() => ({
  bridge: chatBridge
}));
