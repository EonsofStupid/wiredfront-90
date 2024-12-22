import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { AttachmentList } from './input/AttachmentList';
import { ChatInputActions } from './input/ChatInputActions';
import { useChatCommands } from './input/useChatCommands';
import { useMessageSubmission } from './input/useMessageSubmission';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  onSwitchAPI?: (provider: string) => void;
  isLoading?: boolean;
}

export const ChatInput = ({ onSendMessage, onSwitchAPI, isLoading }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const { handleCommand } = useChatCommands(onSwitchAPI);
  const { 
    attachments, 
    handleFileUpload, 
    handleSubmit,
    setAttachments 
  } = useMessageSubmission(onSendMessage, crypto.randomUUID());

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && attachments.length === 0) return;
    
    if (message.startsWith('/')) {
      if (handleCommand(message)) {
        setMessage("");
        setAttachments([]);
        return;
      }
    }
    
    await handleSubmit(message);
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleFormSubmit(e);
    }
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = Array.from(e.clipboardData.items);
    const imageFiles = items
      .filter(item => item.type.indexOf('image') !== -1)
      .map(item => item.getAsFile())
      .filter((file): file is File => file !== null);
    
    if (imageFiles.length > 0) {
      handleFileUpload(imageFiles);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFileUpload(files);
  };

  return (
    <form onSubmit={handleFormSubmit} className="p-4">
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
        <ChatInputActions
          onAttachmentClick={handleFileSelect}
          isLoading={isLoading}
          hasContent={!!message.trim() || attachments.length > 0}
        />
        <AttachmentList attachments={attachments} />
      </div>
    </form>
  );
};