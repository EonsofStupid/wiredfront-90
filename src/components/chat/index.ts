// Export ChatContainer and related components
export { default as ChatContainer } from "./ChatContainer";

// Export other components
export * from "./ChatContent";
export * from "./ChatHeader";
export * from "./ChatInputArea";
export * from "./ui/ChatButton";

// Re-export hook for easy access
export { useChat } from "@/hooks/useChat";
