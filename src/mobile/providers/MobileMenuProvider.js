import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, useState } from "react";
import { MobileMenu } from "../components/menu/MobileMenu";
// Export the context so it can be imported in the hook
export const MobileMenuContext = createContext(undefined);
/**
 * Provider for mobile menu state and functionality
 */
export const MobileMenuProvider = ({ children }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => setIsMenuOpen(prev => !prev);
    const closeMenu = () => setIsMenuOpen(false);
    return (_jsxs(MobileMenuContext.Provider, { value: { isMenuOpen, toggleMenu, closeMenu }, children: [children, _jsx(MobileMenu, { isOpen: isMenuOpen, onClose: closeMenu })] }));
};
