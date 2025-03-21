
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Position {
  x: number;
  y: number;
}

interface DockingPreferences {
  snapToEdges: boolean;
  preferredEdge: 'left' | 'right' | 'top' | 'bottom' | null;
  dockThreshold: number;
}

interface ThemePreferences {
  theme: 'light' | 'dark' | 'system' | 'cyberpunk';
  fontSize: 'small' | 'medium' | 'large';
  animations: boolean;
  glowEffects: boolean;
  transparencyLevel: number;
}

interface IconPreferences {
  showLabels: boolean;
  size: 'small' | 'medium' | 'large';
  layout: 'stack' | 'grid' | 'row';
  position: 'left' | 'right';
  visibleIcons: string[];
}

interface ChatStore {
  // UI States
  isOpen: boolean;
  isMinimized: boolean;
  showSidebar: boolean;
  position: Position;
  scale: number;
  docked: boolean;
  
  // Preferences
  dockingPrefs: DockingPreferences;
  themePrefs: ThemePreferences;
  iconPrefs: IconPreferences;
  
  // Actions
  toggleChat: () => void;
  toggleMinimize: () => void;
  toggleSidebar: () => void;
  setPosition: (position: Position) => void;
  setScale: (scale: number) => void;
  setDocked: (docked: boolean) => void;
  updateDockingPrefs: (prefs: Partial<DockingPreferences>) => void;
  updateThemePrefs: (prefs: Partial<ThemePreferences>) => void;
  updateIconPrefs: (prefs: Partial<IconPreferences>) => void;
  resetToDefaults: () => void;
  
  // Session handling
  setSessionLoading: (isLoading: boolean) => void;
  setCurrentMode: (mode: string) => void;
  initializeChatSettings: () => void;
}

// Default values
const defaultDockingPrefs: DockingPreferences = {
  snapToEdges: true,
  preferredEdge: 'right',
  dockThreshold: 20,
};

const defaultThemePrefs: ThemePreferences = {
  theme: 'dark',
  fontSize: 'medium',
  animations: true,
  glowEffects: true,
  transparencyLevel: 0.4,
};

const defaultIconPrefs: IconPreferences = {
  showLabels: true,
  size: 'medium',
  layout: 'stack',
  position: 'right',
  visibleIcons: ['commands', 'voice', 'search', 'memory', 'settings'],
};

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      // UI States
      isOpen: false,
      isMinimized: false,
      showSidebar: false,
      position: { x: 0, y: 0 },
      scale: 1,
      docked: false,
      
      // Preferences
      dockingPrefs: defaultDockingPrefs,
      themePrefs: defaultThemePrefs,
      iconPrefs: defaultIconPrefs,
      
      // Actions
      toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
      toggleMinimize: () => set((state) => ({ isMinimized: !state.isMinimized })),
      toggleSidebar: () => set((state) => ({ showSidebar: !state.showSidebar })),
      setPosition: (position) => set({ position }),
      setScale: (scale) => set({ scale }),
      setDocked: (docked) => set({ docked }),
      updateDockingPrefs: (prefs) => set((state) => ({ 
        dockingPrefs: { ...state.dockingPrefs, ...prefs } 
      })),
      updateThemePrefs: (prefs) => set((state) => ({ 
        themePrefs: { ...state.themePrefs, ...prefs } 
      })),
      updateIconPrefs: (prefs) => set((state) => ({ 
        iconPrefs: { ...state.iconPrefs, ...prefs } 
      })),
      resetToDefaults: () => set({ 
        dockingPrefs: defaultDockingPrefs,
        themePrefs: defaultThemePrefs,
        iconPrefs: defaultIconPrefs,
      }),
      
      // Session handling
      setSessionLoading: (isLoading) => set({ 
        // This is a placeholder for now
      }),
      setCurrentMode: (mode) => set({
        // This is a placeholder for now
      }),
      initializeChatSettings: () => {
        // Try to load saved preferences, if any
        // This is a placeholder that will be expanded
      }
    }),
    {
      name: 'chat-preferences',
    }
  )
);
