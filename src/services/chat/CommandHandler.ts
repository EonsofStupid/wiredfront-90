
import { useChatStore, clearMiddlewareStorage } from '@/components/chat/store/chatStore';
import { logger } from './LoggingService';
import { toast } from 'sonner';
import { MessageManager } from '@/components/chat/messaging/MessageManager';
import { messageCache } from './MessageCacheService';

/**
 * Parse a command string to determine if it's a valid command
 * @param input The input string to check for commands
 */
export const parseCommand = (input: string): { isCommand: boolean; command: string; args: string[] } => {
  // Check if the input starts with a command prefix
  const commandPrefixes = ['/', '!', '$'];
  const prefix = commandPrefixes.find(p => input.startsWith(p));
  
  if (!prefix) {
    return { isCommand: false, command: '', args: [] };
  }
  
  // Split the input into command and arguments
  const parts = input.slice(1).split(' ');
  const command = parts[0].toLowerCase();
  const args = parts.slice(1);
  
  return { isCommand: true, command, args };
};

/**
 * Execute a chat command
 * @param command The command name
 * @param args Command arguments
 */
export const executeCommand = async (command: string, args: string[]): Promise<boolean> => {
  logger.info('Executing command', { command, args });
  
  switch (command) {
    case 'clear':
      // Clear the current chat messages
      MessageManager.clearMessages();
      toast.success('Chat cleared');
      return true;
      
    case 'reset':
      // Reset the chat state and clear storage
      clearMiddlewareStorage();
      useChatStore.getState().resetChatState();
      toast.success('Chat reset');
      return true;
    
    case 'flush':
      // More aggressive clearing of all storage
      try {
        messageCache.clearAllCache();
        MessageManager.clearMessages();
        const cleared = clearMiddlewareStorage();
        useChatStore.getState().resetChatState();
        
        if (cleared) {
          toast.success('All persistence flushed. Please refresh the page.', {
            duration: 5000,
            action: {
              label: 'Refresh',
              onClick: () => window.location.reload()
            }
          });
        } else {
          toast.error('Failed to clear all persistence');
        }
      } catch (error) {
        logger.error('Error flushing storage', { error });
        toast.error('Error flushing storage');
      }
      return true;
      
    case 'provider':
      // Set or show the current provider
      if (args.length === 0) {
        const currentProvider = useChatStore.getState().currentProvider;
        toast.info(`Current provider: ${currentProvider?.name || 'None'}`);
      } else {
        // Try to switch to the named provider
        const providerName = args[0].toLowerCase();
        const providers = useChatStore.getState().availableProviders;
        const provider = providers.find(p => p.name.toLowerCase() === providerName);
        
        if (provider) {
          useChatStore.getState().updateCurrentProvider(provider);
          toast.success(`Provider switched to ${provider.name}`);
        } else {
          toast.error(`Provider '${args[0]}' not found`);
          toast.info(`Available providers: ${providers.map(p => p.name).join(', ') || 'None'}`);
        }
      }
      return true;
      
    case 'stats':
      // Show chat statistics
      const state = useChatStore.getState();
      toast.info(`Chat Stats: ${state.messages.length} messages, Provider: ${state.currentProvider?.name || 'None'}`);
      return true;
      
    case 'help':
      // Show available commands
      toast.info('Available commands:\n/clear - Clear chat\n/reset - Reset chat\n/flush - Clear all storage\n/provider [name] - Show or set provider\n/stats - Show chat stats');
      return true;
      
    default:
      // Unknown command
      toast.error(`Unknown command: /${command}`);
      return false;
  }
};
