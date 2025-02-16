import React from "react";
import { UserMenu } from "@/components/user/UserMenu";

export function AdminHeader() {
  return (
    <header className="border-b border-border h-16 px-6 flex items-center justify-between bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <h1 className="text-xl font-semibold">Admin Dashboard</h1>
      <UserMenu />
    </header>
  );
}