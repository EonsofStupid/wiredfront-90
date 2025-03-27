import React from "react";
import { CoreLayoutContainer } from "../CoreLayoutContainer";
import { CoreTopBar } from "../CoreTopBar";
import { CoreBottomBar } from "../CoreBottomBar";
import { useUIStore } from '@/stores/ui/store';

/**
 * Example of a custom layout that uses core components
 * but with a different structure than the default
 */
export function CustomLayout({ children }: { children: React.ReactNode }) {
  const { layout, toggleSidebar } = useUIStore();
  const isCompact = !layout.sidebarExpanded;

  return (
    <CoreLayoutContainer>
      {/* We use the core TopBar but adjust its position */}
      <CoreTopBar 
        className="sticky top-0" 
        isCompact={isCompact} 
        onToggleCompact={toggleSidebar} 
      />
      
      {/* Custom main content area with different padding */}
      <main className="min-h-[calc(100vh-8rem)] p-8">
        {children}
      </main>
      
      {/* We use the core BottomBar but adjust its position */}
      <CoreBottomBar className="sticky bottom-0" />
    </CoreLayoutContainer>
  );
}
