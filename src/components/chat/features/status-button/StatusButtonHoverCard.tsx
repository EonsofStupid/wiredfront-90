
import React from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { StatusButtonPreview } from './StatusButtonPreview';
import { Button } from '@/components/ui/button';
import { LucideProps } from 'lucide-react';
import { logger } from '@/services/chat/LoggingService';

interface StatusButtonHoverCardProps {
  type: 'github' | 'notifications';
  icon: React.ForwardRefExoticComponent<LucideProps & React.RefAttributes<SVGSVGElement>>;
  onClick: () => void;
  disabled?: boolean;
  showBadge?: boolean;
  badgeCount?: number;
  className?: string;
}

export const StatusButtonHoverCard: React.FC<StatusButtonHoverCardProps> = ({
  type,
  icon: Icon,
  onClick,
  disabled = false,
  showBadge = false,
  badgeCount = 0,
  className = '',
}) => {
  // Log any hover events for analytics
  const handleHoverStart = () => {
    logger.info(`StatusButton hover started`, { type });
  };

  const handleHoverEnd = () => {
    logger.info(`StatusButton hover ended`, { type });
  };

  const handleClick = (e: React.MouseEvent) => {
    // Prevent event propagation
    e.stopPropagation();
    logger.info(`StatusButton clicked`, { type });
    onClick();
  };

  return (
    <HoverCard openDelay={300} closeDelay={200}>
      <HoverCardTrigger asChild onMouseEnter={handleHoverStart} onMouseLeave={handleHoverEnd}>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClick}
          disabled={disabled}
          className={`relative ${className}`}
          aria-label={`Open ${type} status dialog`}
        >
          <Icon className="h-5 w-5" />
          {showBadge && badgeCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">
              {badgeCount > 9 ? '9+' : badgeCount}
            </span>
          )}
          <span className="sr-only">
            {type === 'github' ? 'GitHub Status' : 'Notifications'}
          </span>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent align="end" className="w-80">
        <StatusButtonPreview type={type} />
      </HoverCardContent>
    </HoverCard>
  );
};
