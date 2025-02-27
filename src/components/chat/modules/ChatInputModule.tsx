
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

  // Determine placeholder text based on context
  let placeholder = "Type a message...";
  
  if (isEditorPage) {
    placeholder = "Ask for code assistance...";
  } else if (mode === 'chat-only') {
    placeholder = "Ask a question for planning or research...";
  } else if (mode === 'default') {
    placeholder = "Type a message for code generation...";
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={placeholder}
        className="flex-1"
        disabled={isProcessing}
      />
      <VoiceRecorder 
        onTranscription={handleTranscription}
        isProcessing={isProcessing}
      />
      <Button 
        type="submit" 
        disabled={isProcessing}
        className="min-w-[80px]"
      >
        {isProcessing ? 'Sending...' : 'Send'}
      </Button>
    </form>
  );
}
