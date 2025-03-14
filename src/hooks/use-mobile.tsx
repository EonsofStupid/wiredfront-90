
import * as React from "react"

// Common breakpoints
export const BREAKPOINTS = {
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

export type ScreenSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)
  const [screenSize, setScreenSize] = React.useState<ScreenSize | undefined>(undefined)

  React.useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < BREAKPOINTS.md)
      
      // Determine screen size
      if (width < BREAKPOINTS.sm) {
        setScreenSize('xs')
      } else if (width < BREAKPOINTS.md) {
        setScreenSize('sm')
      } else if (width < BREAKPOINTS.lg) {
        setScreenSize('md')
      } else if (width < BREAKPOINTS.xl) {
        setScreenSize('lg')
      } else if (width < BREAKPOINTS["2xl"]) {
        setScreenSize('xl')
      } else {
        setScreenSize('2xl')
      }
    }

    // Initial check
    handleResize()
    
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return {
    isMobile: !!isMobile,
    screenSize,
    isXs: screenSize === 'xs',
    isSm: screenSize === 'sm',
    isMd: screenSize === 'md',
    isLg: screenSize === 'lg',
    isXl: screenSize === 'xl',
    is2xl: screenSize === '2xl',
  }
}
