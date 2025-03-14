
import React from "react";
import { X } from "lucide-react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader,
  SheetTitle,
  SheetClose 
} from "@/components/ui/sheet";
import { MobileNavBar } from "./MobileNavBar";
import { Button } from "@/components/ui/button";

interface MobileMenuDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MobileMenuDrawer = ({ open, onOpenChange }: MobileMenuDrawerProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="left" 
        className="w-[85%] max-w-[400px] border-r border-neon-blue/20 bg-dark-lighter/95 backdrop-blur-xl p-0"
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
        <MobileNavBar />
      </SheetContent>
    </Sheet>
  );
};
