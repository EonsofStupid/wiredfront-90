
import React from 'react';
import { Button } from '@/components/ui/button';
import { Conversation } from '@/types/chat/conversation';
import { ChatMode } from '@/types/chat/enums';
import { EnumUtils } from '@/lib/enums/EnumUtils';
import { MessageCircle, Code, Image, GraduationCap, ClipboardList, FileText, Headphones } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}

export function ConversationItem({ conversation, isActive, onClick }: ConversationItemProps) {
  const getIcon = (mode: ChatMode) => {
    switch (mode) {
      case ChatMode.Chat:
        return <MessageCircle className="h-4 w-4" />;
      case ChatMode.Dev:
      case ChatMode.Editor:
        return <Code className="h-4 w-4" />;
      case ChatMode.Image:
        return <Image className="h-4 w-4" />;
      case ChatMode.Training:
        return <GraduationCap className="h-4 w-4" />;
      case ChatMode.Planning:
        return <ClipboardList className="h-4 w-4" />;
      case ChatMode.Document:
        return <FileText className="h-4 w-4" />;
      case ChatMode.Audio:
        return <Headphones className="h-4 w-4" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
    }
  };

  const formattedDate = conversation.last_accessed 
    ? format(new Date(conversation.last_accessed), 'MMM d')
    : '';

  const title = conversation.title || 'New Conversation';
  const mode = typeof conversation.mode === 'string' 
    ? EnumUtils.stringToChatMode(conversation.mode) 
    : conversation.mode;
  const modeLabel = EnumUtils.getChatModeLabel(mode);

  return (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      className={cn(
        "w-full justify-start mb-1 overflow-hidden",
        isActive ? "bg-secondary" : "hover:bg-secondary/50"
      )}
      onClick={onClick}
    >
      <div className="flex items-center w-full overflow-hidden">
        <div className="flex-shrink-0 mr-2">
          {getIcon(mode)}
        </div>
        <div className="flex-grow min-w-0 overflow-hidden">
          <div className="truncate text-sm font-medium">{title}</div>
          <div className="flex items-center text-xs text-muted-foreground">
            <span className="truncate">{modeLabel}</span>
          </div>
        </div>
        <div className="flex-shrink-0 ml-2 text-xs text-muted-foreground">
          {formattedDate}
        </div>
      </div>
    </Button>
  );
}
