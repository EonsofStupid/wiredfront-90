
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { ChatPosition, DockPosition } from '../../../types/chat/ui';

// UI State Atoms
export const chatPositionAtom = atomWithStorage<ChatPosition>('chat-position', { x: 0, y: 0 });
export const chatScaleAtom = atomWithStorage<number>('chat-scale', 1);
export const chatIsDockedAtom = atomWithStorage<boolean>('chat-is-docked', true);
export const chatIsMinimizedAtom = atomWithStorage<boolean>('chat-is-minimized', false);
export const chatShowSidebarAtom = atomWithStorage<boolean>('chat-show-sidebar', false);
export const chatThemeAtom = atomWithStorage<'light' | 'dark' | 'system' | 'cyberpunk'>('chat-theme', 'system');
export const chatFontSizeAtom = atomWithStorage<'small' | 'medium' | 'large'>('chat-font-size', 'medium');

// Derived Atoms
export const chatIsVisibleAtom = atom<boolean>((get) => {
  const isMinimized = get(chatIsMinimizedAtom);
  const isDocked = get(chatIsDockedAtom);
  return !isMinimized || isDocked;
});

export const chatDimensionsAtom = atom((get) => {
  const scale = get(chatScaleAtom);
  return {
    width: 400 * scale,
    height: 600 * scale,
  };
});

// Computed Atoms
export const chatPositionWithDockAtom = atom((get) => {
  const position = get(chatPositionAtom);
  const isDocked = get(chatIsDockedAtom);
  const dimensions = get(chatDimensionsAtom);

  if (!isDocked) return position;

  // If docked, snap to the right edge of the viewport
  return {
    x: window.innerWidth - dimensions.width,
    y: 0,
  };
});

// Preferences Atoms
export const chatShowTimestampsAtom = atomWithStorage<boolean>('chat-show-timestamps', true);
export const chatSaveHistoryAtom = atomWithStorage<boolean>('chat-save-history', true);

// Docking Atoms
export const chatDockedItemsAtom = atomWithStorage<Record<string, DockPosition>>('chat-docked-items', {});
export const chatDockingPreferencesAtom = atomWithStorage('chat-docking-preferences', {
  snapToEdges: true,
  preferredEdge: 'right' as const,
  dockThreshold: 20,
});

// Theme Atoms
export const chatAnimationsEnabledAtom = atomWithStorage<boolean>('chat-animations-enabled', true);
export const chatGlowEffectsEnabledAtom = atomWithStorage<boolean>('chat-glow-effects-enabled', true);
export const chatTransparencyLevelAtom = atomWithStorage<number>('chat-transparency-level', 0.4);

// Preferences Atom (consolidated)
export const chatPreferencesAtom = atom((get) => {
  return {
    position: get(chatPositionAtom),
    scale: get(chatScaleAtom),
    isDocked: get(chatIsDockedAtom),
    isMinimized: get(chatIsMinimizedAtom),
    showSidebar: get(chatShowSidebarAtom),
    showTimestamps: get(chatShowTimestampsAtom),
    saveHistory: get(chatSaveHistoryAtom),
    theme: get(chatThemeAtom),
    fontSize: get(chatFontSizeAtom),
    animationsEnabled: get(chatAnimationsEnabledAtom),
    glowEffectsEnabled: get(chatGlowEffectsEnabledAtom),
    transparencyLevel: get(chatTransparencyLevelAtom),
  };
});
