import { useState, useCallback } from 'react';
import { useChatStore } from '@/components/chat/store';
import { ChatMode } from '@/types/chat';
import { toast } from 'sonner';
import { useChatCore } from '@/hooks/useChatCore';
import { logger } from '@/services/chat/LoggingService';

export function useModeSwitch() {
  const [isChangingMode, setIsChangingMode] = useState(false);
  const { currentMode, setCurrentMode } = useChatStore();
  const { switchMode, providers, getProvidersByCategory } = useChatCore();
  
  const availableModes: ChatMode[] = ['chat', 'dev', 'image', 'training'];
  
  const getModeLabel = useCallback((mode: ChatMode): string => {
    switch (mode) {
      case 'chat': return 'Chat';
      case 'dev': return 'Developer';
      case 'image': return 'Image Generation';
      case 'training': return 'Training';
      default: return mode;
    }
  }, []);
  
  const getModeDescription = useCallback((mode: ChatMode): string => {
    switch (mode) {
      case 'chat':
        return 'General purpose chat assistant to help with questions and tasks';
      case 'dev':
        return 'Specialized assistant for programming and development tasks';
      case 'image':
        return 'Generate images based on your descriptions';
      case 'training':
        return 'Learning assistant that helps you practice and improve skills';
      default:
        return 'AI assistant mode';
    }
  }, []);
  
  const getModeIcon = useCallback((mode: ChatMode): string => {
    switch (mode) {
      case 'chat': return 'MessageSquare';
      case 'dev': return 'Code';
      case 'image': return 'Image';
      case 'training': return 'GraduationCap';
      default: return 'Bot';
    }
  }, []);
  
  const getProvidersForMode = useCallback((mode: ChatMode) => {
    const category = mode === 'image' ? 'image' : 'chat';
    return getProvidersByCategory(category);
  }, [getProvidersByCategory]);
  
  const changeMode = useCallback(async (
    mode: ChatMode, 
    providerId?: string
  ): Promise<boolean> => {
    if (isChangingMode) return false;
    
    try {
      setIsChangingMode(true);
      
      if (mode === currentMode) {
        logger.info(`Already in ${mode} mode`);
        return true;
      }
      
      logger.info(`Changing mode from ${currentMode} to ${mode}`, { providerId });
      
      // Use the switchMode function from useChatCore
      const success = await switchMode(mode);
      
      if (success) {
        toast.success(`Switched to ${getModeLabel(mode)} mode`, {
          description: getModeDescription(mode),
        });
        return true;
      } else {
        toast.error(`Failed to switch to ${getModeLabel(mode)} mode`);
        return false;
      }
    } catch (error) {
      logger.error(`Error changing to ${mode} mode:`, error);
      toast.error(`Error switching mode: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    } finally {
      setIsChangingMode(false);
    }
  }, [
    isChangingMode, 
    currentMode, 
    switchMode, 
    getModeLabel, 
    getModeDescription
  ]);
  
  return {
    currentMode,
    isChangingMode,
    availableModes,
    changeMode,
    getModeLabel,
    getModeDescription,
    getModeIcon,
    getProvidersForMode
  };
}

export default useModeSwitch;
