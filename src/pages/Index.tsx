import { DraggableChat } from "@/components/chat/DraggableChat";
import { CacheMetricsPanel } from "@/components/debug/CacheMetricsPanel";

export default function Index() {
  return (
    <div className="relative min-h-screen">
      <DraggableChat />
      {process.env.NODE_ENV === 'development' && <CacheMetricsPanel />}
    </div>
  );
}