
import React from "react";
import { MobileApp } from "./MobileApp";
import { useIsMobile } from "@/hooks/use-mobile";

/**
 * Mobile entry point that serves as the gateway to the mobile experience
 * This component decides whether to render the mobile app or return null
 */
export const MobileExperience = () => {
  const { isMobile } = useIsMobile();
  
  // Only render the mobile app on mobile devices
  if (!isMobile) return null;
  
  return <MobileApp />;
};

export default MobileExperience;
