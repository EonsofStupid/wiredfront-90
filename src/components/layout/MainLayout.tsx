import React, { useState } from "react";
import { TopBar } from "./TopBar";
import { Sidebar } from "./Sidebar";
import { BottomBar } from "./BottomBar";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const [isCompact, setIsCompact] = useState(false);

  return (
    <div className="h-screen w-full grid grid-rows-[auto_1fr_auto]">
      <TopBar 
        className="w-full" 
        isCompact={isCompact} 
        onToggleCompact={() => setIsCompact(!isCompact)} 
      />
      <div className="grid grid-cols-[auto_1fr_auto] overflow-hidden">
        <Sidebar side="left" isCompact={isCompact} />
        <main className="overflow-auto p-6 bg-dark">{children}</main>
        <Sidebar side="right" isCompact={isCompact} />
      </div>
      <BottomBar className="w-full" />
    </div>
  );
};