
import React, { useState, useCallback } from 'react';
import { useChatStore } from '../../store/chatStore';
import { useMessageStore } from '../../messaging/MessageManager';
import { v4 as uuidv4 } from 'uuid';
import { MessageRole, MessageStatus } from '@/types/chat/enums';
import { Json } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { parseCommand, executeCommand } from '@/services/chat/CommandHandler';
import { VoiceToTextButton } from '../../features/voice-to-text/VoiceToTextButton';

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
    const sessionId = chatId || 'default';

    const userMessage = {
      id: messageId,
      role: 'user' as MessageRole,
      content: userInput,
      user_id: null,
      type: 'text',
      metadata: {} as Json,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
      chat_session_id: sessionId,
      conversation_id: sessionId,  // Add this for new Message type compatibility
      is_minimized: false,
      position: {} as Json,
      window_state: {} as Json,
      last_accessed: now.toISOString(),
      retry_count: 0,
      message_status: 'sent' as MessageStatus
    };

    addMessage(userMessage);
    setUserInput('');
    setIsProcessing(true);

    try {
      const { data, error } = await supabase.functions.invoke('chat', {
        body: { 
          message: userInput, 
          chatId,
          isEditorPage // Pass this to the API if needed
        }
      });

      if (error) {
        toast.error('Error sending message');
        console.error('Error sending message:', error);

        const errorMessage = {
          id: uuidv4(),
          role: 'assistant' as MessageRole,
          content: `Error: ${error.message || 'Failed to send message'}`,
          user_id: null,
          type: 'text',
          metadata: {} as Json,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          chat_session_id: sessionId,
          conversation_id: sessionId,  // Add this for new Message type compatibility
          is_minimized: false,
          position: {} as Json,
          window_state: {} as Json,
          last_accessed: new Date().toISOString(),
          retry_count: 0,
          message_status: 'error' as MessageStatus
        };

        addMessage(errorMessage);
        return;
      }

      const responseMessage = {
        id: uuidv4(),
        role: 'assistant' as MessageRole,
        content: data?.response || 'No response received',
        user_id: null,
        type: 'text',
        metadata: {} as Json,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        chat_session_id: sessionId,
        conversation_id: sessionId,  // Add this for new Message type compatibility
        is_minimized: false,
        position: {} as Json,
        window_state: {} as Json,
        last_accessed: new Date().toISOString(),
        retry_count: 0,
        message_status: 'received' as MessageStatus
      };

      addMessage(responseMessage);
    } catch (error: any) {
      console.error('Error in chat flow:', error);

      const errorMessage = {
        id: uuidv4(),
        role: 'assistant' as MessageRole,
        content: `Error: ${error?.message || 'An unexpected error occurred'}`,
        user_id: null,
        type: 'text',
        metadata: {} as Json,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        chat_session_id: sessionId,
        conversation_id: sessionId,  // Add this for new Message type compatibility
        is_minimized: false,
        position: {} as Json,
        window_state: {} as Json,
        last_accessed: new Date().toISOString(),
        retry_count: 0,
        message_status: 'error' as MessageStatus
      };

      addMessage(errorMessage);
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
