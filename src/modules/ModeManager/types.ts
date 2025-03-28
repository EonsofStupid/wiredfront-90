
import { ChatMode } from '@/types/chat/enums';
import { TaskType } from '@/types/chat/communication';

/**
 * Configuration for a specific chat mode
 */
export interface ModeConfig {
  id: ChatMode;
  displayName: string;
  description: string;
  icon: string;
  requiredFeatures?: string[];
  defaultProvider?: string;
  defaultTaskType?: TaskType;
}

/**
 * Context for the mode manager
 */
export interface ModeContextType {
  currentMode: ChatMode;
  currentTaskType: TaskType;
  setMode: (mode: ChatMode) => Promise<boolean>;
  setTaskType: (taskType: TaskType) => boolean;
  availableModes: ModeConfig[];
  availableTaskTypes: TaskType[];
  isModeSwitchEnabled: boolean;
}
