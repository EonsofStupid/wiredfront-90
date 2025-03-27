
import React from 'react';
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/chat/shared/Spinner";
import { useConversationStore } from '@/components/chat/store/conversation';
import { useChatStore } from '@/components/chat/store/chatStore';

type StatusButtonProps = {
  variant?: "outline" | "ghost";
  withLabel?: boolean;
  size?: "sm" | "default";
};

export function StatusButton({ variant = "outline", withLabel = false, size = "default" }: StatusButtonProps) {
  const { isLoading: conversationsLoading } = useConversationStore();
  const { 
    ui: { 
      messageLoading,
      providerLoading,
      sessionLoading 
    } 
  } = useChatStore();
  
  const isLoading = conversationsLoading || messageLoading || providerLoading || sessionLoading;
  const sizeClass = size === "sm" ? "h-7 px-2 text-xs" : "";
  
  return (
    <Button
      variant={variant}
      className={`relative ${sizeClass}`}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Spinner size="sm" />
          {withLabel && <span className="ml-2">Processing...</span>}
        </>
      ) : (
        <>
          <span className="h-2 w-2 rounded-full bg-green-500"></span>
          {withLabel && <span className="ml-2">Ready</span>}
        </>
      )}
    </Button>
  );
}
