
import { useDraggable } from "@dnd-kit/core";
import { memo, useEffect, useRef } from "react";
import { useChatStore } from "../store/chatStore";
import type { ChatContainerProps } from "../types";
import { Messages } from "./Messages";
import { XCircle, Minimize, ArrowDownUp } from "lucide-react";

function ChatContainerBase({ scrollRef, isEditorPage }: ChatContainerProps) {
  const chatRef = useRef<HTMLDivElement>(null);
  const { docked, isHidden, toggleChat, toggleMinimize, isMinimized } = useChatStore();

  useEffect(() => {
    console.log("ChatContainer mounted with state:", { docked, isHidden, isMinimized });
  }, [docked, isHidden, isMinimized]);

  // Configure draggable functionality
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
        zIndex: `var(--z-chat-container)`,
      }
    : {
        zIndex: `var(--z-chat-container)`,
      };

  return (
    <div
      ref={(el) => {
        chatRef.current = el;
        setNodeRef(el);
      }}
      className={`chat-container chat-glass ${isMinimized ? 'chat-minimized' : ''}`}
      style={style}
      {...attributes}
      {...listeners}
      data-testid="chat-container"
    >
      <div className="chat-header">
        <h3 className="chat-title">Chat</h3>
        <div className="chat-controls">
          <button 
            className="chat-control-button" 
            onClick={() => toggleMinimize()}
            aria-label={isMinimized ? "Expand" : "Minimize"}
          >
            <Minimize className="h-4 w-4" />
          </button>
          <button 
            className="chat-control-button" 
            onClick={() => toggleChat()}
            aria-label="Close"
          >
            <XCircle className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div ref={scrollRef} className="chat-messages-container">
        <Messages />
      </div>
      
      {!isMinimized && (
        <div className="chat-input-container">
          <textarea
            className="chat-input"
            placeholder="Type a message..."
            rows={1}
          />
          <button className="chat-send-button">
            Send
          </button>
        </div>
      )}
    </div>
  );
}

export const ChatContainer = memo(ChatContainerBase);
