
import { ChatMode } from '@/components/chat/types/chat/enums';
import { TaskType } from '@/components/chat/types/chat/communication';

// Re-export the TaskType
export type TaskType = TaskType;

/**
 * Mode configuration interface
 */
export interface ModeConfig {
  id: ChatMode;
  displayName: string;
  description: string;
  icon: string;
  requiredFeatures?: string[];
  defaultProvider?: string;
}

/**
 * Mode context interface
 */
export interface ModeContextType {
  currentMode: ChatMode;
  setMode: (mode: ChatMode | string) => void;
  availableModes: ModeConfig[];
  isEditorPage: boolean;
}

/**
 * Mode manager state interface
 */
export interface ModeState {
  currentMode: ChatMode;
  availableModes: ModeConfig[];
  isEditorPage: boolean;
}
