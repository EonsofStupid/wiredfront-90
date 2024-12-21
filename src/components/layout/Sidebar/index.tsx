import { cn } from "@/lib/utils";
import { Home, Settings, Activity, Code, Database } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from "react-router-dom";

interface SidebarProps {
  className?: string;
  side: "left" | "right";
  isCompact: boolean;
}

export const Sidebar = ({ className, side, isCompact }: SidebarProps) => {
  const navItems = side === "left" 
    ? [
        { icon: Home, label: "Home", path: "/" },
        { icon: Activity, label: "Analytics", path: "/analytics" },
        { icon: Code, label: "Editor", path: "/editor" },
      ]
    : [
        { icon: Database, label: "Data", path: "/data" },
        { icon: Settings, label: "Settings", path: "/settings" },
      ];

  return (
    <aside 
      className={cn(
        "glass-card border-neon-blue/20 transition-all duration-300",
        side === "left" ? "border-r" : "border-l",
        isCompact ? "w-20" : "w-64",
        className
      )}
    >
      <nav className="p-4 space-y-2">
        <TooltipProvider delayDuration={0}>
          {navItems.map((item) => (
            <Tooltip key={item.path}>
              <TooltipTrigger asChild>
                <Link to={item.path}>
                  <button
                    className={cn(
                      "w-full group flex items-center gap-3 px-3 py-2 rounded-lg",
                      "text-neon-pink hover:text-neon-blue transition-colors",
                      "hover:bg-dark-lighter/30",
                      "animate-hover-button focus:animate-hover-button",
                      "relative overflow-hidden"
                    )}
                    aria-label={item.label}
                  >
                    <item.icon className="w-6 h-6 shrink-0" />
                    {!isCompact && (
                      <span className="truncate">{item.label}</span>
                    )}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-neon-blue/10 to-neon-pink/10" />
                    </div>
                  </button>
                </Link>
              </TooltipTrigger>
              {isCompact && (
                <TooltipContent side={side === "left" ? "right" : "left"}>
                  {item.label}
                </TooltipContent>
              )}
            </Tooltip>
          ))}
        </TooltipProvider>
      </nav>
    </aside>
  );
};