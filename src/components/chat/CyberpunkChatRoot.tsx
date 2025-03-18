
import React, { useState, useEffect } from 'react';
import { DndContext } from '@dnd-kit/core';
import CyberpunkChat from './core/CyberpunkChat';
import CyberpunkChatButton from './core/CyberpunkChatButton';
import { useLocation } from 'react-router-dom';
import { useChatStore } from './store/chatStore';
import { useChatUIStore } from '@/stores/chat-ui';
import './styles/cyberpunk/index.css';

export const CyberpunkChatRoot: React.FC = () => {
  const location = useLocation();
  const isEditorPage = location.pathname === '/editor';
  const { isOpen, toggleChat } = useChatStore();
  const { setDockPosition } = useChatUIStore();
  
  // Set up dock position based on current page
  useEffect(() => {
    if (isEditorPage) {
      setDockPosition('right');
    }
  }, [isEditorPage, setDockPosition]);
  
  if (!isOpen) {
    return <CyberpunkChatButton onClick={toggleChat} />;
  }

  return (
    <DndContext>
      <CyberpunkChat className={isEditorPage ? 'chat-editor-mode' : ''} />
    </DndContext>
  );
};

export default CyberpunkChatRoot;
