import { cn } from "@/lib/utils";
import { useAtomValue } from "jotai";
import React from "react";
import { layoutPreferencesAtom } from "../store/atoms";
import styles from "./ChatContainer.module.css";

interface ChatContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  children,
  className,
}) => {
  const { isMinimized } = useAtomValue(layoutPreferencesAtom);

  return (
    <div
      className={cn(
        styles.container,
        isMinimized ? styles.minimized : styles.expanded,
        className
      )}
    >
      {children}
    </div>
  );
};
