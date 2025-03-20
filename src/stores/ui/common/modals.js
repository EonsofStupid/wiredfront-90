import { atom } from 'jotai';
// Base atoms
export const modalStackAtom = atom({});
// Derived atom for active modals
export const activeModalsAtom = atom((get) => {
    const stack = get(modalStackAtom);
    return Object.values(stack).filter((modal) => modal.isOpen);
});
// Action atoms
export const openModalAtom = atom(null, (get, set, { id, props = {} }) => {
    const stack = get(modalStackAtom);
    set(modalStackAtom, {
        ...stack,
        [id]: {
            id,
            isOpen: true,
            props
        }
    });
});
export const closeModalAtom = atom(null, (get, set, id) => {
    const stack = get(modalStackAtom);
    set(modalStackAtom, {
        ...stack,
        [id]: {
            ...stack[id],
            isOpen: false
        }
    });
});
export const updateModalPropsAtom = atom(null, (get, set, { id, props }) => {
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
});
export const removeModalAtom = atom(null, (get, set, id) => {
    const stack = get(modalStackAtom);
    const { [id]: removed, ...rest } = stack;
    set(modalStackAtom, rest);
});
// Utility atoms
export const isModalOpenAtom = atom((get) => (id) => {
    const stack = get(modalStackAtom);
    return stack[id]?.isOpen ?? false;
});
export const getModalPropsAtom = atom((get) => (id) => {
    const stack = get(modalStackAtom);
    return stack[id]?.props ?? {};
});
// Reset atom
export const resetModalsAtom = atom(null, (get, set) => {
    set(modalStackAtom, {});
});
