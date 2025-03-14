
import React from "react";
import { TopBar } from "./TopBar";
import { Sidebar } from "./Sidebar";
import { ProjectOverview } from "./Sidebar/ProjectOverview";
import { BottomBar } from "./BottomBar";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const { layout, toggleSidebar } = useUIStore();
  const isCompact = layout.sidebarExpanded;
  const isRightSidebarVisible = layout.rightSidebarVisible;

  return (
    <div className="min-h-screen w-full bg-background">
      <TopBar 
        className="fixed top-0 left-0 right-0 z-[var(--z-navbar)]" 
        isCompact={isCompact} 
        onToggleCompact={toggleSidebar} 
      />
      
      <div className="flex pt-16 pb-12">
        <Sidebar 
          side="left" 
          isCompact={isCompact}
          className="fixed left-0 top-16 bottom-12 z-[var(--z-navbar)]" 
        />
        
        <main className={cn(
          "flex-1 transition-all duration-300 ease-in-out",
          isCompact ? "ml-20" : "ml-32",
          isRightSidebarVisible ? (isCompact ? "mr-64" : "mr-64") : "mr-0"
        )}>
          {children}
        </main>
        
        <div 
          className={cn(
            "fixed right-0 top-16 bottom-12 glass-card border-l border-neon-blue/20 transition-all duration-300",
            isRightSidebarVisible ? "translate-x-0" : "translate-x-full",
            "w-64"
          )}
          style={{ position: 'fixed', zIndex: 'var(--z-projecthub)' }}
        >
          <ProjectOverview isCompact={isCompact} className="h-full" />
        </div>
      </div>
      
      <BottomBar className="fixed bottom-0 left-0 right-0 z-[var(--z-navbar)]" />
    </div>
  );
}
