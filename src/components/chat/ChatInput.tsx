import { useState, useCallback, useRef } from "react";
import { Send, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { parseCommand, getCommandHelp } from "@/utils/chat/commandParser";
import { MessageProcessor } from '@/services/chat/services/messaging/MessageProcessor';
import { MessageQueue } from '@/services/chat/services/messaging/MessageQueue';
import { MessageLogger } from '@/services/chat/services/messaging/MessageLogger';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  onSwitchAPI?: (provider: string) => void;
  isLoading?: boolean;
}

export const ChatInput = ({ onSendMessage, onSwitchAPI, isLoading }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const messageLogger = useRef(new MessageLogger(crypto.randomUUID()));
  const messageProcessor = useRef(new MessageProcessor(crypto.randomUUID()));
  const messageQueue = useRef(new MessageQueue(crypto.randomUUID()));

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
      messageLogger.current.logMessageAttempt({ 
        id: crypto.randomUUID(),
        content: message,
        type: 'text'
      });

      // Handle file uploads first
      const uploadedFiles = await Promise.all(
        attachments.map(async (file) => {
          messageLogger.current.logAttachmentUpload({
            name: file.name,
            type: file.type,
            size: file.size
          });

          const fileExt = file.name.split('.').pop();
          const filePath = `${crypto.randomUUID()}.${fileExt}`;
          
          const { data, error } = await supabase.storage
            .from('chat-attachments')
            .upload(filePath, file);
            
          if (error) {
            messageLogger.current.logAttachmentError(error, { name: file.name });
            throw error;
          }
          
          const { data: { publicUrl } } = supabase.storage
            .from('chat-attachments')
            .getPublicUrl(filePath);
            
          messageLogger.current.logAttachmentSuccess({
            name: file.name,
            url: publicUrl
          });

          return {
            url: publicUrl,
            type: file.type,
            name: file.name
          };
        })
      );

      // Create the message content with attachments if any
      let finalContent = message;
      if (uploadedFiles.length > 0) {
        finalContent = JSON.stringify({
          text: message,
          attachments: uploadedFiles
        });
      }

      await messageQueue.current.enqueue({
        id: crypto.randomUUID(),
        content: finalContent,
        type: 'text',
        user_id: '', // Will be set by backend
        chat_session_id: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_minimized: false,
        metadata: {},
        position: { x: null, y: null },
        window_state: { width: 350, height: 500 },
        last_accessed: new Date().toISOString()
      });

      onSendMessage(finalContent);
      setMessage("");
      setAttachments([]);
    } catch (error) {
      console.error('Upload error:', error);
      messageLogger.current.logMessageError(error as Error);
      toast.error("Failed to upload file(s)");
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
          disabled={isLoading}
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
          >
            <Paperclip className="h-4 w-4" />
          </Button>
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
