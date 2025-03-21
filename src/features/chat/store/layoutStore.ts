import { logger } from '@/services/chat/LoggingService';
import { atom } from 'jotai';

// Core layout state atoms
export const isOpenAtom = atom<boolean>(false);
export const positionAtom = atom<{ x: number; y: number }>({ x: 20, y: 20 });
export const sizeAtom = atom<{ width: number; height: number }>({ width: 400, height: 600 });
export const isMinimizedAtom = atom<boolean>(false);
export const isMaximizedAtom = atom<boolean>(false);

// Derived atoms for actions
export const toggleOpenAtom = atom(
  null,
  (get, set) => {
    const isOpen = get(isOpenAtom);
    set(isOpenAtom, !isOpen);
    logger.info('Toggled chat window', { isOpen: !isOpen });
  }
);

export const updatePositionAtom = atom(
  null,
  (get, set, position: { x: number; y: number }) => {
    set(positionAtom, position);
    logger.info('Updated chat position', { position });
  }
);

export const updateSizeAtom = atom(
  null,
  (get, set, size: { width: number; height: number }) => {
    set(sizeAtom, size);
    logger.info('Updated chat size', { size });
  }
);

export const toggleMinimizeAtom = atom(
  null,
  (get, set) => {
    const isMinimized = get(isMinimizedAtom);
    set(isMinimizedAtom, !isMinimized);
    logger.info('Toggled chat minimize', { isMinimized: !isMinimized });
  }
);

export const toggleMaximizeAtom = atom(
  null,
  (get, set) => {
    const isMaximized = get(isMaximizedAtom);
    set(isMaximizedAtom, !isMaximized);
    logger.info('Toggled chat maximize', { isMaximized: !isMaximized });
  }
);

// Initialize from localStorage if available
if (typeof window !== 'undefined') {
  try {
    const savedPosition = localStorage.getItem('wired_front_chat_position');
    const savedSize = localStorage.getItem('wired_front_chat_size');

    if (savedPosition) {
      const position = JSON.parse(savedPosition);
      positionAtom.init = position;
    }

    if (savedSize) {
      const size = JSON.parse(savedSize);
      sizeAtom.init = size;
    }
  } catch (error) {
    logger.error('Failed to initialize chat layout from localStorage', { error });
  }
}
