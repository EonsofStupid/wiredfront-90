import { Sidebar } from "@/components/ui/sidebar";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { FileBar } from "@/components/layout/FileBar";
import { StatusBar } from "@/components/layout/StatusBar";
import { TopBar } from "@/components/layout/TopBar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="h-screen flex flex-col">
      <TopBar />
      <div className="flex-1 flex">
        <FileBar position="left" />
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <Sidebar />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={80}>
            <div className="h-full overflow-auto">
              {children}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
        <FileBar position="right" />
      </div>
      <StatusBar />
    </div>
  );
};