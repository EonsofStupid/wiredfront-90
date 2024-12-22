import { DraggableChat } from "@/components/chat/DraggableChat";
import { SetupWizard } from "@/components/setup/SetupWizard";

export default function Index() {
  return (
    <div className="relative min-h-screen">
      <SetupWizard />
      <DraggableChat />
    </div>
  );
}