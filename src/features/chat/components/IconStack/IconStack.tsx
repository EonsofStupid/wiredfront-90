
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Brain, Command, FileSearch, Mic, Settings } from 'lucide-react';
import { useState } from 'react';
import { useChatStore } from '../../store/chatStore';
import { iconStackStyles } from './styles';

export interface IconProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  className?: string;
  variant?: 'neon-blue' | 'neon-pink' | 'neon-purple' | 'neon-teal' | 'default';
}

export interface IconStackProps {
  icons?: IconProps[];
  position?: 'left' | 'right';
  className?: string;
}

const defaultIcons: IconProps[] = [
  {
    icon: <Command className="h-4 w-4" />,
    label: 'Commands',
    variant: 'neon-blue'
  },
  {
    icon: <Mic className="h-4 w-4" />,
    label: 'Voice Input',
    variant: 'neon-pink'
  },
  {
    icon: <FileSearch className="h-4 w-4" />,
    label: 'Search Knowledge',
    variant: 'neon-purple'
  },
  {
    icon: <Brain className="h-4 w-4" />,
    label: 'AI Memory',
    variant: 'neon-teal'
  },
  {
    icon: <Settings className="h-4 w-4" />,
    label: 'Chat Settings',
    variant: 'default'
  }
];

export function IconStack({ 
  icons = defaultIcons,
  position = 'right',
  className 
}: IconStackProps) {
  const { isMinimized } = useChatStore();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (isMinimized) return null;

  // Get the style for a specific variant
  const getVariantStyle = (variant: IconProps['variant'] = 'default') => {
    switch (variant) {
      case 'neon-blue':
        return iconStackStyles.variants.neonBlue;
      case 'neon-pink':
        return iconStackStyles.variants.neonPink;
      case 'neon-purple':
        return iconStackStyles.variants.neonPurple;
      case 'neon-teal':
        return iconStackStyles.variants.neonTeal;
      default:
        return iconStackStyles.variants.default;
    }
  };

  return (
    <div className={cn(
      iconStackStyles.container,
      position === 'left' ? iconStackStyles.positions.left : iconStackStyles.positions.right,
      className
    )}>
      <TooltipProvider>
        {icons.map((icon, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className={cn(
                  iconStackStyles.button,
                  getVariantStyle(icon.variant),
                  hoveredIndex !== null && hoveredIndex !== index && 'opacity-50 scale-95',
                  icon.className
                )}
                onClick={icon.onClick}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {icon.icon}
              </Button>
            </TooltipTrigger>
            <TooltipContent side={position === 'left' ? 'right' : 'left'}>
              <p>{icon.label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
}
