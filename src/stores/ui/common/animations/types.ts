export type AnimationType = 'fade' | 'slide' | 'scale' | 'bounce' | 'spin';
export type AnimationDirection = 'up' | 'down' | 'left' | 'right';

export interface AnimationState {
  isAnimating: boolean;
  type: AnimationType;
  direction?: AnimationDirection;
  duration: number;
  delay?: number;
  easing?: string;
}

export interface AnimationActions {
  startAnimation: (type: AnimationType, direction?: AnimationDirection) => void;
  stopAnimation: () => void;
  setDuration: (duration: number) => void;
  setDelay: (delay: number) => void;
  setEasing: (easing: string) => void;
}

export type AnimationStore = AnimationState & AnimationActions;
