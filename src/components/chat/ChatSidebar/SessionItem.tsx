
import React from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface SessionItemProps {
  id: string;
  lastAccessed: Date;
  isActive: boolean;
  onSelect: (id: string) => void;
}

export const SessionItem = ({ id, lastAccessed, isActive, onSelect }: SessionItemProps) => {
  return (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      className="w-full justify-start gap-2 mb-1"
      onClick={() => onSelect(id)}
    >
      <MessageSquare className="h-4 w-4" />
      <span className="flex-1 text-left truncate">Session {id.slice(0, 8)}</span>
      <Clock className="h-4 w-4 opacity-50" />
      <span className="text-xs opacity-50">
        {formatDistanceToNow(new Date(lastAccessed), { addSuffix: true })}
      </span>
    </Button>
  );
};
