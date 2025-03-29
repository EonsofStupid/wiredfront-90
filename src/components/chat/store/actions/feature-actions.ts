
import { ChatState } from '../types/chat-store-types';
import { Provider } from '../../types/provider-types';
import { createFeatureToggleActions } from './feature/toggle';
import { createProviderActions } from './feature/provider';
import { ChatMode, ChatPosition } from '@/types/chat/enums';
import { SetState, GetState } from './feature/types';

/**
 * Create feature-related actions for the chat store
 */
export const createFeatureActions = (
  set: SetState<ChatState>,
  get: GetState<ChatState>
) => {
  // Get the feature toggle actions
  const featureToggleActions = createFeatureToggleActions(set, get);
  
  // Get the provider actions
  const providerActions = createProviderActions(set, get);
  
  return {
    ...featureToggleActions,
    ...providerActions,
    
    /**
     * Set the current model
     */
    setModel: (model: string) => {
      set({ selectedModel: model }, false, { type: 'feature/setModel', model });
    },
    
    /**
     * Set the current mode
     */
    setMode: (mode: string | ChatMode) => {
      set({ currentMode: mode }, false, { type: 'feature/setMode', mode });
    },
    
    /**
     * Toggle between chat modes
     */
    toggleMode: () => {
      const currentMode = get().currentMode;
      
      // Define mode toggle sequence
      const toggleSequence = [
        ChatMode.Chat,
        ChatMode.Dev,
        ChatMode.Image,
        ChatMode.Training
      ];
      
      // Find current index or default to start
      const currentIndex = toggleSequence.findIndex(m => m === currentMode);
      const nextIndex = (currentIndex + 1) % toggleSequence.length;
      
      // Set the next mode
      set({ currentMode: toggleSequence[nextIndex] }, false, { 
        type: 'feature/toggleMode',
        previousMode: currentMode,
        newMode: toggleSequence[nextIndex]
      });
    },
    
    /**
     * Toggle between positions
     */
    togglePosition: () => {
      const currentPosition = get().position;
      const newPosition = currentPosition === ChatPosition.BottomRight 
        ? ChatPosition.BottomLeft 
        : ChatPosition.BottomRight;
      
      set({ position: newPosition }, false, { 
        type: 'feature/togglePosition',
        position: newPosition
      });
    },
    
    /**
     * Set the chat position
     */
    setPosition: (position: ChatPosition) => {
      set({ position }, false, { type: 'feature/setPosition', position });
    },
    
    /**
     * Toggle docked state
     */
    toggleDocked: () => {
      const docked = get().docked;
      set({ docked: !docked }, false, { type: 'feature/toggleDocked', docked: !docked });
    },
    
    /**
     * Set docked state
     */
    setDocked: (docked: boolean) => {
      set({ docked }, false, { type: 'feature/setDocked', docked });
    }
  };
};

export type FeatureActions = ReturnType<typeof createFeatureActions>;
