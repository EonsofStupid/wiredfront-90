
import React, { createContext, useContext, useState } from "react";
import { MobileMenu } from "../components/menu/MobileMenu";

type MobileMenuContextType = {
  isMenuOpen: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
};

const MobileMenuContext = createContext<MobileMenuContextType | undefined>(undefined);

/**
 * Provider for mobile menu state and functionality
 */
export const MobileMenuProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => setIsMenuOpen(prev => !prev);
  const closeMenu = () => setIsMenuOpen(false);
  
  return (
    <MobileMenuContext.Provider value={{ isMenuOpen, toggleMenu, closeMenu }}>
      {children}
      <MobileMenu isOpen={isMenuOpen} onClose={closeMenu} />
    </MobileMenuContext.Provider>
  );
};

export const useMobileMenu = (): MobileMenuContextType => {
  const context = useContext(MobileMenuContext);
  if (!context) {
    throw new Error("useMobileMenu must be used within a MobileMenuProvider");
  }
  return context;
};
