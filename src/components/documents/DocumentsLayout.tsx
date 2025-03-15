
import React from "react";
import { ExtendableTopNav } from "./navigation/ExtendableTopNav";
import { CoreLayoutContainer } from "@/core/layout/CoreLayoutContainer"; 

interface DocumentsLayoutProps {
  children: React.ReactNode;
}

export const DocumentsLayout = ({ children }: DocumentsLayoutProps) => {
  return (
    <CoreLayoutContainer>
      <ExtendableTopNav />
      <main className="pt-16 pb-12 px-4">
        {children}
      </main>
    </CoreLayoutContainer>
  );
};
