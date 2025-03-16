
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SessionItemProps {
  id: string;
  lastAccessed: Date;
  isActive: boolean;
  onSelect: (sessionId: string) => void;
  provider?: string;
  messageCount?: number;
}

const SessionItem: React.FC<SessionItemProps> = ({
  id,
  lastAccessed,
  isActive,
  onSelect,
  provider,
  messageCount
}) => {
  const handleClick = () => {
    onSelect(id);
  };
  
  return (
    <div 
      className={cn(
        "flex items-start gap-3 p-3 rounded-md cursor-pointer transition-colors",
        isActive 
          ? "bg-primary/10 hover:bg-primary/15 border-l-2 border-primary" 
          : "hover:bg-muted/50 border-l-2 border-transparent"
      )}
      onClick={handleClick}
      data-active={isActive}
      data-session-id={id}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="font-medium text-sm truncate">
            Session {id.substring(0, 8)}
          </div>
          {provider && (
            <Badge variant="outline" className="text-[10px] h-5">
              {provider}
            </Badge>
          )}
        </div>
        
        <div className="mt-1 flex items-center justify-between text-muted-foreground text-xs">
          <span>
            {formatDistanceToNow(lastAccessed, { addSuffix: true })}
          </span>
          
          {messageCount !== undefined && messageCount > 0 && (
            <div className="flex items-center gap-1">
              <MessageCircle className="h-3 w-3" />
              <span>{messageCount}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionItem;
