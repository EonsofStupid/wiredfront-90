
import React from "react";
import { CoreLayout } from "./CoreLayout";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileLayout } from "@/components/layout/MobileLayout";

/**
 * @name withCoreLayout
 * @description A higher-order component that wraps a component with the appropriate layout
 * based on the device type (mobile or desktop)
 */
export function withCoreLayout<P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> {
  const WithCoreLayout: React.FC<P> = (props) => {
    const { isMobile } = useIsMobile();

    if (isMobile) {
      return (
        <MobileLayout>
          <Component {...props} />
        </MobileLayout>
      );
    }

    return (
      <CoreLayout>
        <Component {...props} />
      </CoreLayout>
    );
  };

  WithCoreLayout.displayName = `withCoreLayout(${Component.displayName || Component.name || 'Component'})`;
  
  return WithCoreLayout;
}

/**
 * @name useEnsureCoreLayout
 * @description A hook that can be used to ensure a component is wrapped in the core layout
 * This is useful for components that may be used in different contexts
 */
export function useEnsureCoreLayout() {
  const layoutContainerRef = React.useRef<HTMLElement | null>(null);
  
  React.useEffect(() => {
    // Check if we're inside a core layout container
    const inCoreLayout = document.querySelector('.wf-core-layout-container');
    
    if (!inCoreLayout) {
      console.warn(
        'Component is not wrapped in CoreLayout. ' +
        'Please ensure that components are rendered within a CoreLayout or use withCoreLayout HOC.'
      );
    }
  }, []);
  
  return layoutContainerRef;
}
