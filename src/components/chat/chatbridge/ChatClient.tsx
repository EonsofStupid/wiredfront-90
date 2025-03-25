import React, { useState, useRef, useEffect } from 'react';
import { useChatBridge } from './useChatBridge';
import { MessageCircle, X } from 'lucide-react';
import { ChatToggleButton } from '../ui/ChatToggleButton';
import { Spinner } from '../ui/Spinner';
import { AnimatePresence, motion } from 'framer-motion';
import { Message } from '../Message';
import '../styles/chat-variables.css';

interface ChatClientProps {
  defaultOpen?: boolean;
}

export const ChatClient: React.FC<ChatClientProps> = ({ defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  
  const { 
    messages, 
    connectionStatus, 
    settings, 
    sendMessage,
    updateSettings
  } = useChatBridge();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    
    setIsLoading(true);
    try {
      await sendMessage(inputValue);
      setInputValue('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <>
      {!isOpen && (
        <ChatToggleButton onClick={toggleChat} isLoading={isLoading} />
      )}
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-4 right-4 w-80 sm:w-96 h-[500px] bg-white dark:bg-gray-900 rounded-lg shadow-xl flex flex-col overflow-hidden"
            style={{ zIndex: 'var(--z-chat)' }}
          >
            <div className="flex items-center justify-between p-3 border-b bg-primary text-primary-foreground">
              <div className="flex items-center">
                <MessageCircle className="w-5 h-5 mr-2" />
                <span className="font-medium">Chat</span>
              </div>
              <button 
                onClick={toggleChat}
                className="p-1 rounded-full hover:bg-primary-foreground/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div 
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto p-3 space-y-4"
            >
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  <p>No messages yet. Start a conversation!</p>
                </div>
              ) : (
                messages.map(message => (
                  <Message
                    key={message.id}
                    content={message.content}
                    role={message.role}
                    status={message.message_status}
                    id={message.id}
                    timestamp={message.created_at}
                    onRetry={() => {}}
                  />
                ))
              )}
              
              {isLoading && (
                <div className="flex justify-center p-2">
                  <Spinner size="sm" />
                </div>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="p-3 border-t bg-background">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={isLoading || connectionStatus === 'disconnected'}
                />
                <button 
                  type="submit"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading || !inputValue.trim() || connectionStatus === 'disconnected'}
                >
                  Send
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatClient;
