import { toast } from 'sonner';
import { parseCommand, getCommandHelp } from '@/utils/chat/commandParser';

export const useChatCommands = (onSwitchAPI?: (provider: string) => void) => {
  const handleCommand = (command: string) => {
    const parsed = parseCommand(command);
    if (!parsed) return false;

    switch (parsed.type) {
      case 'switch-api':
        if (parsed.args.length > 0 && onSwitchAPI) {
          onSwitchAPI(parsed.args[0]);
          toast.success(`Switched to ${parsed.args[0]} API`);
        } else {
          toast.error("Please specify an API provider");
        }
        return true;
      case 'help':
        toast.info(getCommandHelp());
        return true;
      case 'clear':
        toast.success("Chat input cleared");
        return true;
      case 'unknown':
        toast.error("Unknown command. Type /help for available commands");
        return true;
    }
  };

  return { handleCommand };
};