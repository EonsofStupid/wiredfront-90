
import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatConversationHeaderProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
}

export function ChatConversationHeader({ title, isOpen, onToggle }: ChatConversationHeaderProps) {
  return (
    <div className="flex justify-between items-center p-2 border-b">
      <h3 className="text-sm font-medium">Conversations</h3>
      <Button variant="ghost" size="sm" onClick={onToggle} className="h-8 w-8 p-0">
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </Button>
    </div>
  );
}
