export interface ChatInputState {
  value: string;
  isWaitingForResponse: boolean;
  error: string | null;
  isComposing: boolean;
  lastSubmitted: string | null;
}

export interface ChatInputActions {
  setValue: (value: string) => void;
  clear: () => void;
  setWaiting: (isWaiting: boolean) => void;
  setError: (error: string | null) => void;
  setComposing: (isComposing: boolean) => void;
  submit: () => void;
  reset: () => void;
}
