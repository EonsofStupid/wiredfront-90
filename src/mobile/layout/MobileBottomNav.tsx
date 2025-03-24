
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Code, Bot, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMobileChat } from "../hooks/useMobileChat";

/**
 * Mobile-specific bottom navigation with animated indicators
 */
export const MobileBottomNav = () => {
  const location = useLocation();
  const { toggleChat } = useMobileChat();
  
  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Code, label: "Editor", path: "/editor" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-dark-lighter/80 backdrop-blur-md border-t border-neon-blue/20 z-50">
      <div className="grid grid-cols-4 h-full">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center justify-center"
            >
              <div
                className={cn(
                  "flex flex-col items-center gap-1 transition-all duration-200",
                  "text-neon-pink hover:text-neon-blue",
                  isActive && "text-neon-blue scale-105"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs">{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-1 h-1 w-6 bg-neon-blue rounded-full animate-pulse" />
                )}
              </div>
            </Link>
          );
        })}
        <button
          className="flex flex-col items-center justify-center w-full h-full"
          onClick={toggleChat}
        >
          <div className="flex flex-col items-center gap-1 text-neon-pink hover:text-neon-blue transition-colors">
            <Bot className="w-5 h-5" />
            <span className="text-xs">AI</span>
          </div>
        </button>
      </div>
    </nav>
  );
};
