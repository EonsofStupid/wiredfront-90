
import { useEffect } from 'react';
import { useChatUIStore } from '@/stores/chat-ui';
import { useChatStore } from '../store/chatStore';

export const useKeyboardShortcuts = () => {
  const { 
    keyboardShortcutsEnabled,
    toggleDockVisibility, 
    toggleCommandBar, 
    toggleMinimize, 
    toggleDock
  } = useChatUIStore();
  
  const { toggleChat } = useChatStore();

  useEffect(() => {
    if (!keyboardShortcutsEnabled) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      
      // Ctrl+M: Toggle Memory Panel
      if (e.ctrlKey && e.key === 'm') {
        e.preventDefault();
        toggleDockVisibility();
      }
      
      // Ctrl+/: Toggle Command Bar
      if (e.ctrlKey && e.key === '/') {
        e.preventDefault();
        toggleCommandBar();
      }
      
      // Ctrl+.: Toggle Chat
      if (e.ctrlKey && e.key === '.') {
        e.preventDefault();
        toggleChat();
      }
      
      // Ctrl+,: Toggle Minimize
      if (e.ctrlKey && e.key === ',') {
        e.preventDefault();
        toggleMinimize();
      }
      
      // Ctrl+P: Toggle Dock
      if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        toggleDock();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    keyboardShortcutsEnabled, 
    toggleDockVisibility, 
    toggleCommandBar, 
    toggleChat, 
    toggleMinimize, 
    toggleDock
  ]);
};
