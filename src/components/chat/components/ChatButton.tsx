import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import styles from '../styles/ChatButton.module.css';
import { cn } from '@/lib/utils';

interface ChatButtonProps {
  position: 'bottom-left' | 'bottom-right';
  scale: number;
  onClick: () => void;
  isPreview?: boolean;
}

export const ChatButton: React.FC<ChatButtonProps> = ({
  position,
  scale,
  onClick,
  isPreview = false
}) => {
  const containerClass = isPreview ? styles.previewButton : styles.chatButtonContainer;
  const buttonClass = cn(styles.chatButton, {
    [styles.bottomLeft]: position === 'bottom-left',
    [styles.bottomRight]: position === 'bottom-right'
  });

  return (
    <div 
      className={containerClass}
      style={{
        transform: `scale(${scale})`,
        transformOrigin: position === 'bottom-left' ? 'left center' : 'right center'
      }}
    >
      <Button
        onClick={onClick}
        className={buttonClass}
        size={scale < 0.75 ? 'sm' : scale > 1.25 ? 'lg' : 'default'}
        variant="default"
      >
        <MessageSquare className="h-5 w-5" />
      </Button>
    </div>
  );
}; 