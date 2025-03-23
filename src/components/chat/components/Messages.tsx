import { Message } from "../Message";
import { useChatStore } from "../store/chatStore";
import type { ChatMessage } from "../types";

export function Messages() {
  const { messages } = useChatStore();

  return (
    <div role="list" className="chat-messages">
      {messages.map((message: ChatMessage) => (
        <div key={message.id} role="listitem">
          <Message
            content={message.content}
            role={message.role}
            status={message.status}
            id={message.id}
            timestamp={message.timestamp}
          />
        </div>
      ))}
    </div>
  );
}
