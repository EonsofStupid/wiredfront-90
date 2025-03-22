
import React, { useState, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import { cn } from "@/lib/utils";

export function ChatInputArea() {
  const [message, setMessage] = useState("");
  const { sendMessage, uiPreferences } = useChat();
  
  const handleSendMessage = async () => {
    if (message.trim()) {
      await sendMessage(message.trim());
      setMessage("");
    }
  };
  
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle sending message based on user preferences
    if (uiPreferences.messageBehavior === 'enter_send' && e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-input-area p-4 border-t border-gray-800">
      <div className="flex items-end gap-2">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className={cn(
            "min-h-[60px] bg-gray-900/50 border-gray-700",
            "focus:ring-purple-500 focus:border-purple-500"
          )}
        />
        <Button
          onClick={handleSendMessage}
          disabled={!message.trim()}
          className="h-10 w-10 rounded-full p-2 bg-purple-600 hover:bg-purple-700"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}

export default ChatInputArea;
