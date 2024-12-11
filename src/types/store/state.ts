// Base interface for all store states
export interface BaseState {
  readonly version: number;
}

// Type for store status
export type StoreStatus = 'idle' | 'loading' | 'error' | 'success';

// Base interface for async store states
export interface AsyncState extends BaseState {
  readonly status: StoreStatus;
  readonly error: string | null;
  readonly lastUpdated: number | null;
}

// Type guard for checking if a state is async
export const isAsyncState = (state: unknown): state is AsyncState => {
  return (
    typeof state === 'object' &&
    state !== null &&
    'status' in state &&
    'error' in state &&
    'lastUpdated' in state
  );
};