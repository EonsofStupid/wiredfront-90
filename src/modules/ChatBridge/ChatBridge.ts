
import { ChatMode, ChatPosition } from '@/types/chat/enums';
import { ChatBridgeState, SendMessageOptions } from '@/types/chat/bridge';
import { Conversation } from '@/types/chat/conversation';
import { Provider } from '@/types/chat/providers';
import { logger } from '@/services/chat/LoggingService';

export class ChatBridge {
  private listeners: Map<string, Function[]> = new Map();
  private userSettings: Record<string, any> = {};
  private adminSettings: Record<string, any> = {};
  private isOpen: boolean = false;
  private isMinimized: boolean = false;
  private currentMode: ChatMode = ChatMode.Chat;
  private currentProvider: Provider | null = null;
  private currentConversationId: string | null = null;
  private isMessageLoading: boolean = false;
  private position: ChatPosition = ChatPosition.BottomRight;
  private docked: boolean = true;
  private features = {
    voice: false,
    rag: false,
    modeSwitch: true,
    notifications: true,
    github: false,
    codeAssistant: true,
    ragSupport: false,
    githubSync: false,
    knowledgeBase: false,
    tokenEnforcement: false
  };

  // Conversation operations
  async createConversation(params?: { title?: string, mode?: ChatMode }): Promise<string> {
    logger.info('ChatBridge: Creating conversation', params);
    const conversationId = `conv_${Date.now()}`;
    this.currentConversationId = conversationId;
    this.notify('conversationCreated', { conversationId, ...params });
    return conversationId;
  }

  async switchConversation(conversationId: string): Promise<boolean> {
    logger.info(`ChatBridge: Switching to conversation ${conversationId}`);
    this.currentConversationId = conversationId;
    this.notify('conversationSwitched', { conversationId });
    return true;
  }

  async updateConversation(conversationId: string, updates: Partial<Conversation>): Promise<boolean> {
    logger.info(`ChatBridge: Updating conversation ${conversationId}`, updates);
    this.notify('conversationUpdated', { conversationId, updates });
    return true;
  }

  async archiveConversation(conversationId: string): Promise<boolean> {
    logger.info(`ChatBridge: Archiving conversation ${conversationId}`);
    this.notify('conversationArchived', { conversationId });
    return true;
  }

  // Message operations
  async sendMessage(content: string, options?: SendMessageOptions): Promise<string> {
    logger.info('ChatBridge: Sending message', { content, options });
    this.isMessageLoading = true;
    this.notify('stateChanged', this.getState());
    
    // Notify about message send
    const messageId = `msg_${Date.now()}`;
    this.notify('messageSent', { 
      id: messageId, 
      content, 
      conversationId: options?.conversationId || this.currentConversationId,
      ...options 
    });

    // Simulate response for now
    setTimeout(() => {
      this.isMessageLoading = false;
      this.notify('stateChanged', this.getState());
      this.notify('messageReceived', {
        id: `resp_${Date.now()}`,
        content: `Response to: ${content}`,
        conversationId: options?.conversationId || this.currentConversationId
      });
    }, 1000);

    return messageId;
  }

  async updateMessage(messageId: string, content: string): Promise<boolean> {
    logger.info(`ChatBridge: Updating message ${messageId}`, { content });
    this.notify('messageUpdated', { messageId, content });
    return true;
  }

  async deleteMessage(messageId: string): Promise<boolean> {
    logger.info(`ChatBridge: Deleting message ${messageId}`);
    this.notify('messageDeleted', { messageId });
    return true;
  }

  // Mode and provider management
  async setMode(mode: ChatMode): Promise<boolean> {
    logger.info(`ChatBridge: Setting mode to ${mode}`);
    this.currentMode = mode;
    this.notify('modeChanged', { mode });
    this.notify('stateChanged', this.getState());
    return true;
  }

  async setProvider(providerId: string): Promise<boolean> {
    logger.info(`ChatBridge: Setting provider to ${providerId}`);
    // In a real implementation we would lookup the provider by ID
    // For now just update the ID
    this.notify('providerChanged', { providerId });
    this.notify('stateChanged', this.getState());
    return true;
  }

  // UI control methods
  openChat(): void {
    logger.info('ChatBridge: Opening chat');
    this.isOpen = true;
    this.notify('chatOpened', {});
    this.notify('stateChanged', this.getState());
  }

  closeChat(): void {
    logger.info('ChatBridge: Closing chat');
    this.isOpen = false;
    this.notify('chatClosed', {});
    this.notify('stateChanged', this.getState());
  }

  toggleChat(): void {
    logger.info(`ChatBridge: Toggling chat (current: ${this.isOpen})`);
    this.isOpen = !this.isOpen;
    this.notify(this.isOpen ? 'chatOpened' : 'chatClosed', {});
    this.notify('stateChanged', this.getState());
  }

  minimizeChat(): void {
    logger.info('ChatBridge: Minimizing chat');
    this.isMinimized = true;
    this.notify('chatMinimized', {});
    this.notify('stateChanged', this.getState());
  }

  maximizeChat(): void {
    logger.info('ChatBridge: Maximizing chat');
    this.isMinimized = false;
    this.notify('chatMaximized', {});
    this.notify('stateChanged', this.getState());
  }

  togglePosition(): void {
    logger.info('ChatBridge: Toggling position');
    this.position = this.position === ChatPosition.BottomRight
      ? ChatPosition.BottomLeft
      : ChatPosition.BottomRight;
    this.notify('positionToggled', { position: this.position });
    this.notify('stateChanged', this.getState());
  }

  // Toggle docked state
  toggleDocked(): void {
    logger.info('ChatBridge: Toggling docked state');
    this.docked = !this.docked;
    this.notify('dockedToggled', { docked: this.docked });
    this.notify('stateChanged', this.getState());
  }

  // State getters
  getCurrentConversationId(): string | null {
    return this.currentConversationId;
  }

  getCurrentMode(): ChatMode {
    return this.currentMode;
  }

  getCurrentProvider(): Provider | null {
    return this.currentProvider;
  }

  isDocked(): boolean {
    return this.docked;
  }

  getPosition(): ChatPosition {
    return this.position;
  }

  getState(): ChatBridgeState {
    return {
      isOpen: this.isOpen,
      isMinimized: this.isMinimized,
      currentMode: this.currentMode,
      currentProvider: this.currentProvider,
      currentConversationId: this.currentConversationId,
      isMessageLoading: this.isMessageLoading,
      position: this.position,
      docked: this.docked,
      features: { ...this.features }
    };
  }

  // Settings management
  setUserSettings(settings: Record<string, any>): void {
    this.userSettings = { ...this.userSettings, ...settings };
    this.notify('userSettingsChanged', this.userSettings);
  }

  getUserSettings(): Record<string, any> {
    return { ...this.userSettings };
  }

  setAdminSettings(settings: Record<string, any>): void {
    this.adminSettings = { ...this.adminSettings, ...settings };
    this.notify('adminSettingsChanged', this.adminSettings);
  }

  getAdminSettings(): Record<string, any> {
    return { ...this.adminSettings };
  }

  // Additional methods for feature management
  toggleFeature(featureKey: string): void {
    if (featureKey in this.features) {
      this.features[featureKey as keyof typeof this.features] = 
        !this.features[featureKey as keyof typeof this.features];
      this.notify('featureToggled', { 
        feature: featureKey, 
        enabled: this.features[featureKey as keyof typeof this.features] 
      });
      this.notify('stateChanged', this.getState());
    }
  }

  // Event listening
  on(eventType: string, callback: Function): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType)?.push(callback);

    // Return an unsubscribe function
    return () => {
      const callbacks = this.listeners.get(eventType);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index !== -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  off(eventType: string, callback: Function): void {
    const callbacks = this.listeners.get(eventType);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  // Notify all listeners of an event
  private notify(eventType: string, data: any): void {
    const callbacks = this.listeners.get(eventType);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ChatBridge listener for event ${eventType}:`, error);
        }
      });
    }
  }
}
