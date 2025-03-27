import React, { useState, useCallback } from 'react';
import { useChatStore } from '@/components/chat/store/chatStore';
import { useMessageStore } from "@/components/chat/store/message";
import { v4 as uuidv4 } from 'uuid';
import { Message, MessageRole, MessageStatus, MessageMetadata } from '@/components/chat/shared/schemas/messages';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { parseCommand, executeCommand } from '@/services/chat/CommandHandler';
import { VoiceToTextButton } from '@/components/chat/features/voice-to-text/module/VoiceToTextButton';

interface ChatInputModuleProps {
  isEditorPage: boolean;
}

export const ChatInputModule: React.FC<ChatInputModuleProps> = ({ isEditorPage }) => {
  const { userInput, setUserInput, isWaitingForResponse, chatId } = useChatStore();
  const addMessage = useMessageStore((state) => state.addMessage);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const sendMessage = useCallback(async () => {
    if (!userInput.trim() || isWaitingForResponse || isProcessing) return;

    const { isCommand, command, args } = parseCommand(userInput);

    if (isCommand) {
      await executeCommand(command, args);
      setUserInput('');
      return;
    }

    const messageId = uuidv4();
    const now = new Date();

    // Using our schema-compliant types
    addMessage({
      id: messageId,
      content: userInput,
      role: 'user',
      type: 'text',
      metadata: {},
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
      chat_session_id: chatId || 'default',
      message_status: 'sent'
    });
    
    setUserInput('');
    setIsProcessing(true);

    try {
      const { data, error } = await supabase.functions.invoke('chat', {
        body: { 
          message: userInput, 
          chatId,
          isEditorPage
        }
      });

      if (error) {
        toast.error('Error sending message');
        console.error('Error sending message:', error);

        // Create error message
        addMessage({
          id: uuidv4(),
          content: `Error: ${error.message || 'Failed to send message'}`,
          role: 'assistant',
          type: 'system',
          message_status: 'error'
        });
        
        return;
      }

      // Add assistant response
      addMessage({
        id: uuidv4(),
        content: data?.response || 'No response received',
        role: 'assistant',
        type: 'text',
        message_status: 'received',
        metadata: data?.metadata || {}
      });
      
    } catch (error: any) {
      console.error('Error in chat flow:', error);

      // Add error message
      addMessage({
        id: uuidv4(),
        content: `Error: ${error?.message || 'An unexpected error occurred'}`,
        role: 'assistant',
        type: 'system',
        message_status: 'error'
      });
      
    } finally {
      setIsProcessing(false);
    }
  }, [userInput, isWaitingForResponse, isProcessing, chatId, addMessage, setUserInput, isEditorPage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="p-4 border-t bg-background">
      <div className="flex items-center gap-2">
        <VoiceToTextButton 
          onTranscription={(text) => setUserInput(text)} 
          isProcessing={isProcessing}
        />
        
        <Input
          value={userInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="flex-1 bg-background/50"
          disabled={isWaitingForResponse || isProcessing}
          data-testid="chat-input"
        />
        
        <Button
          type="button"
          size="icon"
          onClick={sendMessage}
          disabled={!userInput.trim() || isWaitingForResponse || isProcessing}
          className="h-10 w-10"
          title="Send message"
          data-testid="send-button"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
