
import React from 'react';
import { MoreHorizontal, Archive, TrashIcon, RotateCcw } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Conversation } from '@/types/chat/conversation';
import { cn } from '@/lib/utils';
import { stringToChatMode } from '../../types/enums-mapper';
import { ChatMode } from '@/types/chat/enums';

interface ChatConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  isArchived?: boolean;
  onClick: () => void;
  onDelete: () => void;
  onArchive?: () => void;
  onRestore?: () => void;
}

export function ChatConversationItem({
  conversation,
  isActive,
  isArchived = false,
  onClick,
  onDelete,
  onArchive,
  onRestore
}: ChatConversationItemProps) {
  const modeBadgeClass = getModeBadgeClass(typeof conversation.mode === 'string' 
    ? stringToChatMode(conversation.mode) 
    : conversation.mode);

  return (
    <div
      className={cn(
        "flex items-center justify-between p-2 rounded-md",
        isActive ? "bg-primary/20" : "hover:bg-accent/50",
        isArchived && "opacity-70"
      )}
    >
      <div 
        className="flex items-center gap-2 flex-1 overflow-hidden cursor-pointer" 
        onClick={onClick}
      >
        <div className={cn("w-2 h-2 rounded-full", modeBadgeClass)} />
        <span className="text-sm truncate">{conversation.title}</span>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {isArchived ? (
            <DropdownMenuItem onClick={onRestore}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Restore
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={onArchive}>
              <Archive className="h-4 w-4 mr-2" />
              Archive
            </DropdownMenuItem>
          )}
          <DropdownMenuItem 
            className="text-destructive focus:text-destructive" 
            onClick={onDelete}
          >
            <TrashIcon className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function getModeBadgeClass(mode: ChatMode): string {
  switch (mode) {
    case ChatMode.Chat:
      return "bg-blue-500";
    case ChatMode.Dev:
      return "bg-green-500";
    case ChatMode.Image:
      return "bg-purple-500";
    case ChatMode.Training:
      return "bg-yellow-500";
    case ChatMode.Editor:
      return "bg-orange-500";
    default:
      return "bg-gray-500";
  }
}
