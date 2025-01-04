import React from 'react';
import { Card } from '@/components/ui/card';
import { useAIAssistantStore } from '../core/store';
import { AIMessageList } from './AIMessageList';
import { AIMessageInput } from './AIMessageInput';
import { AIWindowControls } from './AIWindowControls';

export const AIAssistantWindow: React.FC = () => {
  const { config } = useAIAssistantStore();
  const { position, size, isMinimized } = config;

  return (
    <Card
      className="fixed shadow-lg rounded-lg overflow-hidden bg-background flex flex-col z-[9999]"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        width: size.width,
        height: isMinimized ? 'auto' : size.height,
        transition: 'height 0.2s ease-in-out',
      }}
    >
      <AIWindowControls />
      {!isMinimized && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <AIMessageList />
          <AIMessageInput />
        </div>
      )}
    </Card>
  );
};