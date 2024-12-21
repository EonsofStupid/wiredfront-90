import { Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  content: string;
  created_at: string;
}

interface ChatMessageListProps {
  messages: Message[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMoreMessages: boolean;
  onLoadMore: () => void;
  onScroll: (event: React.UIEvent<HTMLDivElement>) => void;
}

export const ChatMessageList = ({
  messages,
  isLoading,
  isLoadingMore,
  hasMoreMessages,
  onLoadMore,
  onScroll,
}: ChatMessageListProps) => {
  const lastMessageRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (lastMessageRef.current && !isLoadingMore) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length, isLoadingMore]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 p-4" onScroll={onScroll}>
      <div className="space-y-4">
        {isLoadingMore && (
          <div className="flex justify-center py-2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
        {messages.map((message, index) => (
          <div
            key={message.id}
            ref={index === messages.length - 1 ? lastMessageRef : null}
            className="bg-muted/50 rounded-lg p-3"
          >
            <p className="text-sm">{message.content}</p>
            <span className="text-xs text-muted-foreground">
              {new Date(message.created_at).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};