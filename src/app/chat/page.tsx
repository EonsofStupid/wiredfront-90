
import React from 'react';
import { ChatManager } from '@/components/chat/ChatManager';

export default function ChatPage() {
  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">Chat</h1>
      <ChatManager />
    </div>
  );
}
