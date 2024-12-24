import { useState, useCallback, useEffect, useRef } from "react";
import { Send, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { parseCommand, getCommandHelp } from "@/utils/chat/commandParser";

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  onSwitchAPI?: (provider: string) => void;
  isLoading?: boolean;
}

export const ChatInput = ({ onSendMessage, onSwitchAPI, isLoading }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const connectWebSocket = () => {
      const ws = new WebSocket(`wss://ewjisqyvspdvhyppkhnm.functions.supabase.co/realtime-chat`);

      ws.onopen = () => {
        console.log('Connected to chat WebSocket');
        setIsConnected(true);
        toast.success('Connected to AI chat');
      };

      ws.onclose = () => {
        console.log('Disconnected from chat WebSocket');
        setIsConnected(false);
        toast.error('Disconnected from AI chat');
        // Attempt to reconnect after a delay
        setTimeout(connectWebSocket, 3000);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        toast.error('Chat connection error');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Received message:', data);
          
          if (data.type === 'response.message.delta') {
            onSendMessage(data.delta);
          }
        } catch (error) {
          console.error('Error processing message:', error);
        }
      };

      wsRef.current = ws;
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [onSendMessage]);

  const handleCommand = (command: string) => {
    const parsed = parseCommand(command);
    if (!parsed) return false;

    switch (parsed.type) {
      case 'switch-api':
        if (parsed.args.length > 0 && onSwitchAPI) {
          onSwitchAPI(parsed.args[0]);
          toast.success(`Switched to ${parsed.args[0]} API`);
        } else {
          toast.error("Please specify an API provider");
        }
        return true;
      case 'help':
        toast.info(getCommandHelp());
        return true;
      case 'clear':
        setMessage("");
        setAttachments([]);
        toast.success("Chat input cleared");
        return true;
      case 'unknown':
        toast.error("Unknown command. Type /help for available commands");
        return true;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && attachments.length === 0) return;
    
    // Handle commands
    if (message.startsWith('/')) {
      if (handleCommand(message)) {
        setMessage("");
        return;
      }
    }
    
    try {
      // Handle file uploads first
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

      // Send message through WebSocket
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          content: message,
          attachments: uploadedFiles
        }));
        setMessage("");
        setAttachments([]);
      } else {
        toast.error('Chat connection not ready');
      }
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

  const handlePaste = useCallback(async (e: React.ClipboardEvent) => {
    const items = Array.from(e.clipboardData.items);
    
    items.forEach((item) => {
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        if (file) {
          setAttachments(prev => [...prev, file]);
          toast.success("Image added to message");
        }
      }
    });
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
    toast.success(`${files.length} file(s) added to message`);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <div className="relative">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder="Type a message or command (type /help for commands)..."
          className="min-h-[88px] max-h-[200px] resize-none pr-24"
          disabled={isLoading || !isConnected}
        />
        <div className="absolute bottom-3 right-3 flex gap-2">
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
          <Button 
            type="submit" 
            size="icon"
            disabled={isLoading || !isConnected || (!message.trim() && attachments.length === 0)}
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