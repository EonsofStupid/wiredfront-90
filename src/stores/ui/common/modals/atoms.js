import { atom } from 'jotai';
// Base atoms
const modalStackAtom = atom({});
// Derived atoms
const modalStateAtom = atom((get) => get(modalStackAtom), (get, set, update) => {
    set(modalStackAtom, { ...get(modalStackAtom), ...update });
});
// Action atoms
export const openModalAtom = atom(null, (get, set, { id, props = {} }) => {
    const currentStack = get(modalStackAtom);
    set(modalStackAtom, {
        ...currentStack,
        [id]: { id, isOpen: true, props }
    });
});
export const closeModalAtom = atom(null, (get, set, id) => {
    const currentStack = get(modalStackAtom);
    if (currentStack[id]) {
        set(modalStackAtom, {
            ...currentStack,
            [id]: { ...currentStack[id], isOpen: false }
        });
    }
});
export const updateModalPropsAtom = atom(null, (get, set, { id, props }) => {
    const currentStack = get(modalStackAtom);
    if (currentStack[id]) {
        set(modalStackAtom, {
            ...currentStack,
            [id]: { ...currentStack[id], props }
        });
    }
});
export const removeModalAtom = atom(null, (get, set, id) => {
    const currentStack = get(modalStackAtom);
    const { [id]: removed, ...rest } = currentStack;
    set(modalStackAtom, rest);
});
export const resetModalsAtom = atom(null, (_, set) => {
    set(modalStackAtom, {});
});
// Utility atoms
export const isModalOpenAtom = atom((get) => (id) => get(modalStackAtom)[id]?.isOpen ?? false);
export const getModalPropsAtom = atom((get) => (id) => get(modalStackAtom)[id]?.props ?? {});
