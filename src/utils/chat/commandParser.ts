type CommandType = 'switch-api' | 'help' | 'clear' | 'unknown';

interface ParsedCommand {
  type: CommandType;
  args: string[];
}

export const parseCommand = (message: string): ParsedCommand | null => {
  if (!message.startsWith('/')) return null;

  const parts = message.slice(1).split(' ');
  const command = parts[0].toLowerCase();
  const args = parts.slice(1);

  switch (command) {
    case 'api':
    case 'switch':
      return { type: 'switch-api', args };
    case 'help':
      return { type: 'help', args };
    case 'clear':
      return { type: 'clear', args };
    default:
      return { type: 'unknown', args };
  }
};

export const getCommandHelp = (): string => {
  return `Available commands:
/api <provider> - Switch to a specific API provider
/help - Show this help message
/clear - Clear chat history`;
};