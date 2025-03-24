
import React from 'react';
import { ChatMode } from '@/integrations/supabase/types/enums';
import { Code, MessageSquare, Image, FileCode, BrainCircuit } from 'lucide-react';

interface SessionModeBadgeProps {
  mode: ChatMode;
  className?: string;
}

export const SessionModeBadge: React.FC<SessionModeBadgeProps> = ({ mode, className = '' }) => {
  // Define mode settings (color and icon)
  const modeConfig = {
    'chat': { 
      icon: <MessageSquare className="h-3 w-3" />, 
      color: 'bg-blue-500/40',
      label: 'Chat'
    },
    'dev': { 
      icon: <Code className="h-3 w-3" />, 
      color: 'bg-green-500/40',
      label: 'Dev'
    },
    'code': { 
      icon: <FileCode className="h-3 w-3" />, 
      color: 'bg-green-500/40',
      label: 'Code'
    },
    'image': { 
      icon: <Image className="h-3 w-3" />, 
      color: 'bg-purple-500/40',
      label: 'Image'
    },
    'training': { 
      icon: <BrainCircuit className="h-3 w-3" />, 
      color: 'bg-yellow-500/40',
      label: 'Train'
    },
    'planning': { 
      icon: <BrainCircuit className="h-3 w-3" />, 
      color: 'bg-amber-500/40',
      label: 'Plan'
    }
  };

  // Get config for this mode (or fallback to chat)
  const config = modeConfig[mode] || modeConfig.chat;

  return (
    <div className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs ${config.color} ${className}`}>
      {config.icon}
      <span className="ml-1">{config.label}</span>
    </div>
  );
};
