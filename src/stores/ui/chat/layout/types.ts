export interface ChatLayoutState {
  isOpen: boolean;
  isMinimized: boolean;
  docked: boolean;
  position: {
    x: number;
    y: number;
  };
  scale: number;
  showSidebar: boolean;
  showSettings: boolean;
}

export interface ChatLayoutActions {
  toggleOpen: () => void;
  toggleMinimize: () => void;
  toggleDocked: () => void;
  setPosition: (x: number, y: number) => void;
  setScale: (scale: number) => void;
  toggleSidebar: () => void;
  toggleSettings: () => void;
}

export type ChatLayoutStore = ChatLayoutState & ChatLayoutActions;
