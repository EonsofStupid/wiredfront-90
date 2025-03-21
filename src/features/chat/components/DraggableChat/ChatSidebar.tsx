
import React from 'react';
import { Code, Image, BookOpen, Terminal, Github, Cpu, Settings, History } from 'lucide-react';
import { useChatModeStore } from '@/stores/features/chat/modeStore';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ChatSidebarProps {
  className?: string;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ className }) => {
  const { currentMode, setMode } = useChatModeStore();
  
  const modes = [
    { id: 'dev', name: 'Developer', icon: <Code className="h-5 w-5" /> },
    { id: 'image', name: 'Images', icon: <Image className="h-5 w-5" /> },
    { id: 'training', name: 'Training', icon: <BookOpen className="h-5 w-5" /> },
    { id: 'code', name: 'Code Assistant', icon: <Terminal className="h-5 w-5" /> },
    { id: 'planning', name: 'Planning', icon: <Cpu className="h-5 w-5" /> },
    { id: 'github', name: 'GitHub', icon: <Github className="h-5 w-5" /> },
  ];
  
  return (
    <div className={cn("chat-sidebar h-full flex flex-col justify-between", className)}>
      <div className="flex flex-col p-3 space-y-2">
        <h2 className="text-sm font-semibold text-center mb-4 text-white/80">AI Modes</h2>
        
        {modes.map((mode) => (
          <button
            key={mode.id}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
              currentMode === mode.id 
                ? "bg-neon-blue/20 text-white" 
                : "text-white/60 hover:bg-white/10 hover:text-white"
            )}
            onClick={() => setMode(mode.id as any)}
          >
            {mode.icon}
            <span>{mode.name}</span>
          </button>
        ))}
      </div>
      
      <div className="p-3 border-t border-white/10">
        <div className="flex flex-col gap-2">
          <button className="flex items-center gap-3 px-3 py-2 text-white/60 hover:bg-white/10 hover:text-white rounded-lg">
            <History className="h-5 w-5" />
            <span>History</span>
          </button>
          
          <button className="flex items-center gap-3 px-3 py-2 text-white/60 hover:bg-white/10 hover:text-white rounded-lg">
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
