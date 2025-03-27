
import { ChatMode } from '@/types/chat/enums';

export interface ModeConfig {
  id: ChatMode;
  displayName: string;
  description: string;
  icon: string;
  requiredFeatures?: string[];
  defaultProvider?: string;
}

export interface ModeContextType {
  currentMode: ChatMode;
  setMode: (mode: ChatMode) => void;
  availableModes: ModeConfig[];
  isEditorPage: boolean;
}
