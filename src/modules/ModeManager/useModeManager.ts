
import { useState, useCallback, useMemo } from 'react';
import { ChatMode } from '@/components/chat/types/chat/enums';
import { EnumUtils } from '@/lib/enums/EnumUtils';
import { useChatStore } from '@/components/chat/store/chatStore';
import { useNavigate } from 'react-router-dom';
import { TaskType } from '@/components/chat/types/chat/communication';

/**
 * Hook for managing chat modes and mode switching
 */
export function useModeManager() {
  const navigate = useNavigate();
  const { currentMode, setMode } = useChatStore();
  const [previousMode, setPreviousMode] = useState<ChatMode>(currentMode);
  
  /**
   * Switch to a different chat mode
   */
  const switchMode = useCallback(
    (mode: ChatMode) => {
      // Store the current mode as the previous mode
      setPreviousMode(currentMode);
      
      // Set the new mode in the store
      setMode(mode);
      
      // Navigate to the correct route based on mode
      switch (mode) {
        case ChatMode.Dev:
        case ChatMode.Editor:
          navigate('/editor');
          break;
        case ChatMode.Image:
          navigate('/gallery');
          break;
        case ChatMode.Training:
          navigate('/training');
          break;
        case ChatMode.Document:
          navigate('/documents');
          break;
        default:
          navigate('/');
          break;
      }
      
      return true;
    },
    [currentMode, navigate, setMode]
  );
  
  /**
   * Switch back to the previous mode
   */
  const switchToPreviousMode = useCallback(() => {
    return switchMode(previousMode);
  }, [previousMode, switchMode]);
  
  /**
   * Task types supported by each mode
   */
  const modeTaskTypes = useMemo(() => {
    const taskTypesByMode = {
      [ChatMode.Chat]: [
        TaskType.Chat,
        TaskType.Conversation,
        TaskType.QuestionAnswering
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
      ],
      [ChatMode.Document]: [
        TaskType.DocumentSearch,
        TaskType.Analysis,
        TaskType.Extraction
      ],
      [ChatMode.Planning]: [
        TaskType.Analysis,
        TaskType.Planning,
        TaskType.StructuredOutput
      ],
      [ChatMode.Code]: [
        TaskType.CodeGeneration,
        TaskType.Analysis,
        TaskType.StructuredOutput
      ],
      [ChatMode.Audio]: [
        TaskType.Chat,
        TaskType.Conversation,
        TaskType.QuestionAnswering
      ]
    };
    
    return taskTypesByMode;
  }, []);
  
  /**
   * Get a user-friendly name for the current mode
   */
  const currentModeName = useMemo(() => {
    return EnumUtils.getChatModeLabel(currentMode);
  }, [currentMode]);
  
  return {
    currentMode,
    currentModeName,
    previousMode,
    switchMode,
    switchToPreviousMode,
    modeTaskTypes
  };
}
