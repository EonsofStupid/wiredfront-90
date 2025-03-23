import { logger } from "@/services/chat/LoggingService";
import { useDraggable } from "@dnd-kit/core";
import React, { memo, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useChatMode } from "../providers/ChatModeProvider";
import { useChatStore } from "../store/chatStore";
import { ChatFooter } from "./ChatFooter";
import { ChatHeader } from "./ChatHeader";
import { ChatInput } from "./ChatInput";
import { ChatMessages } from "./ChatMessages";

interface ChatContainerBaseProps {
  scrollRef: React.RefObject<HTMLDivElement>;
  isEditorPage: boolean;
}

function ChatContainerBase({
  scrollRef,
  isEditorPage,
}: ChatContainerBaseProps) {
  const { mode } = useChatMode();
  const chatRef = useRef<HTMLDivElement>(null);
  const {
    isMinimized,
    showSidebar,
    toggleSidebar,
    toggleMinimize,
    toggleChat,
    docked,
    position,
  } = useChatStore();
  const prevPosition = useRef(position);
  const location = useLocation();

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

  // Handle position change and viewport boundaries
  useEffect(() => {
    if (!chatRef.current || docked) return;

    const updatePosition = () => {
      if (!chatRef.current) return;
      const rect = chatRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let transformX = 0;
      let transformY = 0;

      // Horizontal bounds
      if (rect.right > viewportWidth) {
        transformX = viewportWidth - rect.right - 20;
      } else if (rect.left < 0) {
        transformX = Math.abs(rect.left) + 20;
      }

      // Vertical bounds
      if (rect.bottom > viewportHeight) {
        transformY = viewportHeight - rect.bottom - 20;
      } else if (rect.top < 0) {
        transformY = Math.abs(rect.top) + 20;
      }

      if (transformX !== 0 || transformY !== 0) {
        chatRef.current.style.transform = `translate3d(${transformX}px, ${transformY}px, 0)`;
        logger.info("Chat position adjusted to fit viewport", {
          transformX,
          transformY,
        });
      }
    };

    updatePosition();

    // Performance optimization: Use passive listener
    window.addEventListener("resize", updatePosition, { passive: true });
    return () => window.removeEventListener("resize", updatePosition);
  }, [docked]);

  // Log position changes
  useEffect(() => {
    if (prevPosition.current !== position) {
      logger.info("Chat position changed", {
        from: prevPosition.current,
        to: position,
      });
      prevPosition.current = position;
    }
  }, [position]);

  // Determine the title based on the current mode
  const title =
    mode === "editor"
      ? "Code Assistant"
      : mode === "chat-only"
      ? "Context Planning"
      : "Chat";

  // Stop propagation for clicks inside the chat window
  const handleContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="chat-container chat-glass">
      <ChatHeader />

      <div ref={scrollRef} className="chat-messages-container">
        <ChatMessages />
      </div>

      {!isMinimized && (
        <>
          <ChatInput />
          <ChatFooter />
        </>
      )}
    </div>
  );
}

// Optimize with memo to prevent unnecessary re-renders
export const ChatContainer = memo(ChatContainerBase);
