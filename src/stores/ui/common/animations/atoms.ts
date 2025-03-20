import { atom } from 'jotai';
import type { AnimationDirection, AnimationState, AnimationType } from './types';

const DEFAULT_DURATION = 200;
const DEFAULT_EASING = 'ease-in-out';

// Base atoms for animation state
export const animationStateAtom = atom<AnimationState>({
  isAnimating: false,
  type: 'fade',
  duration: DEFAULT_DURATION,
  easing: DEFAULT_EASING
});

// Action atoms
export const startAnimationAtom = atom(
  null,
  (get, set, { type, direction }: { type: AnimationType; direction?: AnimationDirection }) => {
    set(animationStateAtom, {
      ...get(animationStateAtom),
      isAnimating: true,
      type,
      direction
    });
  }
);

export const stopAnimationAtom = atom(
  null,
  (get, set) => {
    set(animationStateAtom, {
      ...get(animationStateAtom),
      isAnimating: false
    });
  }
);

export const setAnimationDurationAtom = atom(
  null,
  (get, set, duration: number) => {
    set(animationStateAtom, {
      ...get(animationStateAtom),
      duration
    });
  }
);

export const setAnimationDelayAtom = atom(
  null,
  (get, set, delay: number) => {
    set(animationStateAtom, {
      ...get(animationStateAtom),
      delay
    });
  }
);

export const setAnimationEasingAtom = atom(
  null,
  (get, set, easing: string) => {
    set(animationStateAtom, {
      ...get(animationStateAtom),
      easing
    });
  }
);

// Derived atoms for computed values
export const isAnimatingAtom = atom((get) => get(animationStateAtom).isAnimating);
export const currentAnimationTypeAtom = atom((get) => get(animationStateAtom).type);
export const currentAnimationDirectionAtom = atom((get) => get(animationStateAtom).direction);
