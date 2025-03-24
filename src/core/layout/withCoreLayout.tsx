
import React, { useEffect, useState } from 'react';
import { CoreLayout } from './CoreLayout';
import { useLocation } from 'react-router-dom';

/**
 * Higher-order component to wrap any page component with the CoreLayout
 * @param Component - The page component to wrap
 * @returns A new component with CoreLayout
 */
export function withCoreLayout<P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> {
  const WrappedComponent: React.FC<P> = (props) => {
    return (
      <CoreLayout>
        <Component {...props} />
      </CoreLayout>
    );
  };

  // Set display name for debugging
  const displayName = Component.displayName || Component.name || 'Component';
  WrappedComponent.displayName = `withCoreLayout(${displayName})`;

  return WrappedComponent;
}

/**
 * Hook to ensure that the current page uses CoreLayout
 * Can be used in page components to check if they're rendered inside CoreLayout
 * @returns Boolean indicating if current route is using CoreLayout
 */
export function useEnsureCoreLayout(): boolean {
  const location = useLocation();
  const [hasLayout, setHasLayout] = useState(false);
  
  useEffect(() => {
    // Check if we're inside a CoreLayout by looking for the container element
    const hasLayoutElement = !!document.querySelector('.wf-core-layout-container');
    setHasLayout(hasLayoutElement);
    
    if (!hasLayoutElement) {
      console.warn(`Page at ${location.pathname} is not using CoreLayout`);
    }
  }, [location.pathname]);
  
  return hasLayout;
}
