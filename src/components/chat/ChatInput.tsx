import { useState, useCallback, useEffect, useRef } from "react";
import { Send, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { parseCommand, getCommandHelp } from "@/utils/chat/commandParser";
import { useWebSocketConnection } from "./hooks/useWebSocketConnection";
import { useFileUpload } from "./hooks/useFileUpload";
import { useCommandHandler } from "./hooks/useCommandHandler";
import { useSessionStore } from "@/stores/session/store";

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  onSwitchAPI?: (provider: string) => void;
  isLoading?: boolean;
}

export const ChatInput = ({ onSendMessage, onSwitchAPI, isLoading }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const { isConnected, sendMessage } = useWebSocketConnection(onSendMessage);
  const { attachments, setAttachments, handleFileSelect, handlePaste } = useFileUpload();
  const { handleCommand } = useCommandHandler(onSwitchAPI, setMessage, setAttachments);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const user = useSessionStore((state) => state.user);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && attachments.length === 0) return;
    
    // If not authenticated, show limited mode message
    if (!user && message.startsWith('/')) {
      toast.error('Commands are only available in authenticated mode');
      return;
    }
    
    // For non-authenticated users, just send the message directly
    if (!user) {
      onSendMessage(message);
      setMessage("");
      return;
    }
    
    // Handle authenticated mode with API configuration check
    if (!isConnected) {
      toast.error('Please configure an AI provider in settings and ensure connection is established');
      return;
    }
    
    // Handle commands for authenticated users
    if (message.startsWith('/')) {
      if (handleCommand(message)) {
        setMessage("");
        return;
      }
    }
    
    try {
      // Handle file uploads for authenticated users
      const uploadedFiles = await Promise.all(
        attachments.map(async (file) => {
          const fileExt = file.name.split('.').pop();
          const filePath = `${crypto.randomUUID()}.${fileExt}`;
          
          const { data, error } = await supabase.storage
            .from('chat-attachments')
            .upload(filePath, file);
            
          if (error) throw error;
          
          const { data: { publicUrl } } = supabase.storage
            .from('chat-attachments')
            .getPublicUrl(filePath);
            
          return {
            url: publicUrl,
            type: file.type,
            name: file.name
          };
        })
      );

      await sendMessage({
        content: message,
        attachments: uploadedFiles
      });
      
      setMessage("");
      setAttachments([]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Failed to send message");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    const placeholder = user 
      ? (!isConnected 
          ? 'Please configure an AI provider in settings...' 
          : 'Type a message or command (type /help for commands)...')
      : 'Type a message... (Limited Mode)';
    
    inputRef.current?.setAttribute('placeholder', placeholder);
  }, [isConnected, user]);

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <div className="relative">
        <Textarea
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          className="min-h-[88px] max-h-[200px] resize-none pr-24"
          disabled={isLoading}
        />
        <div className="absolute bottom-3 right-3 flex gap-2">
          {user && (
            <>
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileSelect}
                multiple
                accept="image/*,.pdf,.doc,.docx"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => document.getElementById('file-upload')?.click()}
                disabled={!isConnected}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
            </>
          )}
          <Button 
            type="submit" 
            size="icon"
            disabled={isLoading || (!message.trim() && attachments.length === 0)}
            className="h-8 w-8"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        {attachments.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {attachments.map((file, index) => (
              <div key={index} className="text-sm">
                {file.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </form>
  );
};