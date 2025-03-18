export type ChatButtonPosition = 'bottom-right' | 'bottom-left';

export interface ChatButtonState {
  position: ChatButtonPosition;
  scale: number;
  docked: boolean;
  features: {
    startMinimized: boolean;
    showTimestamps: boolean;
    saveHistory: boolean;
  };
  
  // Actions
  setPosition: (position: ChatButtonPosition) => void;
  togglePosition: () => void;
  setScale: (scale: number) => void;
  toggleDocked: () => void;
  toggleFeature: (feature: keyof ChatButtonState['features']) => void;
  setFeature: (feature: keyof ChatButtonState['features'], enabled: boolean) => void;
} 