import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMessageStore } from "../messaging/MessageManager";
import { useChatMode } from "../providers/ChatModeProvider";
import { Send, Loader2 } from "lucide-react";
import { logger } from '@/services/chat/LoggingService';
import { KnowledgeSourceButton } from '../features/knowledge-source/KnowledgeSourceButton';
import { VoiceToTextButton } from '../features/voice-to-text';
import { toast } from "sonner";

interface ChatInputModuleProps {
  onMessageSubmit?: (content: string) => void;
  isEditorPage?: boolean;
}

export function ChatInputModule({ onMessageSubmit, isEditorPage = false }: ChatInputModuleProps) {
  const [message, setMessage] = useState("");
  const { addMessage, currentSessionId, isProcessing } = useMessageStore();
  const { mode } = useChatMode();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!currentSessionId) {
      toast.error('No active chat session');
      logger.error('Message submission failed - no active session');
      return;
    }
    
    if (message.trim()) {
      try {
        logger.info('Submitting message', { 
          mode, 
          messageLength: message.length,
          sessionId: currentSessionId
        });
        
        if (onMessageSubmit) {
          onMessageSubmit(message.trim());
        }
        
        await addMessage({
          content: message.trim(),
          role: 'user',
          sessionId: currentSessionId
        });
        setMessage("");
      } catch (error) {
        console.error('Failed to send message:', error);
        logger.error('Message submission failed', { error });
        toast.error('Failed to send message');
      }
    }
  };

  const handleTranscription = async (text: string) => {
    if (!currentSessionId) {
      toast.error('No active chat session');
      logger.error('Transcription submission failed - no active session');
      return;
    }

    if (!text.trim()) {
      logger.warn('Empty transcription received');
      return;
    }

    try {
      logger.info('Submitting transcription', { 
        mode, 
        transcriptionLength: text.length,
        sessionId: currentSessionId
      });
      
      await addMessage({
        content: text,
        role: 'user',
        sessionId: currentSessionId
      });
    } catch (error) {
      console.error('Failed to send transcribed message:', error);
      logger.error('Transcription submission failed', { error });
      toast.error('Failed to send message');
    }
  };

  let placeholder = 'Type a message...';
  
  if (mode === 'editor') {
    placeholder = "Ask for code assistance...";
  } else if (mode === 'chat-only') {
    placeholder = "Discuss ideas and refine context...";
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full" onClick={(e) => e.stopPropagation()}>
      <div className="relative flex-1 group">
        <Input
          value={message}
          onChange={handleInputChange}
          onClick={handleInputClick}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="chat-input chat-cyber-border font-mono text-chat-input-text"
          disabled={isProcessing}
          data-testid="chat-input"
          aria-label="Message input"
        />
        <div className="absolute inset-0 rounded-md bg-gradient-to-r from-[#1EAEDB]/5 to-[#1EAEDB]/5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"></div>
      </div>
      
      <KnowledgeSourceButton />
      
      <VoiceToTextButton 
        onTranscription={handleTranscription}
        isProcessing={isProcessing}
      />
      
      <Button 
        type="submit" 
        disabled={isProcessing || !message.trim()}
        className="min-w-[80px] bg-gradient-to-r from-[#1EAEDB] to-[#0080B3] hover:opacity-90 text-white border-none transition-all duration-200 font-mono"
        data-testid="send-button"
      >
        {isProcessing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <Send className="h-4 w-4 mr-2" />
            Send
          </>
        )}
      </Button>
    </form>
  );
}
