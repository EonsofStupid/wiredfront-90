import { create } from 'zustand';

interface LogEntry {
  timestamp: Date;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  metadata?: Record<string, any>;
}

interface LoggingState {
  logs: LogEntry[];
  maxLogs: number;
  addLog: (entry: Omit<LogEntry, 'timestamp'>) => void;
  clearLogs: () => void;
  setMaxLogs: (max: number) => void;
}

export const useLoggingStore = create<LoggingState>((set) => ({
  logs: [],
  maxLogs: 1000,
  
  addLog: (entry) => set((state) => {
    const newLog = {
      ...entry,
      timestamp: new Date(),
    };
    
    const logs = [newLog, ...state.logs].slice(0, state.maxLogs);
    return { logs };
  }),
  
  clearLogs: () => set({ logs: [] }),
  setMaxLogs: (maxLogs) => set({ maxLogs }),
}));

export const logger = {
  info: (message: string, metadata?: Record<string, any>) => {
    useLoggingStore.getState().addLog({ level: 'info', message, metadata });
  },
  warn: (message: string, metadata?: Record<string, any>) => {
    useLoggingStore.getState().addLog({ level: 'warn', message, metadata });
  },
  error: (message: string, metadata?: Record<string, any>) => {
    useLoggingStore.getState().addLog({ level: 'error', message, metadata });
  },
  debug: (message: string, metadata?: Record<string, any>) => {
    useLoggingStore.getState().addLog({ level: 'debug', message, metadata });
  },
};