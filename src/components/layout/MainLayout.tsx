import React from "react";
import { TopBar } from "./TopBar";
import { Sidebar } from "./Sidebar";
import { BottomBar } from "./BottomBar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="h-screen w-full grid grid-cols-[16rem_1fr_16rem] grid-rows-[auto_1fr_auto]">
      <TopBar className="col-span-3" />
      <Sidebar side="left" />
      <main className="overflow-auto p-6 bg-dark">{children}</main>
      <Sidebar side="right" />
      <BottomBar className="col-span-3" />
    </div>
  );
};