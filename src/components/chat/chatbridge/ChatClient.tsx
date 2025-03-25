
import React, { useState, useRef, useEffect } from 'react';
import { useChatBridge } from './useChatBridge';
import { MessageCircle, X, Send, Settings, Mic, MicOff } from 'lucide-react';
import { ChatToggleButton } from '../ui/ChatToggleButton';
import { Spinner } from '@/components/ui/spinner';
import { AnimatePresence, motion } from 'framer-motion';
import { Message } from '../Message';
import { MessageModule } from '../modules/MessageModule';
import { ChatInputModule } from '../modules/ChatInputModule';
import { StatusButton } from '../features/status-button/StatusButton';
import { ChatHeaderTopNav } from '../features/ChatHeaderTopNav';
import { VoiceToTextButton } from '../features/voice-to-text/VoiceToTextButton';
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

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(prev => !prev);
  };

  const handleVoiceInput = (text: string) => {
    setInputValue(text);
  };

  return (
    <>
      {!isOpen && (
        <ChatToggleButton 
          onClickHandler={toggleChat} 
          isLoading={isLoading} 
        />
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
            {/* Chat Header */}
            <div className="flex items-center justify-between p-3 border-b bg-primary text-primary-foreground">
              <div className="flex items-center space-between w-full">
                <div className="flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  <span className="font-medium">Chat</span>
                </div>
                
                <div className="flex-1 flex justify-center">
                  <ChatHeaderTopNav />
                </div>
                
                <div className="flex items-center gap-2">
                  <StatusButton />
                  <button 
                    onClick={toggleChat}
                    className="p-1 rounded-full hover:bg-primary-foreground/10 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Messages Container */}
            <div 
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto p-3 space-y-4"
            >
              <MessageModule scrollRef={messagesContainerRef} />
            </div>
            
            {/* Input Form */}
            <form onSubmit={handleSubmit} className="p-3 border-t bg-background">
              <div className="flex items-center space-x-2">
                <VoiceToTextButton onVoiceInput={handleVoiceInput} />
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
                  className="p-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading || !inputValue.trim() || connectionStatus === 'disconnected'}
                >
                  <Send className="w-5 h-5" />
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
