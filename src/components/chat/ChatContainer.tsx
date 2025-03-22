import { useChat } from "@/hooks/useChat";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { ChatContent } from "./ChatContent";
import { ChatHeader } from "./ChatHeader";
import { ChatInputArea } from "./ChatInputArea";
import styles from "./styles/container.module.css";
import { ChatButton } from "./ui/ChatButton";

export function ChatContainer() {
  const {
    isOpen,
    toggleOpen,
    isMinimized,
    docked,
    position,
    scale,
    setPosition,
  } = useChat();

  // Load position from store on mount
  useEffect(() => {
    const savedPosition = localStorage.getItem("chatPosition");
    if (savedPosition) {
      try {
        const positionData = JSON.parse(savedPosition);
        if (positionData) {
          setPosition(positionData);
        }
      } catch (error) {
        console.error("Failed to parse saved chat position", { error });
      }
    }
  }, [setPosition]);

  // Save position to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("chatPosition", JSON.stringify(position));
  }, [position]);

  const togglePosition = () => {
    setPosition({
      x: position.x > window.innerWidth / 2 ? 0 : window.innerWidth,
      y: position.y,
    });
  };

  if (!isOpen) {
    return (
      <ChatButton position={position} scale={scale} onClick={toggleOpen} />
    );
  }

  // Determine position class based on position state
  const dockPosition =
    position.x > window.innerWidth / 2 ? "bottom-right" : "bottom-left";

  return (
    <div>
      <motion.div
        className={cn(
          styles.chatContainerWrapper,
          docked && styles.chatDocked,
          dockPosition === "bottom-right"
            ? styles.chatDockRight
            : styles.chatDockLeft
        )}
        style={{
          transform: `scale(${scale})`,
        }}
        animate={{
          scale: scale,
          transition: { duration: 0.3, ease: "easeOut" },
        }}
      >
        <div
          className={cn(
            styles.chatContainer,
            styles.chatGlassCard,
            !docked && styles.chatFloating,
            isMinimized && styles.chatMinimized
          )}
        >
          <ChatHeader onPositionToggle={togglePosition} />

          {!isMinimized && (
            <div className={styles.chatContentWrapper}>
              <ChatContent />
            </div>
          )}

          {!isMinimized && <ChatInputArea />}
        </div>
      </motion.div>
    </div>
  );
}

export default ChatContainer;
