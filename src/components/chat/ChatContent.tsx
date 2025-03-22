import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat } from "@/hooks/useChat";
import { ChatMessage } from "./ChatMessage";
import { GitHubSyncModule } from "./modules/GitHubSyncModule";
import { NotificationsModule } from "./modules/NotificationsModule";
import { RAGModule } from "./modules/RAGModule";

export function ChatContent() {
  const { messages, currentSession } = useChat();

  if (!currentSession) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 text-center text-muted-foreground">
        <p>Start a new conversation with the AI assistant.</p>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 text-center text-muted-foreground">
        <p>Send a message to start chatting.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <GitHubSyncModule />
          <NotificationsModule />
          <RAGModule />
        </div>
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
          />
        ))}
      </div>
    </ScrollArea>
  );
}

export default ChatContent;
