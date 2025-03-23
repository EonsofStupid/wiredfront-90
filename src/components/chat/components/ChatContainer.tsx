import { useDraggable } from "@dnd-kit/core";
import { memo, useRef } from "react";
import { useChatStore } from "../store/chatStore";
import type { ChatContainerProps } from "../types";
import { Messages } from "./Messages";

interface ExtendedChatContainerProps extends ChatContainerProps {
  isMinimized: boolean;
}

function ChatContainerBase({
  scrollRef,
  isEditorPage,
  isMinimized,
}: ExtendedChatContainerProps) {
  const chatRef = useRef<HTMLDivElement>(null);
  const { docked } = useChatStore();

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: "chat-window",
    disabled: docked,
  });

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
      className={`chat-container chat-glass ${isMinimized ? "minimized" : ""}`}
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
