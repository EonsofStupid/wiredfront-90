
/**
 * use{{FeatureName}}TrackedAtoms Template
 * 
 * This template is used to scaffold a new hook for accessing tracked atoms
 * related to the {{FeatureName}} feature.
 */

import { useAtom } from 'jotai';
import { 
  trackedIsVisibleAtom,
  trackedMessagesAtom,
  trackedInputValueAtom
} from '../atoms/tracked-atoms';
import type { ChatMessage } from '@/components/chat/types';

export function use{{FeatureName}}TrackedAtoms() {
  // UI state
  const [isVisible, setIsVisible] = useAtom(trackedIsVisibleAtom);
  
  // Messages state
  const [messages, setMessages] = useAtom(trackedMessagesAtom);
  
  // Input state
  const [inputValue, setInputValue] = useAtom(trackedInputValueAtom);
  
  // Helper function to add a message
  const addMessage = (message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
  };
  
  // Helper function to clear messages
  const clearMessages = () => {
    setMessages([]);
  };
  
  return {
    // UI state
    isVisible,
    setIsVisible,
    
    // Messages state
    messages,
    setMessages,
    addMessage,
    clearMessages,
    
    // Input state
    inputValue,
    setInputValue
  };
}
