
import React from 'react';
import { Button } from '@/components/ui/button';
import { Conversation } from '@/components/chat/types/chat/conversation';
import { ChatMode } from '@/components/chat/types/chat/enums';
import { EnumUtils } from '@/lib/enums/EnumUtils';
import { MessageCircle, Code, Image, GraduationCap, ClipboardList, FileText, Headphones, Archive, Trash2, History } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  isArchived?: boolean;
  onClick: () => void;
  onDelete?: () => void;
  onArchive?: () => void;
  onRestore?: () => void;
}

export function ConversationItem({ 
  conversation, 
  isActive, 
  isArchived = false,
  onClick, 
  onDelete,
  onArchive,
  onRestore
}: ConversationItemProps) {
  const getIcon = (mode: ChatMode | string) => {
    // Convert string to ChatMode if needed
    const chatMode = typeof mode === 'string' 
      ? EnumUtils.stringToChatMode(mode) 
      : mode;
      
    switch (chatMode) {
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
  const mode = conversation.mode;
  
  // Convert mode to ChatMode if it's a string
  const chatMode = typeof mode === 'string' 
    ? EnumUtils.stringToChatMode(mode) 
    : mode;
    
  const modeLabel = EnumUtils.getChatModeLabel(chatMode);

  return (
    <div className="flex group items-center gap-1">
      <Button
        variant={isActive ? "secondary" : "ghost"}
        className={cn(
          "w-full justify-start mb-1 overflow-hidden group-hover:w-[calc(100%-36px)]",
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
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="opacity-0 group-hover:opacity-100">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {isArchived && onRestore && (
            <DropdownMenuItem onClick={onRestore}>
              <History className="h-4 w-4 mr-2" />
              Restore
            </DropdownMenuItem>
          )}
          
          {!isArchived && onArchive && (
            <DropdownMenuItem onClick={onArchive}>
              <Archive className="h-4 w-4 mr-2" />
              Archive
            </DropdownMenuItem>
          )}
          
          {onDelete && (
            <DropdownMenuItem onClick={onDelete} className="text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
