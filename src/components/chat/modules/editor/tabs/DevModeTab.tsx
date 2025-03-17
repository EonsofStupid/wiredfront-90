
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMessageAPI } from '@/hooks/chat/useMessageAPI';
import { Send, CornerDownLeft } from 'lucide-react';

interface DevModeTabProps {
  activeFile: string | null;
  fileContent: string;
}

export function DevModeTab({ activeFile, fileContent }: DevModeTabProps) {
  const [prompt, setPrompt] = useState<string>('');
  const { sendMessage, isLoading } = useMessageAPI();

  const handleSendMessage = () => {
    if (!prompt.trim()) return;
    
    // Create a context-enriched message with file info
    const contextMessage = activeFile 
      ? `${prompt}\n\nActive file: ${activeFile}\n\n\`\`\`\n${fileContent}\n\`\`\``
      : prompt;
      
    sendMessage(contextMessage);
    setPrompt('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="dev-mode-tab space-y-3">
      <div className="text-xs text-white/70 mb-2">
        {activeFile ? (
          <span>Working with <span className="text-white font-medium">{activeFile}</span></span>
        ) : (
          <span>No file selected. Select a file from the editor to get context-aware assistance.</span>
        )}
      </div>

      <div className="space-y-2">
        <div className="bg-black/20 p-2 rounded-md">
          <h4 className="text-xs font-medium mb-1 text-white/80">Quick Prompts</h4>
          <div className="flex flex-wrap gap-1">
            <QuickPromptButton 
              label="Explain code" 
              onClick={() => setPrompt('Explain what this code does and how it works.')}
            />
            <QuickPromptButton 
              label="Refactor" 
              onClick={() => setPrompt('Refactor this code to improve performance and readability.')}
            />
            <QuickPromptButton 
              label="Find bugs" 
              onClick={() => setPrompt('Review this code for potential bugs and issues.')}
            />
            <QuickPromptButton 
              label="Add types" 
              onClick={() => setPrompt('Add proper TypeScript types to this code.')}
            />
          </div>
        </div>
        
        <div className="relative">
          <Textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your code..."
            className="min-h-24 bg-black/20 border-white/10 text-white placeholder:text-white/40"
          />
          <Button 
            size="icon" 
            variant="ghost" 
            className="absolute bottom-2 right-2 h-6 w-6 text-white/70 hover:text-white hover:bg-white/10"
            onClick={handleSendMessage}
            disabled={isLoading || !prompt.trim()}
          >
            {isLoading ? (
              <div className="h-3 w-3 rounded-full border-2 border-t-transparent border-white animate-spin" />
            ) : (
              <CornerDownLeft className="h-3 w-3" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

interface QuickPromptButtonProps {
  label: string;
  onClick: () => void;
}

function QuickPromptButton({ label, onClick }: QuickPromptButtonProps) {
  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="h-6 text-[10px] py-0 px-2 bg-transparent border-white/20 text-white/70 hover:bg-white/10"
      onClick={onClick}
    >
      {label}
    </Button>
  );
}
