import { atom } from 'jotai';
const DEFAULT_DURATION = 200;
const DEFAULT_EASING = 'ease-in-out';
// Base atoms for animation state
export const animationStateAtom = atom({
    isAnimating: false,
    type: 'fade',
    duration: DEFAULT_DURATION,
    easing: DEFAULT_EASING
});
// Action atoms
export const startAnimationAtom = atom(null, (get, set, { type, direction }) => {
    set(animationStateAtom, {
        ...get(animationStateAtom),
        isAnimating: true,
        type,
        direction
    });
});
export const stopAnimationAtom = atom(null, (get, set) => {
    set(animationStateAtom, {
        ...get(animationStateAtom),
        isAnimating: false
    });
});
export const setAnimationDurationAtom = atom(null, (get, set, duration) => {
    set(animationStateAtom, {
        ...get(animationStateAtom),
        duration
    });
});
export const setAnimationDelayAtom = atom(null, (get, set, delay) => {
    set(animationStateAtom, {
        ...get(animationStateAtom),
        delay
    });
});
export const setAnimationEasingAtom = atom(null, (get, set, easing) => {
    set(animationStateAtom, {
        ...get(animationStateAtom),
        easing
    });
});
// Derived atoms for computed values
export const isAnimatingAtom = atom((get) => get(animationStateAtom).isAnimating);
export const currentAnimationTypeAtom = atom((get) => get(animationStateAtom).type);
export const currentAnimationDirectionAtom = atom((get) => get(animationStateAtom).direction);
