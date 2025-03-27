
import { toast } from 'sonner';
import { logger } from './LoggingService';

interface CommandResult {
  isCommand: boolean;
  command: string;
  args: string[];
}

export function parseCommand(input: string): CommandResult {
  // Check if input starts with a slash
  if (!input.startsWith('/')) {
    return { isCommand: false, command: '', args: [] };
  }
  
  // Split by spaces to get command and arguments
  const parts = input.slice(1).split(' ');
  const command = parts[0].toLowerCase();
  const args = parts.slice(1);
  
  return { isCommand: true, command, args };
}

export async function executeCommand(command: string, args: string[]): Promise<void> {
  logger.info('Executing command', { command, args });
  
  switch (command) {
    case 'help':
      showHelp();
      break;
    case 'clear':
      // This would be implemented to clear the chat
      toast.success('Chat cleared');
      break;
    case 'mode':
      const mode = args[0]?.toLowerCase();
      if (!mode) {
        toast.error('Please specify a mode: /mode chat|code|image');
        return;
      }
      
      if (['chat', 'code', 'image'].includes(mode)) {
        toast.success(`Switched to ${mode} mode`);
      } else {
        toast.error(`Unknown mode: ${mode}. Available modes: chat, code, image`);
      }
      break;
    default:
      toast.error(`Unknown command: ${command}. Type /help for available commands.`);
  }
}

function showHelp(): void {
  const helpText = `
Available commands:
/help - Show this help
/clear - Clear the current chat
/mode [chat|code|image] - Switch chat mode
  `;
  
  // In a real app, you'd display this in a nicer way in the UI
  toast(helpText, {
    duration: 10000,
    className: "w-96 whitespace-pre-line"
  });
}
