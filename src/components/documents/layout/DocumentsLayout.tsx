import React from "react";
import { ExtendableTopNav } from "../navigation/ExtendableTopNav";

interface DocumentsLayoutProps {
  children: React.ReactNode;
}

export const DocumentsLayout = ({ children }: DocumentsLayoutProps) => {
  return (
    <div className="min-h-screen w-full bg-background">
      <ExtendableTopNav />
      <main className="pt-16 pb-12 px-4">
        {children}
      </main>
    </div>
  );
};