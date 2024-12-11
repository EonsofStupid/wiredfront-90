export interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  activePanel: string | null;
}

export interface UIActions {
  setTheme: (theme: 'light' | 'dark') => void;
  toggleSidebar: () => void;
  setActivePanel: (panelId: string | null) => void;
}

export type UIStore = UIState & UIActions;

export type UIAction = 
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_ACTIVE_PANEL'; payload: string | null };