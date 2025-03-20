import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Edit2, Trash2 } from 'lucide-react';
import React from 'react';
import type { ChatSession } from '../../types';

interface SessionItemProps {
  session: ChatSession;
  isActive: boolean;
  onSelect: (session: ChatSession) => void;
  onEdit: (session: ChatSession) => void;
  onDelete: (session: ChatSession) => void;
}

export const SessionItem: React.FC<SessionItemProps> = ({
  session,
  isActive,
  onSelect,
  onEdit,
  onDelete,
}) => {
  const formattedDate = new Date(session.createdAt).toLocaleDateString();

  return (
    <div
      className={cn(
        'group flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-accent',
        isActive && 'bg-accent'
      )}
      onClick={() => onSelect(session)}
    >
      <div className="flex-1 min-w-0">
        <h3 className="font-medium truncate">{session.title}</h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{session.mode}</span>
          <span>•</span>
          <span>{formattedDate}</span>
        </div>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(session);
          }}
          title="Edit Session"
        >
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(session);
          }}
          title="Delete Session"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
