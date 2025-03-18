
import React, { useState } from 'react';
import { Mic, PaperclipIcon, Smile } from 'lucide-react';
import { ChatInputCommand } from '../features/commands/ChatInputCommand';
import { useChatStore } from '../store/chatStore';

interface ChatInputAreaProps {
  onSendMessage: (message: string) => void;
}

const ChatInputArea: React.FC<ChatInputAreaProps> = ({ onSendMessage }) => {
  const { features, ui } = useChatStore();
  const [isRecording, setIsRecording] = useState(false);
  
  const handleVoiceButtonClick = () => {
    setIsRecording(!isRecording);
    // TODO: Implement voice recognition
  };
  
  return (
    <div className="chat-input-container w-full flex flex-col">
      <div className="flex items-center mb-2 px-2">
        {features.voice && (
          <button
            className={`p-1 rounded-full mr-2 ${isRecording ? 'bg-red-500/20 text-red-500' : 'hover:bg-primary/20'}`}
            onClick={handleVoiceButtonClick}
            aria-label="Voice input"
          >
            <Mic className="h-4 w-4" />
          </button>
        )}
        
        <button
          className="p-1 rounded-full mr-2 hover:bg-primary/20"
          aria-label="Attach file"
        >
          <PaperclipIcon className="h-4 w-4" />
        </button>
        
        <button
          className="p-1 rounded-full hover:bg-primary/20"
          aria-label="Insert emoji"
        >
          <Smile className="h-4 w-4" />
        </button>
      </div>
      
      <ChatInputCommand
        onSendMessage={onSendMessage}
        disabled={ui.messageLoading}
      />
    </div>
  );
};

export default ChatInputArea;
