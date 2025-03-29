
// Re-export all chat types from a central location
export * from './enums';
export * from './message';
export * from './conversation';
export * from './communication';
export * from './bridge';

// Define additional types needed for chat functionality
export interface ChatContextType {
  isEditorPage: boolean;
  isInitialized: boolean;
  isInitializing: boolean;
}
