import { atom } from 'jotai';
import { ChatPosition } from '../../types/chat';

// UI State Atoms
export const chatPositionAtom = atom<ChatPosition>({ x: 0, y: 0 });
export const chatScaleAtom = atom<number>(1);
export const chatIsDockedAtom = atom<boolean>(false);
export const chatIsMinimizedAtom = atom<boolean>(false);
export const chatShowSidebarAtom = atom<boolean>(false);

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

  // If docked, snap to the right edge
  return {
    x: window.innerWidth - dimensions.width,
    y: 0,
  };
});
