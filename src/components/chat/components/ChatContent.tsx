
import React from 'react';
import { useChatMode } from '../providers/ChatModeProvider';
import { ChatMode } from '@/integrations/supabase/types/enums';

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
      {(mode === 'chat' || mode === 'standard') && (
        <div>Chat Mode Content</div>
      )}
      {(mode === 'dev' || mode === 'developer') && (
        <div>Developer Mode Content</div>
      )}
      {mode === 'image' && (
        <div>Image Mode Content</div>
      )}
      {mode === 'training' && (
        <div>Training Mode Content</div>
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
