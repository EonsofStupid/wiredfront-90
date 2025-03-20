export interface SidebarState {
  isVisible: boolean;
  width: number;
  isCollapsed: boolean;
  activeSection: string | null;
}

export interface SidebarActions {
  toggleVisibility: () => void;
  setWidth: (width: number) => void;
  toggleCollapse: () => void;
  setActiveSection: (section: string | null) => void;
}

export type SidebarStore = SidebarState & SidebarActions;
