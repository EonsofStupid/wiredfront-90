
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { 
  ChatLayout, 
  DEFAULT_CHAT_LAYOUT,
  ChatUIPreferences, 
  DEFAULT_UI_PREFERENCES, 
  ChatTheme,
  ChatFontSize
} from '@/types/chat';

// Storage keys
const STORAGE_KEYS = {
  LAYOUT: 'chat-layout',
  PREFERENCES: 'chat-preferences',
};

// Primary atoms
export const chatLayoutAtom = atomWithStorage<ChatLayout>(
  STORAGE_KEYS.LAYOUT, 
  DEFAULT_CHAT_LAYOUT
);

export const chatPreferencesAtom = atomWithStorage<ChatUIPreferences>(
  STORAGE_KEYS.PREFERENCES,
  DEFAULT_UI_PREFERENCES
);

// Derived atoms
export const isOpenAtom = atom(
  (get) => get(chatLayoutAtom).isOpen,
  (get, set, isOpen: boolean) => set(chatLayoutAtom, {
    ...get(chatLayoutAtom),
    isOpen
  })
);

export const isMinimizedAtom = atom(
  (get) => get(chatLayoutAtom).isMinimized,
  (get, set, isMinimized: boolean) => set(chatLayoutAtom, {
    ...get(chatLayoutAtom),
    isMinimized
  })
);

export const isDockedAtom = atom(
  (get) => get(chatLayoutAtom).docked,
  (get, set, docked: boolean) => set(chatLayoutAtom, {
    ...get(chatLayoutAtom),
    docked
  })
);

export const positionAtom = atom(
  (get) => get(chatLayoutAtom).position,
  (get, set, position: { x: number; y: number }) => set(chatLayoutAtom, {
    ...get(chatLayoutAtom),
    position
  })
);

export const scaleAtom = atom(
  (get) => get(chatLayoutAtom).scale,
  (get, set, scale: number) => set(chatLayoutAtom, {
    ...get(chatLayoutAtom),
    scale
  })
);

export const showSidebarAtom = atom(
  (get) => get(chatLayoutAtom).showSidebar,
  (get, set, showSidebar: boolean) => set(chatLayoutAtom, {
    ...get(chatLayoutAtom),
    showSidebar
  })
);

export const themeAtom = atom(
  (get) => get(chatPreferencesAtom).theme,
  (get, set, theme: ChatTheme) => set(chatPreferencesAtom, {
    ...get(chatPreferencesAtom),
    theme
  })
);

export const fontSizeAtom = atom(
  (get) => get(chatPreferencesAtom).fontSize,
  (get, set, fontSize: ChatFontSize) => set(chatPreferencesAtom, {
    ...get(chatPreferencesAtom),
    fontSize
  })
);

export const showTimestampsAtom = atom(
  (get) => get(chatPreferencesAtom).showTimestamps,
  (get, set, showTimestamps: boolean) => set(chatPreferencesAtom, {
    ...get(chatPreferencesAtom),
    showTimestamps
  })
);

// Action atoms
export const toggleOpenAtom = atom(
  null,
  (get, set) => {
    const currentIsOpen = get(isOpenAtom);
    set(isOpenAtom, !currentIsOpen);
  }
);

export const toggleMinimizedAtom = atom(
  null,
  (get, set) => {
    const currentIsMinimized = get(isMinimizedAtom);
    set(isMinimizedAtom, !currentIsMinimized);
  }
);

export const toggleDockedAtom = atom(
  null,
  (get, set) => {
    const currentIsDocked = get(isDockedAtom);
    set(isDockedAtom, !currentIsDocked);
  }
);

export const toggleSidebarAtom = atom(
  null,
  (get, set) => {
    const currentShowSidebar = get(showSidebarAtom);
    set(showSidebarAtom, !currentShowSidebar);
  }
);

export const resetLayoutAtom = atom(
  null,
  (_, set) => {
    set(chatLayoutAtom, DEFAULT_CHAT_LAYOUT);
  }
);

export const resetPreferencesAtom = atom(
  null,
  (_, set) => {
    set(chatPreferencesAtom, DEFAULT_UI_PREFERENCES);
  }
);
