
import { useContext } from "react";
import { MobileMenuContext } from "../providers/MobileMenuProvider";

/**
 * Hook to access and control the mobile menu
 */
export const useMobileMenu = () => {
  const context = useContext(MobileMenuContext);
  
  if (!context) {
    throw new Error("useMobileMenu must be used within a MobileMenuProvider");
  }
  
  return context;
};
