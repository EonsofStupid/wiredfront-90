import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import type { LayoutState, ModalState, NotificationState, ThemeState } from '../types';

// Theme atoms
export const themeAtom = atomWithStorage<ThemeState>('theme-state', {
  mode: 'system',
  colorScheme: 'blue'
});

// Layout atoms
export const layoutAtom = atom<LayoutState>({
  isSidebarOpen: true,
  sidebarWidth: 280,
  isFullscreen: false,
  isMobile: false
});

// Modal atoms
export const modalAtom = atom<ModalState>({
  activeModals: []
});

// Notification atoms
export const notificationsAtom = atom<NotificationState>({
  items: []
});

// Derived atoms
export const isDarkModeAtom = atom((get) => {
  const theme = get(themeAtom);
  if (theme.mode === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return theme.mode === 'dark';
});

// Actions
export const addNotification = atom(
  null,
  (get, set, notification: Omit<NotificationState['items'][0], 'id'>) => {
    const notifications = get(notificationsAtom);
    set(notificationsAtom, {
      items: [
        ...notifications.items,
        { ...notification, id: Math.random().toString(36).substr(2, 9) }
      ]
    });
  }
);

export const removeNotification = atom(
  null,
  (get, set, id: string) => {
    const notifications = get(notificationsAtom);
    set(notificationsAtom, {
      items: notifications.items.filter(item => item.id !== id)
    });
  }
);

export const toggleSidebar = atom(
  null,
  (get, set) => {
    const layout = get(layoutAtom);
    set(layoutAtom, {
      ...layout,
      isSidebarOpen: !layout.isSidebarOpen
    });
  }
);
