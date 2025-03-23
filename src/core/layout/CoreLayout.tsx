import { Chat } from "@/components/chat";
import { useUIStore } from "@/stores";
import { CoreBottomBar } from "./CoreBottomBar";
import { CoreLayoutContainer } from "./CoreLayoutContainer";
import { CoreLeftSidebar } from "./CoreLeftSidebar";
import { CoreMainContent } from "./CoreMainContent";
import { CoreRightSidebar } from "./CoreRightSidebar";
import { CoreTopBar } from "./CoreTopBar";
import { CoreLayoutProps } from "./types";

/**
 * @name CoreLayout
 * @description The main layout component that combines all core layout elements
 * DO NOT MODIFY THIS COMPONENT
 */
export function CoreLayout({ children }: CoreLayoutProps) {
  const { layout, toggleSidebar } = useUIStore();
  const isLeftSidebarCompact = !layout.sidebarExpanded;
  const isRightSidebarVisible = layout.rightSidebarVisible;

  return (
    <CoreLayoutContainer>
      <CoreTopBar
        className="fixed top-0 left-0 right-0"
        isCompact={isLeftSidebarCompact}
        onToggleCompact={toggleSidebar}
      />

      <div className="flex pt-16 pb-12">
        <CoreLeftSidebar
          isCompact={isLeftSidebarCompact}
          className="fixed left-0 top-16 bottom-12"
        />

        <CoreMainContent
          isLeftSidebarCompact={isLeftSidebarCompact}
          isRightSidebarVisible={isRightSidebarVisible}
        >
          {children}
        </CoreMainContent>

        <CoreRightSidebar
          isCompact={isLeftSidebarCompact}
          isVisible={isRightSidebarVisible}
        />
      </div>

      <CoreBottomBar className="fixed bottom-0 left-0 right-0" />
      <Chat />
    </CoreLayoutContainer>
  );
}
