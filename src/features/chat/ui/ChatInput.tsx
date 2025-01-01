import React, { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Paperclip } from 'lucide-react';
import { useChat } from '../ChatProvider';
import { useCommandStore } from '../core/commands/CommandRegistry';

export const ChatInput: React.FC = () => {
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { sendMessage } = useChat();
  const { executeCommand } = useCommandStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      if (message.startsWith('/')) {
        const [command, ...args] = message.slice(1).split(' ');
        await executeCommand(command, args.join(' '));
      } else {
        await sendMessage(message);
      }
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleFileClick}
        >
          <Paperclip className="h-5 w-5" />
        </Button>
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message or command..."
          className="flex-1"
        />
        <Button type="submit" size="icon">
          <Send className="h-5 w-5" />
        </Button>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={(e) => {
          // File upload handling will be implemented next
          console.log('File selected:', e.target.files?.[0]);
        }}
      />
    </div>
  );
};