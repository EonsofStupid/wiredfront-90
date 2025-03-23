import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { executeCommand, parseCommand } from "@/services/chat/CommandHandler";
import { Send } from "lucide-react";
import React, { useCallback, useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { ElevenLabsVoiceButton } from "../features/voice-to-text/ElevenLabsVoiceButton";
import { VoiceToTextButton } from "../features/voice-to-text/VoiceToTextButton";
import { useMessageStore } from "../messaging/MessageManager";
import { useChatStore } from "../store";
import { Message } from "../store/types/chat-store-types";

export const ChatInputModule = () => {
  const { userInput, setUserInput, isWaitingForResponse, chatId } =
    useChatStore();
  const addMessage = useMessageStore((state) => state.addMessage);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const sendMessage = useCallback(async () => {
    if (!userInput.trim() || isWaitingForResponse || isProcessing) return;

    // Check if the input is a command
    const { isCommand, command, args } = parseCommand(userInput);

    if (isCommand) {
      // Execute command and clear input
      const processed = await executeCommand(command, args);
      setUserInput("");
      return;
    }

    // Create new message ID
    const messageId = uuidv4();
    const now = new Date().toISOString();

    // Add the user message
    const userMessage: Message = {
      id: messageId,
      role: "user",
      content: userInput,
      user_id: null,
      type: "text",
      metadata: {},
      created_at: now,
      updated_at: now,
      chat_session_id: chatId || "default",
      is_minimized: false,
      position: {},
      window_state: {},
      last_accessed: now,
      retry_count: 0,
      message_status: "sent",
    };

    addMessage(userMessage);

    // Clear the input
    setUserInput("");

    // Set processing state
    setIsProcessing(true);

    try {
      // Send the message to the API
      const { data, error } = await supabase.functions.invoke("chat", {
        body: { message: userInput, chatId },
      });

      if (error) {
        toast.error("Error sending message");
        console.error("Error sending message:", error);

        // Add error response
        const errorMessage: Message = {
          id: uuidv4(),
          role: "assistant",
          content: `Error: ${error.message || "Failed to send message"}`,
          user_id: null,
          type: "text",
          metadata: {},
          created_at: now,
          updated_at: now,
          chat_session_id: chatId || "default",
          is_minimized: false,
          position: {},
          window_state: {},
          last_accessed: now,
          retry_count: 0,
          message_status: "error",
        };

        addMessage(errorMessage);
        return;
      }

      // Add the assistant response
      const assistantMessage: Message = {
        id: uuidv4(),
        role: "assistant",
        content: data?.response || "No response received",
        user_id: null,
        type: "text",
        metadata: {},
        created_at: now,
        updated_at: now,
        chat_session_id: chatId || "default",
        is_minimized: false,
        position: {},
        window_state: {},
        last_accessed: now,
        retry_count: 0,
        message_status: "sent",
      };

      addMessage(assistantMessage);
    } catch (error) {
      console.error("Error in chat flow:", error);

      // Add error response
      const errorMessage: Message = {
        id: uuidv4(),
        role: "assistant",
        content: `Error: ${error.message || "An unexpected error occurred"}`,
        user_id: null,
        type: "text",
        metadata: {},
        created_at: now,
        updated_at: now,
        chat_session_id: chatId || "default",
        is_minimized: false,
        position: {},
        window_state: {},
        last_accessed: now,
        retry_count: 0,
        message_status: "error",
      };

      addMessage(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, [
    userInput,
    isWaitingForResponse,
    isProcessing,
    chatId,
    addMessage,
    setUserInput,
  ]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="p-4 border-t border-[var(--chat-border-color)] bg-[var(--chat-input-bg)] flex items-center gap-2">
      <div className="flex gap-1">
        <VoiceToTextButton
          onTranscription={setUserInput}
          isProcessing={isProcessing}
        />
        <ElevenLabsVoiceButton
          onTranscription={setUserInput}
          isProcessing={isProcessing}
        />
      </div>

      <Input
        placeholder="Type a message..."
        value={userInput}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        disabled={isWaitingForResponse || isProcessing}
        className="flex-1 bg-[var(--chat-input-bg)] text-[var(--chat-input-text)] placeholder:text-[var(--chat-input-placeholder)] border-[var(--chat-input-border)] focus:border-[var(--chat-input-focus-border)] focus:ring-[var(--chat-input-focus-glow)]"
      />

      <Button
        onClick={sendMessage}
        disabled={!userInput.trim() || isWaitingForResponse || isProcessing}
        size="icon"
        className="bg-[var(--chat-button-primary)] text-[var(--chat-button-text)] hover:bg-[var(--chat-button-hover)] disabled:bg-[var(--chat-button-disabled)] border-[var(--chat-button-border)]"
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
};
