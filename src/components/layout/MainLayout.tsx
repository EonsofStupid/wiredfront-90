import React, { useState } from "react";
import { TopBar } from "./TopBar";
import { Sidebar } from "./Sidebar";
import { BottomBar } from "./BottomBar";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  console.log("MainLayout rendering");
  const [isCompact, setIsCompact] = useState(false);

  return (
    <div className="min-h-screen w-full bg-background">
      <TopBar 
        className="fixed top-0 left-0 right-0 z-[var(--z-navbar)]" 
        isCompact={isCompact} 
        onToggleCompact={() => setIsCompact(!isCompact)} 
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
          "mr-32"
        )}>
          {children}
        </main>
        
        <Sidebar 
          side="right" 
          isCompact={isCompact}
          className="fixed right-0 top-16 bottom-12 z-[var(--z-navbar)]" 
        />
      </div>
      
      <BottomBar className="fixed bottom-0 left-0 right-0 z-[var(--z-navbar)]" />
    </div>
  );
};