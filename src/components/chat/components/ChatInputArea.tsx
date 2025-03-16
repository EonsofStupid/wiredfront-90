
import React, { useState, useRef } from 'react';
import { useChatStore } from '../store';
import { Mic, MicOff, Send, PaperclipIcon, Smile } from 'lucide-react';
import '../styles/cyber-theme.css';

interface ChatInputAreaProps {
  onSendMessage?: (message: string) => void;
}

const ChatInputArea: React.FC<ChatInputAreaProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const { isWaitingForResponse } = useChatStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSendMessage = () => {
    if (!message.trim() || isWaitingForResponse) return;
    
    if (onSendMessage) {
      onSendMessage(message.trim());
    } else {
      // Default send logic
      console.log('Message sent:', message);
      
      // Add to chat store logic would go here
      const messageObj = {
        id: Date.now().toString(),
        content: message,
        role: 'user',
        timestamp: new Date().toISOString()
      };
      
      useChatStore.getState().addMessage(messageObj);
    }
    
    setMessage('');
    
    // Focus textarea after sending
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleVoiceRecording = () => {
    setIsRecording(!isRecording);
    // Voice recording logic would go here
    if (!isRecording) {
      console.log('Starting voice recording...');
    } else {
      console.log('Stopping voice recording...');
      // Process the recording and set the message
      // For demo purposes, add some text
      setMessage(prev => prev + ' [Voice transcription would appear here]');
    }
  };

  // Handle textarea auto-resize
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(120, textareaRef.current.scrollHeight)}px`;
    }
  };

  return (
    <div className="chat-input-area p-3 border-t border-cyan-400/20 cyber-bg">
      <div className="flex items-end gap-2">
        <button 
          className="p-2 rounded-full text-white/70 hover:text-cyan-400 hover:bg-cyan-400/10 transition-colors"
          aria-label="Add attachment"
        >
          <PaperclipIcon className="h-5 w-5" />
        </button>
        
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="Message AI Assistant..."
            className="cyber-input w-full min-h-[40px] max-h-[120px] resize-none pr-10 py-2"
            disabled={isWaitingForResponse}
            rows={1}
          />
          
          <button 
            className="absolute right-2 bottom-2 p-1 rounded-full text-white/70 hover:text-pink-400 hover:bg-pink-400/10 transition-colors"
            aria-label="Add emoji"
          >
            <Smile className="h-5 w-5" />
          </button>
        </div>
        
        <button
          className={`p-2 rounded-full transition-colors ${
            isRecording 
              ? 'text-red-400 bg-red-400/10 cyber-pulse' 
              : 'text-white/70 hover:text-purple-400 hover:bg-purple-400/10'
          }`}
          onClick={toggleVoiceRecording}
          aria-label={isRecording ? 'Stop recording' : 'Start voice recording'}
        >
          {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </button>
        
        <button
          className={`p-2 rounded-full ${
            message.trim() && !isWaitingForResponse
              ? 'text-cyan-400 bg-cyan-400/10 hover:bg-cyan-400/20 cyber-pulse'
              : 'text-white/40 bg-white/5'
          }`}
          onClick={handleSendMessage}
          disabled={!message.trim() || isWaitingForResponse}
          aria-label="Send message"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
      
      {isWaitingForResponse && (
        <div className="mt-2 text-xs text-center text-white/60">
          AI is thinking<span className="typing-dots">...</span>
        </div>
      )}
    </div>
  );
};

export default ChatInputArea;
