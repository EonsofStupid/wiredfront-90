
export type ChatButtonPosition = 'bottom-right' | 'bottom-left';

export interface ChatButtonFeatures {
  startMinimized: boolean;
  showTimestamps: boolean;
  saveHistory: boolean;
}

export interface ChatButtonState {
  position: ChatButtonPosition;
  scale: number;
  docked: boolean;
  features: ChatButtonFeatures;
  
  // Actions
  setPosition: (position: ChatButtonPosition) => void;
  togglePosition: () => void;
  setScale: (scale: number) => void;
  toggleDocked: () => void;
  toggleFeature: (feature: keyof ChatButtonFeatures) => void;
  setFeature: (feature: keyof ChatButtonFeatures, enabled: boolean) => void;
}
