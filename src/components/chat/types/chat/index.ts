
// Re-export all types from the chat subdirectory
export * from './enums';
export * from './message';
export * from './conversation';
export * from './bridge';
export * from './token';

// Re-export additional types and utilities
export type UiChatMode = 'standard' | 'editor' | 'image' | 'training' | 'planning' | 'code' | 'document' | 'audio';

// Map between UI and database chat modes
export const UiModeToChatMode: Record<UiChatMode, string> = {
  'standard': 'chat',
  'editor': 'dev',
  'image': 'image',
  'training': 'training',
  'planning': 'planning',
  'code': 'code',
  'document': 'document',
  'audio': 'audio'
};

export const ChatModeToUiMode: Record<string, UiChatMode> = {
  'chat': 'standard',
  'dev': 'editor',
  'editor': 'editor',
  'image': 'image',
  'training': 'training',
  'planning': 'planning',
  'code': 'code',
  'document': 'document',
  'audio': 'audio'
};
