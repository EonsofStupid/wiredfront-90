import React from "react";
import { TopBar } from "./TopBar";
import { Sidebar } from "./Sidebar";
import { BottomBar } from "./BottomBar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="h-screen w-full grid grid-cols-[auto_1fr] grid-rows-[auto_1fr_auto]">
      <TopBar className="col-span-2" />
      <Sidebar />
      <main className="overflow-auto p-6 bg-dark">{children}</main>
      <BottomBar className="col-span-2" />
    </div>
  );
};