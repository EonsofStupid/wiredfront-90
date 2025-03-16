
import React, { useRef, useState, useEffect } from 'react';
import { useChatStore } from '../store/chatStore';
import { useChatMode } from '../providers/ChatModeProvider';
import { ChatHeader } from './ChatHeader';
import ChatContent from './ChatContent';
import '../styles/index.css';

interface DraggableChatContainerProps {
  children?: React.ReactNode;
  scrollRef?: React.RefObject<HTMLDivElement>;
  isEditorPage?: boolean;
}

const DraggableChatContainer: React.FC<DraggableChatContainerProps> = ({ 
  children,
  scrollRef,
  isEditorPage = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const { 
    isMinimized, 
    toggleMinimize, 
    showSidebar,
    toggleSidebar,
    docked,
    isOpen,
    toggleChat
  } = useChatStore();
  
  const { mode } = useChatMode();

  // Set initial position based on screen dimensions
  useEffect(() => {
    if (containerRef.current && typeof window !== 'undefined') {
      const rect = containerRef.current.getBoundingClientRect();
      setPosition({
        x: window.innerWidth - rect.width - 20,
        y: window.innerHeight - rect.height - 20
      });
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (docked) return;
    
    setIsDragging(true);
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || docked) return;
    
    setPosition({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add and remove event listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  if (!isOpen) return null;

  // Determine position styles based on docked state
  const containerStyle = docked
    ? { bottom: '20px', right: '20px', position: 'fixed' as const } 
    : { left: `${position.x}px`, top: `${position.y}px`, position: 'fixed' as const };

  // Dynamic classes based on state
  const chatContainerClasses = `
    chat-container 
    chat-component
    chat-glass-card
    chat-cyber-border
    ${isMinimized ? 'chat-minimized' : 'chat-expanded'} 
    ${docked ? 'chat-docked' : 'chat-floating'}
    ${(mode === 'dev' && isEditorPage) ? 'chat-editor-mode' : ''}
    ${mode === 'chat-only' ? 'chat-only-mode' : ''}
    ${isDragging ? 'chat-dragging' : ''}
  `;

  return (
    <div 
      ref={containerRef}
      className={chatContainerClasses}
      style={containerStyle}
      data-mode={mode}
      data-minimized={isMinimized}
      data-docked={docked}
    >
      {/* Chat header with all controls */}
      <ChatHeader
        title={mode === 'dev' ? 'Developer Assistant' : 'Chat Assistant'}
        showSidebar={showSidebar}
        isMinimized={isMinimized}
        onToggleSidebar={toggleSidebar}
        onMinimize={toggleMinimize}
        onClose={toggleChat}
      />
      
      {/* Chat content area */}
      {!isMinimized && (
        <div className="chat-content-wrapper chat-messages-container" ref={scrollRef}>
          {children || <ChatContent />}
        </div>
      )}
    </div>
  );
};

export default DraggableChatContainer;
