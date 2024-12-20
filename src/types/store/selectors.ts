import type { StoreApi, UseBoundStore } from 'zustand';

export type StoreSelector<T, R> = (state: T) => R;

export type SelectorHook<T> = UseBoundStore<StoreApi<T>>;

export interface StoreSelectors<T extends object> {
  [key: string]: StoreSelector<T, any>;
}

// Helper type for creating selector hooks
export type CreateSelectorHook<T> = <R>(selector: StoreSelector<T, R>) => R;

// Type for memoized selectors
export type MemoizedSelector<T, R> = {
  (state: T): R;
  reset: () => void;
};

// Create a memoized selector
export const createMemoizedSelector = <T, R>(
  selector: StoreSelector<T, R>
): MemoizedSelector<T, R> => {
  let cache: { input: T; output: R } | null = null;

  const memoizedSelector = (state: T): R => {
    if (cache && cache.input === state) {
      return cache.output;
    }

    const result = selector(state);
    cache = { input: state, output: result };
    return result;
  };

  memoizedSelector.reset = () => {
    cache = null;
  };

  return memoizedSelector;
};