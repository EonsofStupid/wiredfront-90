
import { cn } from '@/lib/utils';
import { ChatMode } from '@/types/chat';
import { Code, GraduationCap, Image, MessageSquare, PlaneLanding } from 'lucide-react';
import React from 'react';

interface ModeIndicatorProps {
  mode: ChatMode;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function ModeIndicator({ 
  mode, 
  size = 'md', 
  showLabel = false,
  className
}: ModeIndicatorProps) {
  // Dynamic size based on prop
  const iconSize = size === 'sm' ? 3 : size === 'md' ? 4 : 5;
  
  // Mode-specific styling
  const getModeColor = (mode: ChatMode): string => {
    switch (mode) {
      case 'chat': return 'text-blue-400';
      case 'dev': return 'text-cyan-400';
      case 'image': return 'text-pink-400';
      case 'training': return 'text-purple-400';
      case 'planning': return 'text-orange-400';
      case 'code': return 'text-emerald-400';
      default: return 'text-gray-400';
    }
  };
  
  // Mode-specific icon
  const getModeIcon = (mode: ChatMode) => {
    switch (mode) {
      case 'chat': 
        return <MessageSquare className={`h-${iconSize} w-${iconSize} ${getModeColor(mode)}`} />;
      case 'dev':
      case 'code': 
        return <Code className={`h-${iconSize} w-${iconSize} ${getModeColor(mode)}`} />;
      case 'image': 
        return <Image className={`h-${iconSize} w-${iconSize} ${getModeColor(mode)}`} />;
      case 'training': 
        return <GraduationCap className={`h-${iconSize} w-${iconSize} ${getModeColor(mode)}`} />;
      case 'planning': 
        return <PlaneLanding className={`h-${iconSize} w-${iconSize} ${getModeColor(mode)}`} />;
      default:
        return <MessageSquare className={`h-${iconSize} w-${iconSize} ${getModeColor(mode)}`} />;
    }
  };
  
  // Mode label
  const getModeLabel = (mode: ChatMode): string => {
    switch (mode) {
      case 'chat': return 'Chat';
      case 'dev': return 'Developer';
      case 'image': return 'Image';
      case 'training': return 'Training';
      case 'planning': return 'Planning';
      case 'code': return 'Code';
      default: return mode;
    }
  };
  
  return (
    <div className={cn(
      'flex items-center gap-1', 
      showLabel ? 'px-2 py-1 rounded-full bg-gray-800/50' : '',
      className
    )}>
      {getModeIcon(mode)}
      {showLabel && <span className={`text-xs font-medium capitalize ${getModeColor(mode)}`}>
        {getModeLabel(mode)}
      </span>}
    </div>
  );
}

export default ModeIndicator;
