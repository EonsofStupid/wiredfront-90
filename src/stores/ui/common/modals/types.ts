export interface ModalState {
  id: string;
  isOpen: boolean;
  props: Record<string, unknown>;
}

export interface ModalStack {
  [key: string]: ModalState;
}

export interface ModalActions {
  open: (id: string, props?: Record<string, unknown>) => void;
  close: (id: string) => void;
  updateProps: (id: string, props: Record<string, unknown>) => void;
  remove: (id: string) => void;
  reset: () => void;
  isOpen: (id: string) => boolean;
  getProps: (id: string) => Record<string, unknown>;
}
