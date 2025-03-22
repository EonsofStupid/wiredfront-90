
import { DraggableChat } from '@/components/chat';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Welcome to WiredFront</h1>
      <p className="text-lg">Your AI-powered development platform</p>
      
      <DraggableChat />
    </main>
  );
}
