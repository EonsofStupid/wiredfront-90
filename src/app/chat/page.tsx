import { DraggableChat } from '@/components/chat';

export default function ChatPage() {
  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">Chat</h1>
      <DraggableChat />
    </div>
  );
}
