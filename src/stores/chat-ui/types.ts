
import { ChatMode } from '@/components/chat/store/types/chat-store-types';

export type DockPosition = 'left' | 'right' | 'bottom' | 'floating';
export type DockItem = 'memory' | 'files' | 'commands' | 'workflow' | 'settings';

export interface DockState {
  visible: boolean;
  position: DockPosition;
  width: number;
  height: number;
  items: DockItem[];
  activeItem: DockItem | null;
}

export interface ChatUIState {
  isDocked: boolean;
  isMinimized: boolean;
  position: { x: number; y: number } | 'bottom-right' | 'bottom-left';
  scale: number;
  theme: 'cyberpunk' | 'minimal' | 'classic';
  dockState: DockState;
  showCommandBar: boolean;
  quickActionsVisible: boolean;
  isGlassEffect: boolean;
  keyboardShortcutsEnabled: boolean;
}

export interface ChatUIActions {
  toggleDock: () => void;
  toggleMinimize: () => void;
  setPosition: (position: ChatUIState['position']) => void;
  setScale: (scale: number) => void;
  setTheme: (theme: ChatUIState['theme']) => void;
  toggleDockVisibility: () => void;
  setDockPosition: (position: DockPosition) => void;
  toggleCommandBar: () => void;
  toggleQuickActions: () => void;
  toggleGlassEffect: () => void;
  toggleKeyboardShortcuts: () => void;
  addDockItem: (item: DockItem) => void;
  removeDockItem: (item: DockItem) => void;
  setActiveDockItem: (item: DockItem | null) => void;
  resetUI: () => void;
}

export type ChatUIStore = ChatUIState & ChatUIActions;
