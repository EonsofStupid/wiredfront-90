
import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatSessionHeaderProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
}

export function ChatSessionHeader({ title, isOpen, onToggle }: ChatSessionHeaderProps) {
  return (
    <div className="flex justify-between items-center p-2 border-b">
      <h3 className="text-sm font-medium">Conversations</h3>
      <Button variant="ghost" size="sm" onClick={onToggle} className="h-8 w-8 p-0">
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </Button>
    </div>
  );
}
