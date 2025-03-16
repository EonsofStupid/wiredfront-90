
import React, { useRef, useState, useEffect } from 'react';
import { X, Minus, Maximize, ArrowDownToLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChatStore } from '../store/chatStore';
import { useChatMode } from '../providers/ChatModeProvider';
import ChatContent from './ChatContent';
import { ChatMode } from '@/integrations/supabase/types/enums';

interface DraggableChatContainerProps {
  children?: React.ReactNode;
}

const DraggableChatContainer: React.FC<DraggableChatContainerProps> = ({ children }) => {
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
  
  const { mode, isEditorPage } = useChatMode();

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

  // Determine position styles
  const positionStyles = docked
    ? { bottom: '20px', right: '20px' } // Docked position
    : { left: `${position.x}px`, top: `${position.y}px` }; // Free-floating position

  // Dynamic classes based on state
  const chatContainerClasses = `
    chat-container 
    ${isMinimized ? 'minimized' : 'expanded'} 
    ${docked ? 'docked' : 'floating'}
    ${(mode === 'dev' && isEditorPage) ? 'editor-mode' : mode === 'chat-only' ? 'chat-only-mode' : ''}
  `;

  return (
    <div 
      ref={containerRef}
      className={chatContainerClasses}
      style={{
        ...positionStyles,
        cursor: isDragging ? 'grabbing' : docked ? 'default' : 'grab',
        zIndex: 1000,
        position: 'fixed',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
        borderRadius: '8px',
        overflow: 'hidden',
        background: 'var(--background)',
        display: 'flex',
        flexDirection: 'column',
        width: isMinimized ? '300px' : '400px',
        height: isMinimized ? '50px' : '600px',
        resize: 'both',
        transition: 'width 0.2s, height 0.2s',
      }}
    >
      {/* Chat header/drag handle */}
      <div 
        className="chat-header flex items-center justify-between p-3 bg-background border-b"
        onMouseDown={handleMouseDown}
      >
        <div className="chat-title font-medium text-sm">
          {mode === 'dev' ? 'Developer Assistant' : 'Chat Assistant'}
        </div>
        
        <div className="flex items-center space-x-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6" 
            onClick={toggleDocked}
            title={docked ? "Undock" : "Dock"}
          >
            {docked ? <ArrowDownToLine className="h-4 w-4" /> : <ArrowDownToLine className="h-4 w-4" />}
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6" 
            onClick={toggleMinimize}
            title={isMinimized ? "Maximize" : "Minimize"}
          >
            {isMinimized ? <Maximize className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6" 
            onClick={toggleChat}
            title="Close"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Chat content area */}
      {!isMinimized && (
        <div className="chat-content-wrapper flex-1 overflow-auto p-4">
          {children || <ChatContent />}
        </div>
      )}
    </div>
  );
};

export default DraggableChatContainer;
