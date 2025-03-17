
import React from 'react';
import { Message } from '@/types/chat';
import { format } from 'date-fns';
import { Copy, CheckCheck, Trash, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import '../styles/cyber-theme.css';

interface ChatMessageProps {
  message: Message;
  onCopy?: (content: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  onCopy, 
  onDelete,
  onEdit
}) => {
  const [copied, setCopied] = React.useState(false);
  const messageClass = message.role === 'user' 
    ? 'chat-message-user' 
    : 'chat-message-assistant';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    if (onCopy) onCopy(message.content);
  };

  const handleDelete = () => {
    if (onDelete) onDelete(message.id);
  };

  const handleEdit = () => {
    if (onEdit) onEdit(message.id);
  };

  // Format the timestamp if available
  const formattedTime = message.timestamp 
    ? format(new Date(message.timestamp), 'HH:mm')
    : '';

  // Function to format code blocks in messages
  const formatMessageContent = (content: string) => {
    // Support for basic markdown code blocks
    if (content.includes('```')) {
      const parts = content.split('```');
      return (
        <>
          {parts.map((part, index) => {
            // Even indexes are regular text, odd indexes are code
            if (index % 2 === 0) {
              return <span key={index}>{part}</span>;
            } else {
              return <pre key={index}><code>{part}</code></pre>;
            }
          })}
        </>
      );
    }
    return content;
  };

  return (
    <div className={`chat-message ${messageClass} group relative`}>
      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 rounded-full bg-black/20 text-white/70 hover:text-white hover:bg-black/40"
                onClick={handleCopy}
              >
                {copied ? <CheckCheck className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">{copied ? 'Copied!' : 'Copy message'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {onEdit && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 rounded-full bg-black/20 text-white/70 hover:text-white hover:bg-black/40"
                  onClick={handleEdit}
                >
                  <Edit className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Edit message</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {onDelete && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 rounded-full bg-black/20 text-white/70 hover:text-red-500 hover:bg-black/40"
                  onClick={handleDelete}
                >
                  <Trash className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Delete message</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      <div className="message-content">
        {formatMessageContent(message.content)}
      </div>
      
      {formattedTime && (
        <div className="text-[10px] text-white/40 mt-1 text-right">
          {formattedTime}
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
