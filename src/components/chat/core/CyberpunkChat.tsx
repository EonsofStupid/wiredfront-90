
import React, { useEffect, useRef } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { useChatUIStore } from '@/stores/chat-ui';
import { useChatStore } from '@/components/chat/store/chatStore';
import CyberpunkChatHeader from './CyberpunkChatHeader';
import CyberpunkChatMessages from './CyberpunkChatMessages';
import CyberpunkChatInput from './CyberpunkChatInput';
import CyberpunkActionStack from '../ui/CyberpunkActionStack';
import CyberpunkDockPanel from '../ui/CyberpunkDockPanel';
import CyberpunkCommandBar from '../features/commands/CyberpunkCommandBar';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import '../styles/cyberpunk/index.css';

export interface CyberpunkChatProps {
  className?: string;
}

const CyberpunkChat: React.FC<CyberpunkChatProps> = ({ className = '' }) => {
  const {
    isDocked,
    isMinimized,
    position,
    scale,
    dockState,
    showCommandBar,
    isGlassEffect
  } = useChatUIStore();
  
  const { 
    toggleDock, 
    toggleMinimize, 
    setPosition,
    toggleDockVisibility, 
    toggleCommandBar 
  } = useChatUIStore();
  
  const { messages, addMessage } = useChatStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Set up keyboard shortcuts
  useKeyboardShortcuts();

  // DnD setup for dragging
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: 'cyberpunk-chat',
    disabled: isDocked
  });

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current && !isMinimized) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isMinimized]);

  // Calculate position or transform styles
  const positionStyle = (() => {
    if (isDocked) {
      return typeof position === 'string' 
        ? { right: position === 'bottom-right' ? '20px' : 'auto', left: position === 'bottom-left' ? '20px' : 'auto' }
        : {};
    } 
    return transform 
      ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${scale})` }
      : typeof position !== 'string' 
        ? { left: `${position.x}px`, top: `${position.y}px`, transform: `scale(${scale})` }
        : {};
  })();

  // Determine core CSS classes
  const containerClasses = [
    'chat-cyberpunk-container',
    isGlassEffect ? 'chat-glass-effect' : '',
    isDocked ? 'chat-docked' : 'chat-floating',
    isMinimized ? 'chat-minimized' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="chat-cyberpunk-wrapper">
      <div
        ref={setNodeRef}
        style={positionStyle}
        className={containerClasses}
        {...(!isDocked ? { ...listeners, ...attributes } : {})}
      >
        <CyberpunkChatHeader
          isMinimized={isMinimized}
          onToggleMinimize={toggleMinimize}
          onToggleDock={toggleDock}
          onToggleDockPanel={toggleDockVisibility}
        />
        
        {!isMinimized && (
          <>
            <CyberpunkChatMessages 
              messages={messages} 
              scrollRef={scrollRef} 
            />
            <CyberpunkChatInput 
              onSendMessage={(content) => addMessage({ id: Date.now().toString(), content, role: 'user' })} 
              onToggleCommandBar={toggleCommandBar} 
            />
          </>
        )}
        
        {!isMinimized && <CyberpunkActionStack />}
        
        {showCommandBar && !isMinimized && (
          <CyberpunkCommandBar onClose={toggleCommandBar} />
        )}
      </div>
      
      {dockState.visible && !isMinimized && (
        <CyberpunkDockPanel 
          position={dockState.position}
          items={dockState.items}
          activeItem={dockState.activeItem}
        />
      )}
    </div>
  );
};

export default CyberpunkChat;
