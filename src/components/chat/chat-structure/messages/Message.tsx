import React, { useMemo } from 'react';
import { atom, useAtom } from 'jotai';
import { cn } from '@/lib/utils';
import { MessageRole, MessageStatus, MessageType } from '@/components/chat/types/chat-modes';
import { Spinner } from '@/components/chat/shared/Spinner';
import { Avatar } from '@/components/ui/avatar';
import { MessageActions } from './MessageActions';

interface MessageProps {
  id: string;
  role: MessageRole;
  content: string;
  type?: MessageType;
  status?: MessageStatus;
  isLoading?: boolean;
  timestamp?: string;
  onEdit?: (id: string, content: string) => void;
  onDelete?: (id: string) => void;
  onRetry?: (id: string) => void;
  className?: string;
}

// Create local atoms for component state
const createMessageAtoms = () => {
  const isExpandedAtom = atom(false);
  const isEditingAtom = atom(false);
  const editContentAtom = atom('');
  
  return {
    isExpandedAtom,
    isEditingAtom,
    editContentAtom,
  };
};

export const Message = ({
  id,
  role,
  content,
  type = MessageType.Text,
  status,
  isLoading = false,
  timestamp,
  onEdit,
  onDelete,
  onRetry,
  className,
}: MessageProps) => {
  // Create atoms for this specific message instance
  const atoms = useMemo(() => createMessageAtoms(), []);
  const [isExpanded, setIsExpanded] = useAtom(atoms.isExpandedAtom);
  const [isEditing, setIsEditing] = useAtom(atoms.isEditingAtom);
  const [editContent, setEditContent] = useAtom(atoms.editContentAtom);
  
  // Handle edit mode
  const handleEditStart = () => {
    setEditContent(content);
    setIsEditing(true);
  };
  
  const handleEditCancel = () => {
    setIsEditing(false);
    setEditContent('');
  };
  
  const handleEditSave = () => {
    if (onEdit) {
      onEdit(id, editContent);
    }
    setIsEditing(false);
  };
  
  // Role-based styling
  const isUser = role === MessageRole.User;
  const isSystem = role === MessageRole.System;
  
  const messageClasses = cn(
    'flex flex-col p-3 rounded-lg max-w-[90%] min-w-[200px]',
    isUser ? 'bg-primary text-primary-foreground self-end' : 'bg-muted',
    isSystem && 'bg-accent text-accent-foreground w-full max-w-full',
    className
  );
  
  // If the message is being loaded, show a skeleton
  if (isLoading) {
    return (
      <div className={messageClasses}>
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">
            {isUser ? 'You' : 'Assistant'}
          </div>
        </div>
        <div className="mt-2 space-y-2">
          <Spinner size="sm" />
        </div>
      </div>
    );
  }
  
  return (
    <div className={messageClasses} id={`message-${id}`}>
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">
          {isUser ? 'You' : 'Assistant'}
        </div>
        <div className="flex items-center space-x-2">
          {timestamp && (
            <span className="text-xs opacity-70">
              {new Date(timestamp).toLocaleTimeString()}
            </span>
          )}
          {!isSystem && (
            <MessageActions 
              id={id}
              onEdit={onEdit ? handleEditStart : undefined}
              onDelete={onDelete}
              onRegenerate={status === 'failed' || status === 'error' ? onRetry : undefined}
              messageRole={role}
            />
          )}
        </div>
      </div>
      
      <div className="mt-2">
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-2 border rounded min-h-[100px]"
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <button 
                onClick={handleEditCancel}
                className="px-3 py-1 text-sm rounded bg-muted hover:bg-muted/80"
              >
                Cancel
              </button>
              <button 
                onClick={handleEditSave}
                className="px-3 py-1 text-sm rounded bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="whitespace-pre-wrap break-words">
            {content}
          </div>
        )}
      </div>
    </div>
  );
};
