
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Message } from '@/types/chat';
import { Copy, CheckCheck, Trash2, Edit, Share, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface CyberpunkMessageProps {
  message: Message;
  onCopy?: (content: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
}

const CyberpunkMessage: React.FC<CyberpunkMessageProps> = ({
  message,
  onCopy,
  onDelete,
  onEdit
}) => {
  const [copied, setCopied] = useState(false);
  
  const messageClass = `chat-cyberpunk-message chat-cyberpunk-message-${message.role}`;
  const formattedTime = message.timestamp 
    ? format(new Date(message.timestamp), 'HH:mm')
    : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    if (onCopy) onCopy(message.content);
  };

  const formatContent = (content: string) => {
    // Handle code blocks
    if (content.includes('```')) {
      const parts = content.split(/```(?:(\w+))?/);
      return (
        <>
          {parts.map((part, i) => {
            if (i % 2 === 0) {
              // Regular text
              return <span key={i}>{part}</span>;
            } else {
              // Code with optional language
              const language = parts[i - 1] || '';
              return (
                <pre key={i} className={`language-${language}`}>
                  <code>{part}</code>
                </pre>
              );
            }
          })}
        </>
      );
    }
    
    return content;
  };

  return (
    <div className={`${messageClass} group`}>
      <div className="chat-cyberpunk-message-content">
        {formatContent(message.content)}
      </div>
      
      <div className="chat-cyberpunk-message-actions">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="chat-cyberpunk-message-action-button"
                onClick={handleCopy}
              >
                {copied ? <CheckCheck className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{copied ? 'Copied!' : 'Copy message'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {message.role === 'assistant' && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="chat-cyberpunk-message-action-button"
                >
                  <Sparkles className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Regenerate response</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="chat-cyberpunk-message-action-button"
              >
                <Share className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share message</p>
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
                  className="chat-cyberpunk-message-action-button"
                  onClick={() => onEdit(message.id)}
                >
                  <Edit className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit message</p>
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
                  className="chat-cyberpunk-message-action-button text-red-500"
                  onClick={() => onDelete(message.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete message</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      {formattedTime && (
        <div className="chat-cyberpunk-message-timestamp">
          {formattedTime}
        </div>
      )}
    </div>
  );
};

export default CyberpunkMessage;
