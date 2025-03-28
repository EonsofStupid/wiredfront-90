
import { useChatStore } from '@/components/chat/store/chatStore';
import { useConversationStore } from '@/components/chat/store/conversation/store';
import { useMessageStore } from '@/components/chat/messaging/MessageManager';
import { 
  ChatBridgeState,
  SendMessageOptions,
  ChatBridge as ChatBridgeInterface
} from '@/types/chat/bridge';
import { 
  ChatMode, 
  MessageRole, 
  MessageStatus, 
  MessageType,
  ChatPositions
} from '@/types/chat/enums';
import { Provider } from '@/types/chat/providers';
import { Conversation } from '@/types/chat/conversation';
import { logger } from '@/services/chat/LoggingService';
import { EnumUtils } from '@/lib/enums';

/**
 * ChatBridge implementation
 * This is the central communication layer between the app and chat components
 */
export class ChatBridge implements ChatBridgeInterface {
  private chatStore;
  private conversationStore;
  private messageStore;

  constructor() {
    // Get store instances
    this.chatStore = useChatStore.getState();
    this.conversationStore = useConversationStore.getState();
    this.messageStore = useMessageStore.getState();
    
    // Set up listeners to refresh our local references when stores update
    useChatStore.subscribe(state => {
      this.chatStore = state;
    });
    
    useConversationStore.subscribe(state => {
      this.conversationStore = state;
    });
    
    useMessageStore.subscribe(state => {
      this.messageStore = state;
    });
    
    logger.debug('ChatBridge initialized');
  }

  // Conversation management
  async createConversation(params: { title?: string, mode?: ChatMode } = {}): Promise<string> {
    try {
      const conversationId = this.conversationStore.createConversation({
        title: params.title,
        mode: params.mode || this.chatStore.currentMode
      });
      
      if (conversationId) {
        this.conversationStore.setCurrentConversationId(conversationId);
        return conversationId;
      }
      
      throw new Error('Failed to create conversation');
    } catch (error) {
      logger.error('ChatBridge: Failed to create conversation', error);
      throw error;
    }
  }

  async switchConversation(conversationId: string): Promise<boolean> {
    try {
      this.conversationStore.setCurrentConversationId(conversationId);
      return true;
    } catch (error) {
      logger.error('ChatBridge: Failed to switch conversation', error);
      return false;
    }
  }

  async updateConversation(conversationId: string, updates: Partial<Conversation>): Promise<boolean> {
    try {
      // Convert enum types to string for database
      const dbUpdates = { ...updates };
      if (updates.mode) {
        dbUpdates.mode = EnumUtils.chatModeToString(updates.mode) as any;
      }
      
      const success = await this.conversationStore.updateConversation(conversationId, dbUpdates);
      return success;
    } catch (error) {
      logger.error('ChatBridge: Failed to update conversation', error);
      return false;
    }
  }

  async archiveConversation(conversationId: string): Promise<boolean> {
    try {
      const success = this.conversationStore.archiveConversation(conversationId);
      return success;
    } catch (error) {
      logger.error('ChatBridge: Failed to archive conversation', error);
      return false;
    }
  }

  // Message operations
  async sendMessage(content: string, options: SendMessageOptions = {}): Promise<string> {
    try {
      // Use current conversation if not specified
      const conversationId = options.conversationId || this.conversationStore.currentConversationId;
      if (!conversationId) {
        throw new Error('No active conversation');
      }
      
      const messageId = await this.messageStore.sendMessage(
        content,
        conversationId,
        options.role,
        options.type,
        options.metadata,
        options.parentMessageId
      );
      
      return messageId;
    } catch (error) {
      logger.error('ChatBridge: Failed to send message', error);
      throw error;
    }
  }

  async updateMessage(messageId: string, content: string): Promise<boolean> {
    try {
      return await this.messageStore.updateMessage(messageId, content);
    } catch (error) {
      logger.error('ChatBridge: Failed to update message', error);
      return false;
    }
  }

  async deleteMessage(messageId: string): Promise<boolean> {
    try {
      return await this.messageStore.deleteMessage(messageId);
    } catch (error) {
      logger.error('ChatBridge: Failed to delete message', error);
      return false;
    }
  }

  // Mode and provider management
  async setMode(mode: ChatMode): Promise<boolean> {
    try {
      this.chatStore.setMode(mode);
      return true;
    } catch (error) {
      logger.error('ChatBridge: Failed to set mode', error);
      return false;
    }
  }

  async setProvider(providerId: string): Promise<boolean> {
    try {
      // Find provider in available providers
      const provider = this.chatStore.providers.availableProviders.find(p => p.id === providerId);
      if (!provider) {
        throw new Error(`Provider ${providerId} not found`);
      }
      
      this.chatStore.updateChatProvider(provider);
      return true;
    } catch (error) {
      logger.error('ChatBridge: Failed to set provider', error);
      return false;
    }
  }

  // UI control
  openChat(): void {
    if (!this.chatStore.isOpen) {
      this.chatStore.toggleChat();
    }
  }

  closeChat(): void {
    if (this.chatStore.isOpen) {
      this.chatStore.toggleChat();
    }
  }

  toggleChat(): void {
    this.chatStore.toggleChat();
  }

  minimizeChat(): void {
    if (!this.chatStore.isMinimized) {
      this.chatStore.toggleMinimize();
    }
  }

  maximizeChat(): void {
    if (this.chatStore.isMinimized) {
      this.chatStore.toggleMinimize();
    }
  }

  togglePosition(): void {
    this.chatStore.togglePosition();
  }

  // Current state getters
  getCurrentConversationId(): string | null {
    return this.conversationStore.currentConversationId;
  }

  getCurrentMode(): ChatMode {
    return this.chatStore.currentMode;
  }

  getCurrentProvider(): Provider | null {
    return this.chatStore.currentProvider;
  }

  // Get the full bridge state
  getState(): ChatBridgeState {
    return {
      isOpen: this.chatStore.isOpen,
      isMinimized: this.chatStore.isMinimized,
      currentMode: this.chatStore.currentMode,
      currentProvider: this.chatStore.currentProvider,
      currentConversationId: this.conversationStore.currentConversationId,
      isMessageLoading: this.chatStore.ui.messageLoading,
      features: this.chatStore.features
    };
  }
}
