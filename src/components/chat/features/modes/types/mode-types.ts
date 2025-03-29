
import { ChatMode } from '@/components/chat/types/chat/enums';

export interface ModeConfig {
  id: ChatMode;
  displayName: string;
  description: string;
  icon: string;
  requiredFeatures?: string[];
  defaultProvider?: string;
}

export interface ModeContextType {
  currentMode: string;
  setMode: (mode: string) => void;
  availableModes: ModeConfig[];
  isEditorPage: boolean;
}
