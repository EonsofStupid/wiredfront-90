
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMessageStore } from "../messaging/MessageManager";
import { VoiceRecorder } from "../VoiceRecorder";
import { toast } from "sonner";
import { useChatMode } from "../providers/ChatModeProvider";

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
    if (!currentSessionId) {
      toast.error('No active chat session');
      return;
    }
    
    if (message.trim()) {
      try {
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
        toast.error('Failed to send message');
      }
    }
  };

  const handleTranscription = async (text: string) => {
    if (!currentSessionId) {
      toast.error('No active chat session');
      return;
    }

    try {
      await addMessage({
        content: text,
        role: 'user',
        sessionId: currentSessionId
      });
    } catch (error) {
      console.error('Failed to send transcribed message:', error);
      toast.error('Failed to send message');
    }
  };

  // Determine placeholder text based on mode
  let placeholder = 'Type a message...';
  
  if (mode === 'editor') {
    placeholder = "Ask for code assistance...";
  } else if (mode === 'chat-only') {
    placeholder = "Discuss ideas and refine context...";
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full">
      <div className="relative flex-1 group">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={placeholder}
          className="bg-[#1A1F2C]/80 border-white/10 text-white group-hover:border-[#8B5CF6]/50 transition-all duration-300"
          disabled={isProcessing}
        />
        <div className="absolute inset-0 rounded-md bg-gradient-to-r from-[#8B5CF6]/5 to-[#D946EF]/5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"></div>
      </div>
      <VoiceRecorder 
        onTranscription={handleTranscription}
        isProcessing={isProcessing}
      />
      <Button 
        type="submit" 
        disabled={isProcessing}
        className="min-w-[80px] bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] hover:opacity-90 text-white border-none"
      >
        {isProcessing ? 'Sending...' : 'Send'}
      </Button>
    </form>
  );
}
