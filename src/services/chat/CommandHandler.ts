
import { toast } from "sonner";
import { logger } from "./LoggingService";
import { useSessionManager } from "@/hooks/useSessionManager";
import { supabase } from "@/integrations/supabase/client";
import { useChatStore } from "@/components/chat/store/chatStore";

// Define command types
type CommandHandler = (args: string[]) => Promise<string>;

interface Command {
  name: string;
  description: string;
  usage: string;
  handler: CommandHandler;
  isAdmin?: boolean;
}

// Collection of available commands
const commands: Record<string, Command> = {
  help: {
    name: "help",
    description: "Display available commands",
    usage: "/help [command]",
    handler: async (args) => {
      if (args.length > 0) {
        const cmdName = args[0].toLowerCase();
        const cmd = commands[cmdName];
        if (cmd) {
          return `**Command:** \`${cmd.name}\`\n**Description:** ${cmd.description}\n**Usage:** ${cmd.usage}`;
        } else {
          return `Command \`${cmdName}\` not found. Type \`/help\` to see all available commands.`;
        }
      }
      
      const cmdList = Object.values(commands)
        .filter(cmd => !cmd.isAdmin)
        .map(cmd => `\`${cmd.name}\`: ${cmd.description}`)
        .join('\n');
      
      return `**Available Commands**\n\n${cmdList}\n\nType \`/help [command]\` for more details on a specific command.`;
    }
  },
  
  clear: {
    name: "clear",
    description: "Clear the current chat conversation",
    usage: "/clear",
    handler: async () => {
      try {
        const { clearMessages } = await import("@/components/chat/messaging/MessageManager");
        clearMessages();
        return "Chat cleared";
      } catch (error) {
        logger.error("Error in clear command", error);
        return "Failed to clear chat";
      }
    }
  },
  
  stats: {
    name: "stats",
    description: "Show statistics about your usage",
    usage: "/stats",
    handler: async () => {
      try {
        const { data: userStats, error } = await supabase
          .from('user_tokens')
          .select('*')
          .single();
          
        if (error) throw error;
        
        if (!userStats) {
          return "No usage statistics available yet";
        }
        
        return `**Your Usage Statistics**\n\n` +
          `**Current Balance:** ${userStats.balance} tokens\n` +
          `**Total Earned:** ${userStats.total_earned} tokens\n` +
          `**Total Spent:** ${userStats.total_spent} tokens\n` +
          `**Tier:** ${userStats.tier}\n` +
          `**Last Reset:** ${userStats.last_reset ? new Date(userStats.last_reset).toLocaleString() : 'Never'}`;
      } catch (error) {
        logger.error("Error fetching stats", error);
        return "Failed to retrieve statistics";
      }
    }
  },
  
  mode: {
    name: "mode",
    description: "Switch between different chat modes (chat, code, image)",
    usage: "/mode [chat|code|image]",
    handler: async (args) => {
      if (args.length === 0) {
        const { currentMode } = useChatStore.getState();
        return `Current mode: ${currentMode}`;
      }
      
      const mode = args[0].toLowerCase();
      const validModes = ['chat', 'code', 'image'];
      
      if (!validModes.includes(mode)) {
        return `Invalid mode. Please use one of: ${validModes.join(', ')}`;
      }
      
      try {
        const { setCurrentMode } = useChatStore.getState();
        setCurrentMode(mode as any);
        return `Switched to ${mode} mode`;
      } catch (error) {
        logger.error("Error switching modes", error);
        return "Failed to switch modes";
      }
    }
  },
  
  provider: {
    name: "provider",
    description: "List or switch AI providers",
    usage: "/provider [name]",
    handler: async (args) => {
      const { availableProviders, currentProvider, updateCurrentProvider } = useChatStore.getState();
      
      if (args.length === 0) {
        if (availableProviders.length === 0) {
          return "No AI providers are currently available";
        }
        
        const providerList = availableProviders
          .map(p => `${p.name}${p.id === currentProvider?.id ? ' (current)' : ''}`)
          .join('\n');
          
        return `**Available AI Providers**\n\n${providerList}\n\nUse \`/provider [name]\` to switch.`;
      }
      
      const providerName = args.join(' ').toLowerCase();
      const provider = availableProviders.find(
        p => p.name.toLowerCase() === providerName || p.type.toLowerCase() === providerName
      );
      
      if (!provider) {
        return `Provider "${providerName}" not found. Use \`/provider\` to see available options.`;
      }
      
      try {
        updateCurrentProvider(provider);
        return `Switched to ${provider.name} provider`;
      } catch (error) {
        logger.error("Error switching providers", error);
        return "Failed to switch providers";
      }
    }
  },
};

// Main command parser
export async function parseCommand(input: string): Promise<{ isCommand: boolean; response?: string }> {
  if (!input.startsWith('/')) {
    return { isCommand: false };
  }
  
  // Extract command and arguments
  const parts = input.slice(1).trim().split(/\s+/);
  const commandName = parts[0].toLowerCase();
  const args = parts.slice(1);
  
  // Look up the command
  const command = commands[commandName];
  
  if (!command) {
    return { 
      isCommand: true, 
      response: `Unknown command: \`/${commandName}\`. Type \`/help\` for a list of available commands.` 
    };
  }
  
  try {
    logger.info(`Executing command: /${commandName}`, { args });
    const response = await command.handler(args);
    return { isCommand: true, response };
  } catch (error) {
    logger.error(`Error executing command: /${commandName}`, error);
    return { 
      isCommand: true, 
      response: `Error executing command: ${error.message}` 
    };
  }
}

// Export the command list for other components
export function getAvailableCommands() {
  return Object.values(commands).filter(cmd => !cmd.isAdmin);
}
