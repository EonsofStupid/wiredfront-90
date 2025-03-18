
import React from "react";
import { Button } from "@/components/ui/button";
import { ActionItem } from "@/types/chat";
import { Check, X } from "lucide-react";
import { ActionIconStack } from "./ui/action-stack/ActionIconStack";

interface DraggableChatContainerProps {
  scrollRef: React.RefObject<HTMLDivElement>;
  isEditorPage: boolean;
}

export function DraggableChatContainer({ scrollRef, isEditorPage }: DraggableChatContainerProps) {
  // Example array of action items with variant values matching the allowed literals.
  const actionItems: ActionItem[] = [
    {
      id: "action1",
      icon: Check,
      label: "Confirm",
      onClick: () => {
        console.log("Confirmed");
      },
      variant: "primary",
      glow: true,
    },
    {
      id: "action2",
      icon: X,
      label: "Cancel",
      onClick: () => {
        console.log("Cancelled");
      },
      variant: "danger",
      glow: false,
    },
  ];

  return (
    <div ref={scrollRef} className="draggable-chat-container p-4 border rounded shadow relative">
      {/* Render action items using ActionIconStack */}
      <ActionIconStack 
        actions={actionItems}
        position="right"
        orientation="vertical"
        className="right-0 -translate-x-8 space-y-2"
        showLabels={true}
      />
      
      {/* Chat container content */}
      <div className="mt-4">
        <p>Chat content goes here...</p>
      </div>
    </div>
  );
}

export default DraggableChatContainer;
