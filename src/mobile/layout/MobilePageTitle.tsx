
import React from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

/**
 * Dynamically displays the current page title based on route
 */
export const MobilePageTitle = () => {
  const location = useLocation();
  
  const getTitle = () => {
    const path = location.pathname;
    
    if (path === "/") return "Home";
    if (path === "/editor") return "Editor";
    if (path === "/documents") return "Documents";
    if (path === "/settings") return "Settings";
    
    // Extract title from path for other routes
    return path.split("/").pop()?.replace("-", " ") || "wiredFRONT";
  };
  
  return (
    <h1 className={cn(
      "gradient-text text-xl font-bold transition-all duration-300",
      "animate-fade-in" // Use animation
    )}>
      {getTitle()}
    </h1>
  );
};
