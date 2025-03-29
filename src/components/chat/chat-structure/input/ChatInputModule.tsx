
import React, { useState, useCallback } from 'react';
import { useChatStore } from '../../store/chatStore';
import { useMessageStore } from '../../messaging/MessageManager';
import { MessageRole, MessageStatus, MessageType } from '@/components/chat/types/chat/enums';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { parseCommand, executeCommand } from '@/services/chat/CommandHandler';
import { VoiceToTextButton } from '../../features/voice-to-text/VoiceToTextButton';
import { 
  createUserMessage, 
  createErrorMessage, 
  createAssistantMessage 
} from '@/services/chat/MessageFactory';
import { logger } from '@/services/chat/LoggingService';

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

    const sessionId = chatId || 'default';
    
    // Create user message using factory function
    const userMessage = createUserMessage(
      userInput, 
      sessionId, 
      'current-user' // This should be replaced with the actual user ID in a real implementation
    );

    addMessage(userMessage);
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
        logger.error('Error sending message:', error);
        toast.error('Error sending message');
        
        // Add error message using factory function
        const errorMessage = createErrorMessage(
          error.message || 'Failed to send message',
          sessionId
        );
        
        addMessage(errorMessage);
        return;
      }

      // Create assistant message using factory function
      const responseMessage = createAssistantMessage(
        data?.response || 'No response received',
        sessionId,
        { source: 'api' }
      );

      addMessage(responseMessage);
    } catch (error: any) {
      logger.error('Error in chat flow:', error);
      
      // Add error message using factory function
      const errorMessage = createErrorMessage(
        error?.message || 'An unexpected error occurred',
        sessionId
      );
      
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
