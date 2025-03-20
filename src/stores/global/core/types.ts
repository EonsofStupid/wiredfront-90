
export interface CoreState {
  appVersion: string;
  initialized: boolean;
  isOnline: boolean;
  lastActive: string | null;
  isLoading: boolean;
  error: Error | null;
}

export interface CoreActions {
  initialize: () => Promise<void>;
  setOnlineStatus: (isOnline: boolean) => void;
  updateLastActive: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: Error | null) => void;
}

export type CoreStore = CoreState & CoreActions;
