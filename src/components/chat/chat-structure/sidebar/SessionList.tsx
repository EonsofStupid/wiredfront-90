import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowUpRight, Archive, MoreVertical, Trash2, Undo } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Conversation } from '../../types/conversation-types';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface SessionListProps {
  isLoading: boolean;
  activeConversations: Conversation[];
  archivedConversations: Conversation[];
  isOpen: boolean;
  currentSessionId: string | null;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
  onArchiveSession: (id: string) => void;
  onRestoreSession: (id: string) => void;
}

export const SessionList = ({
  isLoading,
  activeConversations,
  archivedConversations,
  isOpen,
  currentSessionId,
  onSelectSession,
  onDeleteSession,
  onArchiveSession,
  onRestoreSession
}: SessionListProps) => {

  if (!isOpen) return null;
  
  if (isLoading) {
    return (
      <div className="p-4 space-y-3">
        <Skeleton className="h-12 w-full rounded-md" />
        <Skeleton className="h-12 w-full rounded-md" />
        <Skeleton className="h-12 w-full rounded-md" />
      </div>
    );
  }

  const hasActiveConversations = activeConversations.length > 0;
  const hasArchivedConversations = archivedConversations.length > 0;

  return (
    <ScrollArea className="flex-1 overflow-auto">
      {hasActiveConversations ? (
        <div className="p-2 space-y-2">
          <div className="px-1 py-1 text-xs text-muted-foreground">
            Active Conversations
          </div>
          
          {activeConversations.map((conversation) => (
            <div 
              key={conversation.id}
              className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-accent/50 transition-colors ${
                currentSessionId === conversation.id ? 'bg-accent' : ''
              }`}
              onClick={() => onSelectSession(conversation.id)}
            >
              <div className="flex-1 truncate">
                <div className="text-sm font-medium truncate">
                  {conversation.title || `Conversation ${conversation.id.substring(0, 6)}`}
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(conversation.last_accessed), { addSuffix: true })}
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onArchiveSession(conversation.id)}>
                    <Archive className="h-4 w-4 mr-2" /> Archive
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDeleteSession(conversation.id)}>
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 text-center">
          <p className="text-sm text-muted-foreground">No active conversations</p>
        </div>
      )}
      
      {hasArchivedConversations && (
        <div className="p-2 space-y-2">
          <div className="px-1 py-2 text-xs text-muted-foreground border-t">
            Archived Conversations
          </div>
          
          {archivedConversations.map((conversation) => (
            <div 
              key={conversation.id}
              className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-accent/50 transition-colors opacity-70"
            >
              <div 
                className="flex-1 truncate"
                onClick={() => onSelectSession(conversation.id)}
              >
                <div className="text-sm font-medium truncate">
                  {conversation.title || `Conversation ${conversation.id.substring(0, 6)}`}
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(conversation.last_accessed), { addSuffix: true })}
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onRestoreSession(conversation.id)}>
                    <Undo className="h-4 w-4 mr-2" /> Restore
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDeleteSession(conversation.id)}>
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      )}
    </ScrollArea>
  );
};
