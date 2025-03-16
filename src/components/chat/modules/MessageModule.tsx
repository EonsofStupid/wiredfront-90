import React, { useEffect, useState } from 'react';
import { Message, MessageStatus } from '@/types/chat';

interface MessageModuleProps {
  message: Message;
  isLast: boolean;
  onRetry?: (messageId: string) => void;
}

const MessageModule = ({ message, isLast, onRetry }: MessageModuleProps) => {
  const [status, setStatus] = useState<MessageStatus>(message.message_status || 'sent');

  useEffect(() => {
    setStatus(message.message_status || 'sent');
  }, [message.message_status]);
  
  // Convert timestamp to Date object if needed
  const messageTimestamp = message.timestamp 
    ? new Date(message.timestamp) 
    : message.created_at 
      ? new Date(message.created_at)
      : new Date();
  
  // Safe access to message status with proper type handling
  const messageStatus: MessageStatus = message.message_status || 'sent';
  
  return (
    <div>
      {messageStatus && (
        <div className="message-status">
          Status: {messageStatus}
        </div>
      )}
      {/* Format the timestamp */}
      <div className="message-timestamp">
        {messageTimestamp.toLocaleTimeString()}
      </div>
    </div>
  );
};

export default MessageModule;
