import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { executeCommand, parseCommand } from "@/services/chat/CommandHandler";
import { Send } from "lucide-react";
import React, { useCallback, useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { VoiceToTextButton } from "../features/voice-to-text";
import { useMessageStore } from "../messaging/MessageManager";
import { useChatStore } from "../store";

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

    // Add the user message
    addMessage({
      id: messageId,
      role: "user",
      content: userInput,
      timestamp: new Date(),
      status: "sent",
      sessionId: chatId || "default",
    });

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
        addMessage({
          id: uuidv4(),
          role: "assistant",
          content: `Error: ${error.message || "Failed to send message"}`,
          timestamp: new Date(),
          status: "error",
          sessionId: chatId || "default",
        });

        return;
      }

      // Add the assistant response
      addMessage({
        id: uuidv4(),
        role: "assistant",
        content: data?.response || "No response received",
        timestamp: new Date(),
        status: "received",
        sessionId: chatId || "default",
      });
    } catch (error) {
      console.error("Error in chat flow:", error);

      // Add error response
      addMessage({
        id: uuidv4(),
        role: "assistant",
        content: `Error: ${error.message || "An unexpected error occurred"}`,
        timestamp: new Date(),
        status: "error",
        sessionId: chatId || "default",
      });
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
      <VoiceToTextButton onVoiceInput={setUserInput} />

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
