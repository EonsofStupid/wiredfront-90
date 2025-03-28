
import { useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ChatMode } from '@/types/chat/enums';
import { ModeConfig, ModeContextType } from './types';
import { logger } from '@/services/chat/LoggingService';
import { TaskType } from '@/types/chat/communication';

// Define available modes with their configurations
const availableModes: ModeConfig[] = [
  {
    id: ChatMode.Chat,
    displayName: 'Chat',
    description: 'Standard chat conversation',
    icon: 'MessageSquare',
    defaultProvider: 'gpt-4',
    defaultTaskType: TaskType.Conversation
  },
  {
    id: ChatMode.Dev,
    displayName: 'Developer',
    description: 'Code assistance and development help',
    icon: 'Code',
    requiredFeatures: ['codeAssistant'],
    defaultProvider: 'gpt-4',
    defaultTaskType: TaskType.CodeGeneration
  },
  {
    id: ChatMode.Image,
    displayName: 'Image',
    description: 'Generate and modify images',
    icon: 'ImageIcon',
    requiredFeatures: ['imageGeneration'],
    defaultProvider: 'dalle-3',
    defaultTaskType: TaskType.ImageGeneration
  },
  {
    id: ChatMode.Training,
    displayName: 'Training',
    description: 'Learn coding and concepts',
    icon: 'GraduationCap',
    requiredFeatures: ['training'],
    defaultProvider: 'gpt-4',
    defaultTaskType: TaskType.Tutoring
  }
];

// Define task types available for each mode
const modeTaskTypes: Record<ChatMode, TaskType[]> = {
  [ChatMode.Chat]: [
    TaskType.Conversation,
    TaskType.DocumentSearch
  ],
  [ChatMode.Dev]: [
    TaskType.CodeGeneration,
    TaskType.CodeExplanation,
    TaskType.BugFix,
    TaskType.CodeReview,
    TaskType.Refactoring,
    TaskType.ProjectContext
  ],
  [ChatMode.Image]: [
    TaskType.ImageGeneration,
    TaskType.ImageEditing
  ],
  [ChatMode.Training]: [
    TaskType.Tutoring,
    TaskType.ProblemSolving,
    TaskType.Explanation
  ],
  [ChatMode.Editor]: [
    TaskType.CodeGeneration,
    TaskType.CodeExplanation,
    TaskType.BugFix,
    TaskType.CodeReview,
    TaskType.Refactoring,
    TaskType.ProjectContext
  ]
};

/**
 * Hook to manage mode selection and switching
 */
export function useModeManager(): ModeContextType {
  const location = useLocation();
  const [currentMode, setCurrentMode] = useState<ChatMode>(ChatMode.Chat);
  const [currentTaskType, setCurrentTaskType] = useState<TaskType>(TaskType.Conversation);
  const [isModeSwitchEnabled, setIsModeSwitchEnabled] = useState<boolean>(true);
  const [availableTaskTypes, setAvailableTaskTypes] = useState<TaskType[]>([]);
  
  // Synchronize mode with current route
  useEffect(() => {
    const path = location.pathname;
    
    // Map routes to modes
    if (path.includes('/editor')) {
      handleModeChange(ChatMode.Dev);
    } else if (path.includes('/training')) {
      handleModeChange(ChatMode.Training);
    } else if (path.includes('/gallery')) {
      handleModeChange(ChatMode.Image);
    } else {
      // Default to Chat mode for other routes
      handleModeChange(ChatMode.Chat);
    }
  }, [location.pathname]);
  
  // Function to set the current mode and update available task types
  const handleModeChange = useCallback((mode: ChatMode) => {
    logger.info('Mode changed', { prevMode: currentMode, newMode: mode });
    setCurrentMode(mode);
    
    // Update available task types for this mode
    const taskTypes = modeTaskTypes[mode] || [TaskType.Conversation];
    setAvailableTaskTypes(taskTypes);
    
    // Set default task type for this mode
    const modeConfig = availableModes.find(m => m.id === mode);
    if (modeConfig?.defaultTaskType) {
      setCurrentTaskType(modeConfig.defaultTaskType);
    } else {
      setCurrentTaskType(taskTypes[0]);
    }
  }, [currentMode]);
  
  // Function to set the task type
  const setTaskType = useCallback((taskType: TaskType) => {
    if (availableTaskTypes.includes(taskType)) {
      setCurrentTaskType(taskType);
      logger.info('Task type changed', { 
        mode: currentMode, 
        prevTaskType: currentTaskType, 
        newTaskType: taskType 
      });
      return true;
    }
    
    logger.warn('Attempted to set unavailable task type', { 
      mode: currentMode,
      attemptedTaskType: taskType,
      availableTaskTypes
    });
    return false;
  }, [currentMode, currentTaskType, availableTaskTypes]);
  
  // Function to set the mode with validation and side effects
  const setMode = useCallback(async (mode: ChatMode): Promise<boolean> => {
    try {
      // Check if the mode is available
      const modeConfig = availableModes.find(m => m.id === mode);
      if (!modeConfig) {
        logger.warn('Attempting to switch to unavailable mode', { mode });
        return false;
      }
      
      // Set the mode
      handleModeChange(mode);
      
      // Log the mode change
      logger.info('Mode switched successfully', { mode });
      
      return true;
    } catch (error) {
      logger.error('Failed to set mode', { error, requestedMode: mode });
      return false;
    }
  }, [handleModeChange]);
  
  return {
    currentMode,
    currentTaskType,
    setMode,
    setTaskType,
    availableModes,
    availableTaskTypes,
    isModeSwitchEnabled
  };
}
