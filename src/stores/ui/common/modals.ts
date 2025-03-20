import { atom, Getter, Setter } from 'jotai';

// Types
export interface ModalState {
  id: string;
  isOpen: boolean;
  props: Record<string, unknown>;
}

export interface ModalStack {
  [key: string]: ModalState;
}

// Base atoms
export const modalStackAtom = atom<ModalStack>({});

// Derived atom for active modals
export const activeModalsAtom = atom((get: Getter) => {
  const stack = get(modalStackAtom);
  return Object.values(stack).filter((modal): modal is ModalState => modal.isOpen);
});

// Action atoms
export const openModalAtom = atom(
  null,
  (get: Getter, set: Setter, { id, props = {} }: { id: string; props?: Record<string, unknown> }) => {
    const stack = get(modalStackAtom);
    set(modalStackAtom, {
      ...stack,
      [id]: {
        id,
        isOpen: true,
        props
      }
    });
  }
);

export const closeModalAtom = atom(
  null,
  (get: Getter, set: Setter, id: string) => {
    const stack = get(modalStackAtom);
    set(modalStackAtom, {
      ...stack,
      [id]: {
        ...stack[id],
        isOpen: false
      }
    });
  }
);

export const updateModalPropsAtom = atom(
  null,
  (get: Getter, set: Setter, { id, props }: { id: string; props: Record<string, unknown> }) => {
    const stack = get(modalStackAtom);
    if (stack[id]) {
      set(modalStackAtom, {
        ...stack,
        [id]: {
          ...stack[id],
          props: {
            ...stack[id].props,
            ...props
          }
        }
      });
    }
  }
);

export const removeModalAtom = atom(
  null,
  (get: Getter, set: Setter, id: string) => {
    const stack = get(modalStackAtom);
    const { [id]: removed, ...rest } = stack;
    set(modalStackAtom, rest);
  }
);

// Utility atoms
export const isModalOpenAtom = atom(
  (get: Getter) => (id: string) => {
    const stack = get(modalStackAtom);
    return stack[id]?.isOpen ?? false;
  }
);

export const getModalPropsAtom = atom(
  (get: Getter) => (id: string) => {
    const stack = get(modalStackAtom);
    return stack[id]?.props ?? {};
  }
);

// Reset atom
export const resetModalsAtom = atom(
  null,
  (get: Getter, set: Setter) => {
    set(modalStackAtom, {});
  }
);
