
import React, { useRef, useState, useEffect } from 'react';
import { X, Minus, Maximize, ArrowDownToLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChatStore } from '../store/chatStore';
import { useChatMode } from '../providers/ChatModeProvider';
import ChatContent from './ChatContent';
import { ChatMode } from '@/integrations/supabase/types/enums';
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
    docked,
    toggleDocked,
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
    ${isMinimized ? 'chat-minimized' : 'chat-expanded'} 
    ${docked ? 'chat-docked' : 'chat-floating'}
    ${(mode === 'dev' && isEditorPage) ? 'chat-editor-mode' : ''}
    ${mode === 'chat-only' ? 'chat-only-mode' : ''}
    ${isDragging ? 'chat-dragging' : ''}
  `;

  const headerClasses = `
    chat-header 
    flex items-center justify-between p-3
    ${isDragging ? 'cursor-grabbing' : docked ? 'cursor-default' : 'cursor-grab'}
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
      {/* Chat header/drag handle */}
      <div 
        className={headerClasses}
        onMouseDown={handleMouseDown}
      >
        <div className="chat-title font-medium text-sm">
          {mode === 'dev' ? 'Developer Assistant' : 'Chat Assistant'}
        </div>
        
        <div className="chat-controls flex items-center space-x-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="chat-control-button h-6 w-6" 
            onClick={toggleDocked}
            title={docked ? "Undock" : "Dock"}
          >
            <ArrowDownToLine className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="chat-control-button h-6 w-6" 
            onClick={toggleMinimize}
            title={isMinimized ? "Maximize" : "Minimize"}
          >
            {isMinimized ? <Maximize className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="chat-control-button h-6 w-6" 
            onClick={toggleChat}
            title="Close"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Chat content area */}
      {!isMinimized && (
        <div className="chat-content-wrapper flex-1 overflow-auto p-4" ref={scrollRef}>
          {children || <ChatContent />}
        </div>
      )}
    </div>
  );
};

export default DraggableChatContainer;
