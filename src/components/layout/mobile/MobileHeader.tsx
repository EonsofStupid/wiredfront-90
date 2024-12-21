import { Menu, Search, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MobileNavBar } from "./MobileNavBar";

export const MobileHeader = () => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-dark-lighter/80 backdrop-blur-md border-b border-border z-50">
      <div className="flex items-center justify-between px-4 h-full">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <MobileNavBar />
          </SheetContent>
        </Sheet>

        <h1 className="gradient-text text-xl font-bold">wiredFRONT</h1>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};