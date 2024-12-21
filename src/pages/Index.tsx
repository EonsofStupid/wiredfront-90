import { DraggableChat } from "@/components/chat/DraggableChat";
import { CacheMetricsPanel } from "@/components/debug/CacheMetricsPanel";
import { SetupWizard } from "@/components/setup/SetupWizard";

export default function Index() {
  return (
    <div className="relative min-h-screen">
      <SetupWizard />
      <DraggableChat />
      {process.env.NODE_ENV === 'development' && <CacheMetricsPanel />}
    </div>
  );
}