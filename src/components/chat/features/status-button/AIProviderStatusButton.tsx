
import React, { useState } from 'react';
import { Zap, Server, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { ProviderCategory } from '../../store/types/chat-store-types';
import { useChatStore } from '../../store/chatStore';
import { logger } from '@/services/chat/LoggingService';

export function AIProviderStatusButton() {
  const { currentProvider } = useChatStore();
  
  // Get status info
  const getStatus = () => {
    if (!currentProvider) {
      return { 
        text: 'Not Connected', 
        color: 'text-yellow-500', 
        icon: AlertTriangle, 
        description: 'No AI provider connected' 
      };
    }
    
    return { 
      text: 'Connected', 
      color: 'text-green-500', 
      icon: Zap, 
      description: `Using ${currentProvider.name}` 
    };
  };
  
  const status = getStatus();
  const Icon = status.icon;
  
  const handleClick = () => {
    logger.info('AI Provider status clicked');
  };
  
  return (
    <HoverCard openDelay={300} closeDelay={200}>
      <HoverCardTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          onClick={handleClick}
          className={`border-chat-knowledge-border hover:bg-chat-knowledge-background/10 ${status.color}`}
        >
          <Icon className="h-4 w-4" />
        </Button>
      </HoverCardTrigger>
      <HoverCardContent align="end" className="w-80 chat-dialog-content">
        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center gap-1">
            <Server className="h-3.5 w-3.5" />
            AI Provider Status
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Status</span>
              <span className={`text-xs font-medium flex items-center gap-1 ${status.color}`}>
                <Icon className="h-3 w-3" />
                <span>{status.text}</span>
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Provider</span>
              <span className="text-xs font-medium">
                {currentProvider?.name || 'None'}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Model</span>
              <span className="text-xs font-medium">
                {currentProvider?.models?.[0] || 'Not specified'}
              </span>
            </div>
            
            <div className="text-xs text-muted-foreground mt-2">
              {status.description}
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
