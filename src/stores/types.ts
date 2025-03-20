// Store Types
export interface StoreState {
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
}

// Auth Types
export interface AuthState extends StoreState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  avatar?: string;
}

// UI Types
export interface UIState extends StoreState {
  theme: ThemeState;
  layout: LayoutState;
  modals: ModalState;
  notifications: NotificationState;
}

export interface ThemeState {
  mode: 'light' | 'dark' | 'system';
  colorScheme: string;
}

export interface LayoutState {
  isSidebarOpen: boolean;
  sidebarWidth: number;
  isFullscreen: boolean;
  isMobile: boolean;
}

export interface ModalState {
  activeModals: string[];
}

export interface NotificationState {
  items: Notification[];
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  title?: string;
  duration?: number;
}
