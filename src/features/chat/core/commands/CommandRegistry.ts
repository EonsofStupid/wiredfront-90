import { create } from 'zustand';

export type CommandHandler = (args: string) => Promise<void>;

interface CommandStore {
  commands: Map<string, CommandHandler>;
  registerCommand: (name: string, handler: CommandHandler) => () => void;
  executeCommand: (name: string, args: string) => Promise<void>;
}

export const useCommandStore = create<CommandStore>((set, get) => ({
  commands: new Map(),
  
  registerCommand: (name: string, handler: CommandHandler) => {
    set((state) => ({
      commands: new Map(state.commands).set(name, handler)
    }));
    return () => {
      set((state) => {
        const newCommands = new Map(state.commands);
        newCommands.delete(name);
        return { commands: newCommands };
      });
    };
  },
  
  executeCommand: async (name: string, args: string) => {
    const { commands } = get();
    const handler = commands.get(name);
    
    if (!handler) {
      throw new Error(`Command "${name}" not found`);
    }
    
    await handler(args);
  },
}));

// Export development mode commands
export const DEV_COMMANDS = {
  GENERATE: 'generate',
  CREATE_FILE: 'create',
  MODIFY_FILE: 'modify',
  DELETE_FILE: 'delete',
};