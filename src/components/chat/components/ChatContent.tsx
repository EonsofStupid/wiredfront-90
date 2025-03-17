
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useChatMode } from '../providers/ChatModeProvider';
import { EditorChatModule } from '../modules/editor/EditorChatModule';
import { GalleryChatModule } from '../modules/gallery/GalleryChatModule';
import { ChatMode } from '@/integrations/supabase/types/enums';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatMessage from './ChatMessage';
import { useChatStore } from '../store';
import { Message } from '@/types/chat';

interface ChatContentProps {
  className?: string;
}

const ChatContent: React.FC<ChatContentProps> = ({ className }) => {
  const { mode } = useChatMode();
  const location = useLocation();
  const { isMinimized, messages } = useChatStore();
  
  // Determine what page we're on based on the route
  const isEditorPage = location.pathname === '/editor';
  const isGalleryPage = location.pathname === '/gallery';
  const isAdminPage = location.pathname.startsWith('/admin');
  const isTrainingPage = location.pathname === '/training';
  
  // Don't render content if minimized
  if (isMinimized) {
    return null;
  }
  
  // Render specialized content based on page and mode
  if (isEditorPage && mode === 'dev') {
    return <EditorChatModule className={className} />;
  }
  
  if (isGalleryPage && (mode === 'image' || mode === 'chat')) {
    return <GalleryChatModule className={className} />;
  }
  
  // Return standard chat for all other cases
  return (
    <div className={`chat-content ${className || ''}`}>
      <ScrollArea className="h-[350px] p-4">
        <div className="space-y-4">
          <div className="text-center opacity-60">
            <p className="text-xs text-white/60">
              {new Date().toLocaleDateString()} • {
                isEditorPage ? 'Editor' : 
                isGalleryPage ? 'Gallery' : 
                isAdminPage ? 'Admin' : 
                isTrainingPage ? 'Training' : 'Dashboard'
              } Mode
            </p>
          </div>
          
          {messages.length === 0 ? (
            <div className="chat-message chat-message-assistant cyber-border cyber-pulse">
              <span className="cyber-glitch" data-text="How can I help you today?">
                {isEditorPage
                  ? "I can help with your code. What are you working on?"
                  : isGalleryPage
                  ? "I can generate images based on your descriptions."
                  : isAdminPage
                  ? "What admin tasks would you like assistance with?"
                  : isTrainingPage
                  ? "Ready to help you learn. What topic should we cover?"
                  : "How can I help you today?"}
              </span>
            </div>
          ) : (
            messages.map((msg: Message) => (
              <ChatMessage key={msg.id} message={msg} />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatContent;
