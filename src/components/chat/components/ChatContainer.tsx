
import { useDraggable } from "@dnd-kit/core";
import { memo, useEffect, useRef } from "react";
import { useChatStore } from "../store/chatStore";
import type { ChatContainerProps } from "../types";
import { Messages } from "./Messages";

function ChatContainerBase({ scrollRef, isEditorPage }: ChatContainerProps) {
  const chatRef = useRef<HTMLDivElement>(null);
  const { docked, isHidden } = useChatStore();

  useEffect(() => {
    console.log("ChatContainer mounted", { docked, isHidden });
  }, [docked, isHidden]);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: "chat-window",
    disabled: docked,
  });

  // If chat is hidden, don't render the container
  if (isHidden) {
    console.log("Chat is hidden, not rendering container");
    return null;
  }

  const adjustedTransform =
    transform && !docked
      ? {
          x: transform.x,
          y: transform.y,
        }
      : undefined;

  const style = adjustedTransform
    ? {
        transform: `translate3d(${adjustedTransform.x}px, ${adjustedTransform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={(el) => {
        chatRef.current = el;
        setNodeRef(el);
      }}
      className="chat-container chat-glass"
      style={style}
      {...attributes}
      {...listeners}
    >
      <div ref={scrollRef} className="chat-messages-container">
        <Messages />
      </div>
    </div>
  );
}

export const ChatContainer = memo(ChatContainerBase);
