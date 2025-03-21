import { ChatPosition, DEFAULT_LAYOUT, LayoutState } from '@/types/chat/types';
import { atom } from 'jotai';

export const chatLayoutStateAtom = atom<LayoutState>(DEFAULT_LAYOUT);

export const chatLayoutPositionAtom = atom(
  (get) => get(chatLayoutStateAtom).position,
  (get, set, position: ChatPosition) => {
    set(chatLayoutStateAtom, {
      ...get(chatLayoutStateAtom),
      position,
    });
  }
);

export const chatLayoutScaleAtom = atom(
  (get) => get(chatLayoutStateAtom).scale,
  (get, set, scale: number) => {
    set(chatLayoutStateAtom, {
      ...get(chatLayoutStateAtom),
      scale,
    });
  }
);

export const chatLayoutDockedAtom = atom(
  (get) => get(chatLayoutStateAtom).docked,
  (get, set, docked: boolean) => {
    set(chatLayoutStateAtom, {
      ...get(chatLayoutStateAtom),
      docked,
    });
  }
);

export const chatLayoutOpenAtom = atom(
  (get) => get(chatLayoutStateAtom).isOpen,
  (get, set, isOpen: boolean) => {
    set(chatLayoutStateAtom, {
      ...get(chatLayoutStateAtom),
      isOpen,
    });
  }
);

export const chatLayoutMinimizedAtom = atom(
  (get) => get(chatLayoutStateAtom).isMinimized,
  (get, set, isMinimized: boolean) => {
    set(chatLayoutStateAtom, {
      ...get(chatLayoutStateAtom),
      isMinimized,
    });
  }
);
