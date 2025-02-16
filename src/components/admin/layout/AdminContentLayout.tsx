
import React from "react";
import { AdminExtendableNav } from "../navigation/AdminExtendableNav";

interface AdminContentLayoutProps {
  children: React.ReactNode;
}

export const AdminContentLayout = ({ children }: AdminContentLayoutProps) => {
  return (
    <div className="min-h-screen w-full bg-background">
      <AdminExtendableNav />
      <main className="pt-16 pb-12 px-4">
        {children}
      </main>
    </div>
  );
};
