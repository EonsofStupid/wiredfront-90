
export interface UIState {
  theme: 'light' | 'dark' | 'system';
  layout: {
    sidebarExpanded: boolean;
    contentWidth: 'full' | 'contained';
    rightSidebarVisible: boolean;
    adminIconOnly: boolean;
  };
  project: {
    activeProjectId: string | null;
  };
  accessibility: {
    reducedMotion: boolean;
    highContrast: boolean;
    fontSize: 'normal' | 'large' | 'xl';
  };
  zIndex: {
    modal: number;
    dropdown: number;
    tooltip: number;
    navbar: number;
    projecthub: number;
    floating: number;
    content: number;
    background: number;
    base: number;
  };
}

export interface UIActions {
  setTheme: (theme: UIState['theme']) => void;
  toggleSidebar: () => void;
  toggleRightSidebar: () => void;
  toggleAdminIconOnly: () => void;
  updateLayout: (updates: Partial<UIState['layout']>) => void;
  updateAccessibility: (updates: Partial<UIState['accessibility']>) => void;
  setActiveProject: (projectId: string) => void;
}

export type UIStore = UIState & UIActions;
