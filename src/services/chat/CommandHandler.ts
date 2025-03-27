import { useChatStore } from '@/components/chat/store';
import { useMessageStore } from '@/components/chat/store/message';
import { v4 as uuidv4 } from 'uuid';

// Command Parser
export const parseCommand = (input: string) => {
  const parts = input.trim().split(/\s+/);
  const isCommand = parts[0].startsWith('/');
  const command = isCommand ? parts[0].substring(1) : '';
  const args = isCommand ? parts.slice(1) : [];

  return { isCommand, command, args };
};

// Command Execution
export const executeCommand = async (command: string, args: string[]) => {
  switch (command) {
    case 'clear':
      return clearChatCommand();
    case 'mode':
      return setModeCommand(args);
    case 'help':
      return helpCommand();
    default:
      return unknownCommand(command);
  }
};

// /clear command
const clearChatCommand = () => {
  const { clearMessages } = useMessageStore.getState();
  clearMessages();
  return Promise.resolve();
};

// /mode command
const setModeCommand = (args: string[]) => {
  const { setMode } = useChatStore.getState();
  const mode = args[0] as 'chat' | 'code' | 'image';

  if (mode && ['chat', 'code', 'image'].includes(mode)) {
    setMode(mode);
  } else {
    // Handle invalid mode
    const messageStore = useMessageStore.getState();
    messageStore.addMessage({
      id: uuidv4(),
      content: 'Invalid mode. Use /mode [chat|code|image]',
      role: 'system',
      type: 'notification'
    });
  }
  return Promise.resolve();
};

// /help command
const helpCommand = () => {
  const messageStore = useMessageStore.getState();
    messageStore.addMessage({
      id: uuidv4(),
      content: 'Available commands: /clear, /mode [chat|code|image]',
      role: 'system',
      type: 'notification'
    });
  return Promise.resolve();
};

// Unknown command
const unknownCommand = (command: string) => {
  const messageStore = useMessageStore.getState();
    messageStore.addMessage({
      id: uuidv4(),
      content: `Unknown command: /${command}`,
      role: 'system',
      type: 'notification'
    });
  return Promise.resolve();
};

// Example of a function that returns void
async function doSomethingThatReturnsVoid(): Promise<void> {
  // Simulate an asynchronous operation
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      // Simulate success or failure
      if (Math.random() > 0.5) {
        console.log("Async operation succeeded");
        resolve();
      } else {
        console.error("Async operation failed");
        reject(new Error("Async operation failed"));
      }
    }, 500);
  });
}

// Example usage with proper error handling
// Replace the problematic line (line 58) with proper error handling
// Change from:
// if (await doSomethingThatReturnsVoid()) {
// To:
try {
  await doSomethingThatReturnsVoid();
  // Continue with success path
} catch (error) {
  // Handle error path
  console.error("Command execution failed:", error);
}
