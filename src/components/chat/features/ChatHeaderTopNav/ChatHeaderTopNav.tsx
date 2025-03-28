
import React from 'react';
import { Home, Folder, Image, BookOpen, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useChatBridge } from '@/modules/ChatBridge';
import { useMode } from '@/modules/ModeManager';

import './styles.css';

export function ChatHeaderTopNav() {
  const location = useLocation();
  const chatBridge = useChatBridge();
  const { currentMode } = useMode();
  
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/editor', icon: Folder, label: 'Editor' },
    { path: '/gallery', icon: Image, label: 'Gallery' },
    { path: '/training', icon: BookOpen, label: 'Training' },
  ];
  
  const handleNavClick = (path: string) => {
    // Use the sendEvent method to notify about navigation
    chatBridge.sendEvent('navigation', { destination: path });
  };
  
  return (
    <div className="chat-header-top-nav flex items-center space-x-2">
      {navItems.map((item) => (
        <Link 
          key={item.path}
          to={item.path}
          className={cn(
            "chat-header-top-nav-button p-1.5 rounded-md transition-colors",
            location.pathname === item.path
              ? "bg-white/10 text-white" 
              : "text-white/70 hover:text-white hover:bg-white/5"
          )}
          onClick={() => handleNavClick(item.path)}
          title={item.label}
        >
          <item.icon size={16} />
        </Link>
      ))}
    </div>
  );
}

export default ChatHeaderTopNav;
