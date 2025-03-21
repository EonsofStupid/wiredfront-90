
import { cn } from "@/lib/utils";
import { Cog, Command, Cpu, FileSearch, Mic } from "lucide-react";
import { useChatStore } from "../store/chatStore";

interface IconStackProps {
  position?: 'left' | 'right';
  className?: string;
}

export function IconStack({ position = 'right', className }: IconStackProps) {
  const { iconPrefs } = useChatStore();
  
  // Don't render if the user has disabled all icons
  if (!iconPrefs.visibleIcons || iconPrefs.visibleIcons.length === 0) {
    return null;
  }
  
  // Map icon names to components
  const iconMap = {
    commands: Command,
    voice: Mic,
    search: FileSearch,
    settings: Cog,
    memory: Cpu
  };
  
  // Filter icons based on user preferences
  const visibleIcons = Object.entries(iconMap)
    .filter(([name]) => iconPrefs.visibleIcons.includes(name))
    .map(([name, Icon]) => ({ name, Icon }));
  
  // Layout styles based on user preferences
  const getLayoutStyles = () => {
    switch (iconPrefs.layout) {
      case 'stack':
        return 'flex flex-col gap-2';
      case 'grid':
        return 'grid grid-cols-2 gap-2';
      case 'row':
        return 'flex flex-row gap-2';
      default:
        return 'flex flex-col gap-2';
    }
  };
  
  // Size styles based on user preferences
  const getSizeStyles = () => {
    switch (iconPrefs.size) {
      case 'small':
        return 'h-8 w-8';
      case 'medium':
        return 'h-10 w-10';
      case 'large':
        return 'h-12 w-12';
      default:
        return 'h-10 w-10';
    }
  };
  
  return (
    <div 
      className={cn(
        "z-[var(--chat-z-index)]",
        getLayoutStyles(),
        position === 'left' ? 'mr-2' : 'ml-2',
        className
      )}
    >
      {visibleIcons.map(({ name, Icon }) => (
        <button
          key={name}
          className={cn(
            "flex items-center justify-center rounded-full bg-black/30 border border-neon-blue/20 text-neon-blue",
            "hover:bg-neon-blue/20 hover:text-white transition-colors duration-200",
            getSizeStyles()
          )}
          aria-label={name}
        >
          <Icon className="h-5 w-5" />
        </button>
      ))}
    </div>
  );
}
