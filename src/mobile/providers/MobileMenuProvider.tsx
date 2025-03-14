
import React, { createContext, useContext, useState } from "react";
import { MobileMenu } from "../components/menu/MobileMenu";

type MobileMenuContextType = {
  isMenuOpen: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
};

// Export the context so it can be imported in the hook
export const MobileMenuContext = createContext<MobileMenuContextType | undefined>(undefined);

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
