import { Circle } from "lucide-react";

export const StatusBar = () => {
  return (
    <div className="h-8 glass-card border-t border-white/10 flex items-center justify-between px-4">
      <div className="flex items-center gap-2 text-xs">
        <Circle className="h-2 w-2 text-green-500 fill-current" />
        <span>Ready</span>
      </div>
      <div className="flex items-center gap-4 text-xs text-gray-400">
        <span>Ln 1, Col 1</span>
        <span>UTF-8</span>
        <span>JavaScript</span>
      </div>
    </div>
  );
};