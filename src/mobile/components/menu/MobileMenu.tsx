
import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { MobileNavigation } from "./MobileNavigation";
import { Button } from "@/components/ui/button";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Mobile slide-in menu component
 */
export const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  // Add escape key handler
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    
    // Lock body scroll when menu is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[var(--mobile-z-index-menu)] bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div 
        className={cn(
          "fixed top-0 left-0 h-full w-4/5 max-w-xs bg-dark-lighter",
          "border-r border-neon-blue/20 shadow-lg",
          "transform transition-transform duration-300 ease-in-out",
          "flex flex-col",
          isOpen ? "translate-x-0 mobile-slide-in-left" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-neon-blue/20">
          <h2 className="gradient-text text-xl font-bold">wiredFRONT</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-neon-pink hover:text-neon-blue"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <MobileNavigation onItemClick={onClose} />
        </div>
      </div>
    </div>
  );
};
