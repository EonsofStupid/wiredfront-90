import { parseCommand, getCommandHelp } from "@/utils/chat/commandParser";
import { toast } from "sonner";

export const useCommandHandler = (
  onSwitchAPI?: (provider: string) => void,
  setMessage?: (message: string) => void,
  setAttachments?: (attachments: File[]) => void
) => {
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
        setMessage?.("");
        setAttachments?.([]);
        toast.success("Chat input cleared");
        return true;
      case 'unknown':
        toast.error("Unknown command. Type /help for available commands");
        return true;
    }
  };

  return { handleCommand };
};