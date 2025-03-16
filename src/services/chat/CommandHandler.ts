
import { supabase } from '@/integrations/supabase/client';
import { logger } from './LoggingService';
import { useMessageStore, clearMessages } from '@/components/chat/messaging/MessageManager';
import { useChatStore } from '@/components/chat/store/chatStore';

class CommandHandlerClass {
  // List of commands with handlers
  private commands = {
    help: this.handleHelpCommand,
    clear: this.handleClearCommand,
    reset: this.handleResetCommand,
    tokens: this.handleTokensCommand,
    mode: this.handleModeCommand,
    provider: this.handleProviderCommand,
  };

  // Parse input to check if it's a command
  parseCommand(input: string): { isCommand: boolean; command: string; args: string[] } {
    // Start with assumption it's not a command
    const result = { isCommand: false, command: '', args: [] as string[] };
    
    // Check if input starts with a slash
    if (!input.startsWith('/')) return result;
    
    // Extract command and arguments
    const parts = input.slice(1).split(' ').filter(Boolean);
    const command = parts[0].toLowerCase();
    
    // Check if it's a recognized command
    if (command in this.commands) {
      result.isCommand = true;
      result.command = command;
      result.args = parts.slice(1);
    }
    
    return result;
  }

  // Handle command execution
  async executeCommand(command: string, args: string[]): Promise<string> {
    logger.info(`Executing command: /${command}`, { args });
    
    try {
      // Check if the command exists
      if (command in this.commands) {
        // Execute the command handler
        return await this.commands[command as keyof typeof this.commands].call(this, args);
      }
      
      return `Unknown command: /${command}. Type /help for available commands.`;
    } catch (error) {
      logger.error(`Error executing command /${command}:`, error);
      return `Error executing command: /${command}`;
    }
  }

  // Handle /help command
  private async handleHelpCommand(args: string[]): Promise<string> {
    return `
**Available Commands:**
- **/help** - Show this help message
- **/clear** - Clear the current chat session
- **/reset** - Reset the chat and clear all sessions
- **/tokens** - Show your token balance
- **/mode [chat|dev|image]** - Change chat mode
- **/provider [provider-id]** - Change AI provider
    `;
  }

  // Handle /clear command
  private async handleClearCommand(args: string[]): Promise<string> {
    // Clear messages from the store
    clearMessages();
    
    return "Messages cleared from the current chat session.";
  }

  // Handle /reset command
  private async handleResetCommand(args: string[]): Promise<string> {
    // Get the chat store functions
    const chatStore = useChatStore.getState();
    
    // Reset state in the chat store
    chatStore.resetChatState();
    
    // Clear messages
    clearMessages();
    
    return "Chat state has been reset. Starting fresh!";
  }

  // Handle /tokens command
  private async handleTokensCommand(args: string[]): Promise<string> {
    const { tokenControl } = useChatStore.getState();
    
    return `
**Token Information:**
- Current Balance: ${tokenControl.balance}
- Queries Used: ${tokenControl.queriesUsed}
- Free Query Limit: ${tokenControl.freeQueryLimit}
- Enforcement Mode: ${tokenControl.enforcementMode}
    `;
  }

  // Handle /mode command
  private async handleModeCommand(args: string[]): Promise<string> {
    const { setCurrentMode } = useChatStore.getState();
    
    if (args.length === 0) {
      return "Please specify a mode: /mode [chat|dev|image]";
    }
    
    const mode = args[0].toLowerCase();
    
    if (mode === 'chat' || mode === 'dev' || mode === 'image') {
      setCurrentMode(mode);
      return `Mode changed to: ${mode}`;
    }
    
    return `Invalid mode: ${mode}. Available modes: chat, dev, image`;
  }

  // Handle /provider command
  private async handleProviderCommand(args: string[]): Promise<string> {
    const { availableProviders, updateCurrentProvider } = useChatStore.getState();
    
    if (args.length === 0) {
      // List available providers
      const providerList = availableProviders.map(p => 
        `- ${p.name} (${p.id})${p.isDefault ? ' (default)' : ''}`
      ).join('\n');
      
      return `
**Available Providers:**
${providerList || 'No providers available'}

To change provider: /provider [provider-id]
      `;
    }
    
    const providerId = args[0];
    const provider = availableProviders.find(p => p.id === providerId);
    
    if (!provider) {
      return `Provider not found: ${providerId}`;
    }
    
    updateCurrentProvider(provider);
    return `Provider changed to: ${provider.name}`;
  }
}

// Export a singleton instance
export const CommandHandler = new CommandHandlerClass();
