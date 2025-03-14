
import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { MobileNavigation } from "./MobileNavigation";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Full-screen mobile menu with animated navigation items
 */
export const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="left" 
        className={cn(
          "w-full sm:w-[85%] max-w-[400px] border-r border-neon-blue/20",
          "bg-dark-lighter/95 backdrop-blur-xl p-0"
        )}
      >
        <SheetHeader className="p-4 border-b border-neon-blue/20">
          <div className="flex items-center justify-between">
            <SheetTitle className="gradient-text text-xl font-bold">
              wiredFRONT
            </SheetTitle>
            <SheetClose asChild>
              <Button variant="ghost" size="icon" className="text-neon-pink hover:text-neon-blue">
                <X className="h-5 w-5" />
              </Button>
            </SheetClose>
          </div>
        </SheetHeader>
        
        <MobileNavigation onItemClick={onClose} />
      </SheetContent>
    </Sheet>
  );
};
