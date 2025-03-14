
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Code, FileText, Bot, Activity, Database, Settings, User, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface MobileNavigationProps {
  onItemClick?: () => void;
}

/**
 * Enhanced mobile navigation with animations and sections
 */
export const MobileNavigation = ({ onItemClick }: MobileNavigationProps) => {
  const location = useLocation();
  
  // Main navigation items
  const mainNavItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Code, label: "Editor", path: "/editor" },
    { icon: FileText, label: "Documents", path: "/documents" },
    { icon: Bot, label: "AI Assistant", path: "/ai" },
  ];
  
  // Additional navigation items
  const toolNavItems = [
    { icon: Activity, label: "Analytics", path: "/analytics" },
    { icon: Database, label: "Data", path: "/data" },
  ];
  
  // Settings and profile items
  const settingsNavItems = [
    { icon: Settings, label: "Settings", path: "/settings" },
    { icon: User, label: "Profile", path: "/profile" },
    { icon: Info, label: "About", path: "/about" },
  ];
  
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };
  
  // Renders a navigation section with title
  const renderNavSection = (title: string, items: typeof mainNavItems) => (
    <div className="mb-6">
      <h3 className="px-4 mb-2 text-xs uppercase text-neon-pink/70 font-medium tracking-wider">
        {title}
      </h3>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-1"
      >
        {items.map((navItem) => {
          const isActive = location.pathname === navItem.path;
          return (
            <motion.div key={navItem.path} variants={item}>
              <Link
                to={navItem.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg",
                  "text-neon-pink hover:text-neon-blue transition-colors",
                  "hover:bg-dark-lighter/30",
                  isActive && "bg-dark-lighter/50 text-neon-blue"
                )}
                onClick={onItemClick}
              >
                <navItem.icon className="w-5 h-5" />
                <span className="text-sm">{navItem.label}</span>
                {isActive && (
                  <motion.div 
                    layoutId="activeIndicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-neon-blue"
                  />
                )}
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
  
  return (
    <nav className="h-full bg-dark-lighter p-4 overflow-y-auto">
      {renderNavSection("Main", mainNavItems)}
      {renderNavSection("Tools", toolNavItems)}
      {renderNavSection("Settings", settingsNavItems)}
      
      <div className="absolute bottom-8 left-0 right-0 px-4">
        <div className="p-4 rounded-lg bg-dark-lighter/50 border border-neon-blue/20">
          <p className="text-xs text-neon-pink/80 text-center">
            wiredFRONT v1.0.0
          </p>
        </div>
      </div>
    </nav>
  );
};
