
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Code, Image, MessageSquare, PlaneLanding, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigationModes } from '../../hooks/useNavigationModes';
import { ChatMode } from '@/types/chat';

interface IconStackProps {
  position: 'left' | 'right';
  className?: string;
  currentMode?: ChatMode;
}

export const IconStack: React.FC<IconStackProps> = ({
  position = 'right',
  className,
  currentMode = 'chat'
}) => {
  const { changeMode, getModeLabel, getModeDescription } = useNavigationModes();

  // Mode configuration
  const modes: Array<{
    id: ChatMode;
    icon: React.ReactNode;
    onClick: () => void;
    tooltip: string;
  }> = [
    {
      id: 'chat',
      icon: <MessageSquare size={18} />,
      onClick: () => changeMode('chat'),
      tooltip: 'Chat Mode'
    },
    {
      id: 'dev',
      icon: <Code size={18} />,
      onClick: () => changeMode('dev'),
      tooltip: 'Developer Mode'
    },
    {
      id: 'image',
      icon: <Image size={18} />,
      onClick: () => changeMode('image'),
      tooltip: 'Image Generation'
    },
    {
      id: 'training',
      icon: <GraduationCap size={18} />,
      onClick: () => changeMode('training'),
      tooltip: 'Training Mode'
    },
    {
      id: 'planning',
      icon: <PlaneLanding size={18} />,
      onClick: () => changeMode('planning'),
      tooltip: 'Planning Mode'
    }
  ];

  return (
    <div
      className={cn(
        'flex flex-col gap-2',
        position === 'right' ? 'items-end' : 'items-start',
        className
      )}
    >
      <TooltipProvider>
        {modes.map((mode) => (
          <Tooltip key={mode.id}>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className={cn(
                  'mode-button h-10 w-10 rounded-full',
                  'bg-black/50 backdrop-blur-md border border-purple-500/30',
                  'hover:bg-black/70 hover:border-purple-500/50',
                  'transition-all duration-200',
                  currentMode === mode.id &&
                    'bg-purple-800/50 border-purple-400/70 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                )}
                onClick={mode.onClick}
              >
                {mode.icon}
              </Button>
            </TooltipTrigger>
            <TooltipContent side={position === 'right' ? 'left' : 'right'} align="center">
              <div className="flex flex-col">
                <span className="font-semibold">{getModeLabel(mode.id)}</span>
                <span className="text-xs text-muted-foreground">{getModeDescription(mode.id)}</span>
              </div>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
};
