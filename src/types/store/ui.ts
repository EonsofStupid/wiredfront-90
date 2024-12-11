import type { ActionType, BaseAction } from './common';

export interface UIState {
  readonly theme: 'light' | 'dark';
  readonly sidebarOpen: boolean;
  readonly activePanel: string | null;
}

export interface UIActions {
  readonly setTheme: (theme: UIState['theme']) => void;
  readonly toggleSidebar: () => void;
  readonly setActivePanel: (panelId: string | null) => void;
}

export type UIStore = Readonly<UIState & UIActions>;

export type UIActionType = 
  | 'SET_THEME'
  | 'TOGGLE_SIDEBAR'
  | 'SET_ACTIVE_PANEL';

export type UIAction = 
  | BaseAction<'SET_THEME', UIState['theme']>
  | BaseAction<'TOGGLE_SIDEBAR'>
  | BaseAction<'SET_ACTIVE_PANEL', string | null>;