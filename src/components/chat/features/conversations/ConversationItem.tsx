
import React from 'react';
import { MoreHorizontal, Edit2, Archive, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';

interface ConversationItemProps {
  id: string;
  title: string;
  date: Date;
  isActive: boolean;
  onClick: () => void;
  onArchive: () => void;
  onDelete: () => void;
  onEdit: () => void;
}

export function ConversationItem({
  id,
  title,
  date,
  isActive,
  onClick,
  onArchive,
  onDelete,
  onEdit
}: ConversationItemProps) {
  // Format the date
  const formattedDate = formatDistanceToNow(date, { addSuffix: true });
  
  // Prevent event bubbling for dropdown
  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  return (
    <div
      className={cn(
        "p-3 rounded-md flex justify-between items-center cursor-pointer transition-colors",
        isActive 
          ? "bg-primary/10 text-primary" 
          : "hover:bg-muted"
      )}
      onClick={onClick}
    >
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm truncate" title={title}>
          {title}
        </h3>
        <p className="text-xs text-muted-foreground">{formattedDate}</p>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={handleDropdownClick}>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
            <Edit2 className="h-4 w-4 mr-2" />
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onArchive} className="cursor-pointer">
            <Archive className="h-4 w-4 mr-2" />
            Archive
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={onDelete} 
            className="cursor-pointer text-destructive focus:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
