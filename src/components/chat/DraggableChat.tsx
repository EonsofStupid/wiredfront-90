import React from "react";
import { Button } from "@/components/ui/button";
import { ActionItem } from "@/types/chat"; // Ensure this type is defined as below or adjust accordingly:
// export interface ActionItem {
//   id: string;
//   icon: React.ForwardRefExoticComponent<any>;
//   label: string;
//   onClick: () => void;
//   variant: "success" | "warning" | "secondary" | "ghost" | "primary" | "danger";
//   glow?: boolean;
// }
import { Check, X } from "lucide-react";

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
      variant: "primary", // must be one of the allowed literal types
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
    <div ref={scrollRef} className="draggable-chat-container p-4 border rounded shadow">
      {/* Render action items */}
      <div className="flex gap-2 mb-4">
        {actionItems.map(item => (
          <Button key={item.id} variant={item.variant} onClick={item.onClick}>
            {item.label}
          </Button>
        ))}
      </div>
      {/* Chat container content */}
      <div>
        <p>Chat content goes here...</p>
      </div>
    </div>
  );
}

export default DraggableChatContainer;
