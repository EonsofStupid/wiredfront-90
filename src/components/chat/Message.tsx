
import React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Check, Clock, AlertCircle } from "lucide-react";

interface MessageProps {
  content: string;
  role: 'user' | 'assistant' | 'system';
  status?: 'pending' | 'sent' | 'failed';
}

export function Message({ content, role, status = 'sent' }: MessageProps) {
  return (
    <div
      className={cn(
        "flex w-full",
        role === "user" ? "justify-end" : "justify-start"
      )}
    >
      <Card
        className={cn(
          "max-w-[80%] px-4 py-2 shadow-sm transition-all duration-200",
          role === "user" 
            ? "bg-primary text-primary-foreground" 
            : role === "system"
            ? "bg-muted text-muted-foreground italic"
            : "bg-secondary text-secondary-foreground",
          status === 'failed' && "border-destructive"
        )}
      >
        <div className="flex items-start gap-2">
          <p className="text-sm leading-relaxed break-words">{content}</p>
          <span className="ml-2 flex h-4 w-4 items-center justify-center">
            {status === 'pending' && (
              <Clock className="h-3 w-3 animate-pulse" />
            )}
            {status === 'sent' && (
              <Check className="h-3 w-3" />
            )}
            {status === 'failed' && (
              <AlertCircle className="h-3 w-3 text-destructive" />
            )}
          </span>
        </div>
      </Card>
    </div>
  );
}
