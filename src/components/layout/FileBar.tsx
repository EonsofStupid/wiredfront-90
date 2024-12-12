import { Button } from "@/components/ui/button";
import { File, Settings, Image, Bot } from "lucide-react";

interface FileBarProps {
  position: 'top' | 'left' | 'right';
}

export const FileBar = ({ position }: FileBarProps) => {
  const isVertical = position === 'left' || position === 'right';
  
  return (
    <div className={`glass-card ${
      isVertical 
        ? 'w-12 flex flex-col items-center py-4 gap-4' 
        : 'h-12 flex items-center px-4 gap-4'
    }`}>
      <Button variant="ghost" size="icon">
        <File className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon">
        <Bot className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon">
        <Image className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon">
        <Settings className="h-4 w-4" />
      </Button>
    </div>
  );
};