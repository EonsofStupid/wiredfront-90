import { useState } from "react";
import { Menu, Search, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileMenuDrawer } from "./MobileMenuDrawer";
import { useUIStore } from '@/stores/ui/store';

export const MobileHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toggleRightSidebar } = useUIStore();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-16 bg-dark-lighter/80 backdrop-blur-md border-b border-neon-blue/20 z-[var(--z-navbar)]">
        <div className="flex items-center justify-between px-4 h-full">
          <Button 
            variant="ghost" 
            size="icon"
            className="text-neon-pink hover:text-neon-blue"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <h1 className="gradient-text text-xl font-bold">wiredFRONT</h1>

          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              className="text-neon-pink hover:text-neon-blue"
              onClick={() => toggleRightSidebar()}
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="text-neon-pink hover:text-neon-blue"
            >
              <Bell className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
      
      <MobileMenuDrawer 
        open={isMenuOpen} 
        onOpenChange={setIsMenuOpen}
      />
    </>
  );
};
