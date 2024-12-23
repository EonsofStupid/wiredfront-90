export interface UIState {
  version: string;
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  activePanel: string | null;
}

export interface UIActions {
  setTheme: (theme: UIState['theme']) => void;
  toggleSidebar: () => void;
  setActivePanel: (panelId: string | null) => void;
}

export type UIStore = UIState & UIActions;