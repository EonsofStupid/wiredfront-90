import React from 'react';
import { useChatMode } from '../providers/ChatModeProvider';

interface ChatContentProps {
  className?: string;
  // Additional props as needed
}

const ChatContent: React.FC<ChatContentProps> = ({ className, ...props }) => {
  const { mode, isEditorPage } = useChatMode();
  
  // Use the mode and isEditorPage to determine what content to show
  
  return (
    <div className={`chat-content ${className || ''}`} {...props}>
      {/* Render different content based on mode and isEditorPage */}
      {mode === 'chat' && (
        <div>Chat Mode Content</div>
      )}
      {mode === 'code' && (
        <div>Code Mode Content</div>
      )}
      {mode === 'image' && (
        <div>Image Mode Content</div>
      )}
      
      {/* Use isEditorPage to conditionally render editor-specific UI */}
      {isEditorPage && (
        <div className="editor-specific-content">
          Editor-specific UI elements
        </div>
      )}
    </div>
  );
};

export default ChatContent;
