import { Wand2, X, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AIHeaderProps {
  isMinimized: boolean;
  onMinimize: () => void;
  onClose: () => void;
}

export const AIHeader = ({ isMinimized, onMinimize, onClose }: AIHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-4 bg-dark-lighter/50">
      <div className="flex items-center gap-2">
        <Wand2 className="text-neon-blue w-5 h-5" />
        <span className="text-sm font-medium">AI Assistant</span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onMinimize}
        >
          {isMinimized ? (
            <Maximize2 className="h-4 w-4" />
          ) : (
            <Minimize2 className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};