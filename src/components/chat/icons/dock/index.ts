
import { 
  Pin, 
  PinOff, 
  Maximize2, 
  Minimize2, 
  ArrowLeftRight,
  X,
  Menu
} from 'lucide-react';

// Export dock control icons for reuse throughout the application
export const DockIcons = {
  pin: Pin,
  unpin: PinOff,
  maximize: Maximize2,
  minimize: Minimize2,
  move: ArrowLeftRight,
  close: X,
  menu: Menu
};

export type DockIconType = keyof typeof DockIcons;
