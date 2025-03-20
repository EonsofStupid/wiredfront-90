import { atom, Getter, Setter } from 'jotai';
import type { ModalStack } from './types';

// Base atoms
const modalStackAtom = atom<ModalStack>({});

// Derived atoms
const modalStateAtom = atom(
  (get: Getter) => get(modalStackAtom),
  (get: Getter, set: Setter, update: Partial<ModalStack>) => {
    set(modalStackAtom, { ...get(modalStackAtom), ...update });
  }
);

// Action atoms
export const openModalAtom = atom(
  null,
  (get: Getter, set: Setter, { id, props = {} }: { id: string; props?: Record<string, unknown> }) => {
    const currentStack = get(modalStackAtom);
    set(modalStackAtom, {
      ...currentStack,
      [id]: { id, isOpen: true, props }
    });
  }
);

export const closeModalAtom = atom(
  null,
  (get: Getter, set: Setter, id: string) => {
    const currentStack = get(modalStackAtom);
    if (currentStack[id]) {
      set(modalStackAtom, {
        ...currentStack,
        [id]: { ...currentStack[id], isOpen: false }
      });
    }
  }
);

export const updateModalPropsAtom = atom(
  null,
  (get: Getter, set: Setter, { id, props }: { id: string; props: Record<string, unknown> }) => {
    const currentStack = get(modalStackAtom);
    if (currentStack[id]) {
      set(modalStackAtom, {
        ...currentStack,
        [id]: { ...currentStack[id], props }
      });
    }
  }
);

export const removeModalAtom = atom(
  null,
  (get: Getter, set: Setter, id: string) => {
    const currentStack = get(modalStackAtom);
    const { [id]: removed, ...rest } = currentStack;
    set(modalStackAtom, rest);
  }
);

export const resetModalsAtom = atom(
  null,
  (_: Getter, set: Setter) => {
    set(modalStackAtom, {});
  }
);

// Utility atoms
export const isModalOpenAtom = atom(
  (get: Getter) => (id: string) => get(modalStackAtom)[id]?.isOpen ?? false
);

export const getModalPropsAtom = atom(
  (get: Getter) => (id: string) => get(modalStackAtom)[id]?.props ?? {}
);
