
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminNavToggleProps {
  isExtended: boolean;
  onToggle: () => void;
}

export const AdminNavToggle = ({ isExtended, onToggle }: AdminNavToggleProps) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onToggle}
      className={cn(
        "absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[calc(100%-2px)]",
        "admin-nav-handle rounded-t-none rounded-b-lg",
        "border border-t-0 backdrop-blur-md",
        "w-12 h-6 p-0 flex items-center justify-center"
      )}
    >
      {isExtended ? (
        <ChevronUp className="h-4 w-4" />
      ) : (
        <ChevronDown className="h-4 w-4" />
      )}
    </Button>
  );
};
