
import { supabase } from "@/integrations/supabase/client";
import { executeCommand, parseCommand } from "@/services/chat/CommandHandler";
import { Message } from "@/types/chat";
import { Send } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { VoiceToTextButton } from "../features/voice-to-text";
import { useMessageStore } from "../messaging/MessageManager";
import { useChatStore } from "../store/chatStore";

interface ChatInputModuleProps {
  isEditorPage?: boolean;
}

export function ChatInputModule({
  isEditorPage = false,
}: ChatInputModuleProps) {
  const { userInput, setUserInput, isWaitingForResponse, chatId } =
    useChatStore();
  const addMessage = useMessageStore((state) => state.addMessage);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    const currentTime = new Date().toISOString();

    // Add the user message
    const userMessage: Message = {
      id: messageId,
      content: userInput,
      user_id: null,
      type: "text",
      metadata: {},
      created_at: currentTime,
      updated_at: currentTime,
      chat_session_id: chatId || "default",
      is_minimized: false,
      position: {},
      window_state: {},
      last_accessed: currentTime,
      retry_count: 0,
      message_status: "sent",
      role: "user",
      sessionId: chatId || "default", // Add required sessionId
      timestamp: currentTime, // Add required timestamp
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
          content: `Error: ${error.message || "Failed to send message"}`,
          user_id: null,
          type: "text",
          metadata: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          chat_session_id: chatId || "default",
          is_minimized: false,
          position: {},
          window_state: {},
          last_accessed: new Date().toISOString(),
          retry_count: 0,
          message_status: "error",
          role: "assistant",
          sessionId: chatId || "default", // Add required sessionId
          timestamp: new Date().toISOString(), // Add required timestamp
        };
        addMessage(errorMessage);

        return;
      }

      // Add the assistant response
      const assistantMessage: Message = {
        id: uuidv4(),
        content: data?.response || "No response received",
        user_id: null,
        type: "text",
        metadata: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        chat_session_id: chatId || "default",
        is_minimized: false,
        position: {},
        window_state: {},
        last_accessed: new Date().toISOString(),
        retry_count: 0,
        message_status: "sent",
        role: "assistant",
        sessionId: chatId || "default", // Add required sessionId
        timestamp: new Date().toISOString(), // Add required timestamp
      };
      addMessage(assistantMessage);
    } catch (error) {
      console.error("Error in chat flow:", error);

      // Add error response
      const errorMessage: Message = {
        id: uuidv4(),
        content: `Error: ${error.message || "An unexpected error occurred"}`,
        user_id: null,
        type: "text",
        metadata: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        chat_session_id: chatId || "default",
        is_minimized: false,
        position: {},
        window_state: {},
        last_accessed: new Date().toISOString(),
        retry_count: 0,
        message_status: "error",
        role: "assistant",
        sessionId: chatId || "default", // Add required sessionId
        timestamp: new Date().toISOString(), // Add required timestamp
      };
      addMessage(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 p-4">
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
        disabled={isWaitingForResponse || isProcessing}
      />
      <VoiceToTextButton
        onTranscription={setUserInput}
        isProcessing={isProcessing}
      />
      <button
        type="submit"
        disabled={isWaitingForResponse || !userInput.trim() || isProcessing}
        className="rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600 disabled:bg-gray-400"
        aria-label="Send message"
      >
        <Send className="h-5 w-5" />
      </button>
    </form>
  );
}
