import { DraggableChat } from "@/components/chat/DraggableChat";
import { DebugMenuIcon } from "@/components/debug/DebugMenuIcon";
import { SetupWizard } from "@/components/setup/SetupWizard";

export default function Index() {
  return (
    <div className="relative min-h-screen">
      <div className="fixed top-4 right-4 z-[var(--z-floating)]">
        {process.env.NODE_ENV === 'development' && <DebugMenuIcon />}
      </div>
      <SetupWizard />
      <DraggableChat />
    </div>
  );
}