import { useState, useCallback } from "react";
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

  const handleCommand = (command: string) => {
    const parsed = parseCommand(command);
    if (!parsed) return false;

    switch (parsed.type) {
      case 'switch-api':
        if (parsed.args.length > 0 && onSwitchAPI) {
          onSwitchAPI(parsed.args[0]);
          toast.success(`Switched to ${parsed.args[0]} API`, {
            id: 'api-switch' // Prevent duplicate toasts
          });
        }
        return true;
      case 'help':
        toast.info(getCommandHelp(), {
          id: 'help-command' // Prevent duplicate toasts
        });
        return true;
      case 'clear':
        setMessage("");
        setAttachments([]);
        return true;
      case 'unknown':
        toast.error("Unknown command. Type /help for available commands", {
          id: 'unknown-command' // Prevent duplicate toasts
        });
        return true;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && attachments.length === 0) return;
    
    if (message.startsWith('/')) {
      if (handleCommand(message)) {
        setMessage("");
        return;
      }
    }
    
    try {
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

      let finalContent = message;
      if (uploadedFiles.length > 0) {
        finalContent = JSON.stringify({
          text: message,
          attachments: uploadedFiles
        });
      }

      onSendMessage(finalContent);
      setMessage("");
      setAttachments([]);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error("Failed to upload file(s)", {
        id: 'upload-error' // Prevent duplicate toasts
      });
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
          toast.success("Image added to message", {
            id: 'image-paste' // Prevent duplicate toasts
          });
        }
      }
    });
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
    if (files.length > 0) {
      toast.success(`${files.length} file(s) added to message`, {
        id: 'file-select' // Prevent duplicate toasts
      });
    }
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