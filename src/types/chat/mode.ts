export type ChatMode = 
  | 'chat'    
  | 'dev'     
  | 'image'   
  | 'training'
  | 'code'    
  | 'planning';

export const CHAT_MODES = {
  CHAT: 'chat',
  DEV: 'dev',
  IMAGE: 'image',
  TRAINING: 'training',
  CODE: 'code',
  PLANNING: 'planning'
} as const;

export function isChatMode(value: unknown): value is ChatMode {
  return typeof value === 'string' && Object.values(CHAT_MODES).includes(value as ChatMode);
}

export function normalizeChatMode(mode: string | null | undefined): ChatMode {
  if (!mode) return 'chat';

  const modeMap: Record<string, ChatMode> = {
    'standard': 'chat',
    'developer': 'dev'
  };

  const normalizedMode = modeMap[mode] || mode;
  return isChatMode(normalizedMode) ? normalizedMode : 'chat';
}
