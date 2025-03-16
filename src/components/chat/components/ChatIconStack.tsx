
import React, { useState, useEffect } from 'react';
import { Github, Bell, Database, Users } from 'lucide-react';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';
import { useChatStore } from '../store/chatStore';
import { logger } from '@/services/chat/LoggingService';
import '../styles/ChatButtonStyle.css';

export const ChatIconStack = () => {
  const { isOpen } = useChatStore();
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      // Slight delay to allow the chat to open first
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);
  
  const handleIconClick = (type: string) => {
    logger.info(`Icon clicked: ${type}`);
    // We can handle different icon clicks here
  };
  
  if (!isOpen) return null;
  
  return (
    <div className={`chat-icon-stack ${isVisible ? 'chat-icon-stack-visible' : ''}`}>
      <HoverCard openDelay={300} closeDelay={200}>
        <HoverCardTrigger asChild>
          <button 
            className="chat-icon-button" 
            onClick={() => handleIconClick('github')}
            aria-label="GitHub integration"
          >
            <Github className="h-4 w-4" />
          </button>
        </HoverCardTrigger>
        <HoverCardContent 
          side="left" 
          align="center" 
          className="neo-blur border border-neon-blue/20 p-4"
        >
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-white">GitHub Status</h4>
            <p className="text-xs text-gray-300">Last sync: 15 min ago</p>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-xs text-gray-300">Connected</span>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
      
      <HoverCard openDelay={300} closeDelay={200}>
        <HoverCardTrigger asChild>
          <button 
            className="chat-icon-button" 
            onClick={() => handleIconClick('notifications')}
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
          </button>
        </HoverCardTrigger>
        <HoverCardContent 
          side="left" 
          align="center" 
          className="neo-blur border border-neon-blue/20 p-4"
        >
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-white">Notifications</h4>
            <p className="text-xs text-gray-300">You have 2 unread notifications</p>
          </div>
        </HoverCardContent>
      </HoverCard>
      
      <HoverCard openDelay={300} closeDelay={200}>
        <HoverCardTrigger asChild>
          <button 
            className="chat-icon-button" 
            onClick={() => handleIconClick('knowledge')}
            aria-label="Knowledge Base"
          >
            <Database className="h-4 w-4" />
          </button>
        </HoverCardTrigger>
        <HoverCardContent 
          side="left" 
          align="center" 
          className="neo-blur border border-neon-blue/20 p-4"
        >
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-white">Knowledge Base</h4>
            <p className="text-xs text-gray-300">10 sources connected</p>
          </div>
        </HoverCardContent>
      </HoverCard>
      
      <HoverCard openDelay={300} closeDelay={200}>
        <HoverCardTrigger asChild>
          <button 
            className="chat-icon-button" 
            onClick={() => handleIconClick('provider')}
            aria-label="AI Provider"
          >
            <Users className="h-4 w-4" />
          </button>
        </HoverCardTrigger>
        <HoverCardContent 
          side="left" 
          align="center" 
          className="neo-blur border border-neon-blue/20 p-4"
        >
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-white">AI Provider</h4>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-xs text-gray-300">GPT-4 (Operational)</span>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};

export default ChatIconStack;
