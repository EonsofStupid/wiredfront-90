import { ChatClient } from "@/components/chat/ChatClient";

const Index = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="gradient-text mb-8 text-center text-4xl font-bold">
        Real-time Chat
      </h1>
      <ChatClient />
    </div>
  );
};

export default Index;