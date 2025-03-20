import { useAtom } from 'jotai';
import {
    closeModalAtom,
    getModalPropsAtom,
    isModalOpenAtom,
    openModalAtom,
    removeModalAtom,
    resetModalsAtom,
    updateModalPropsAtom
} from './atoms';
import type { ModalActions } from './types';

export * from './types';

export const useModals = (): ModalActions => {
  const [, openModal] = useAtom(openModalAtom);
  const [, closeModal] = useAtom(closeModalAtom);
  const [, updateModalProps] = useAtom(updateModalPropsAtom);
  const [, removeModal] = useAtom(removeModalAtom);
  const [, resetModals] = useAtom(resetModalsAtom);
  const [isOpen] = useAtom(isModalOpenAtom);
  const [getProps] = useAtom(getModalPropsAtom);

  return {
    open: (id: string, props?: Record<string, unknown>) => openModal({ id, props }),
    close: (id: string) => closeModal(id),
    updateProps: (id: string, props: Record<string, unknown>) => updateModalProps({ id, props }),
    remove: (id: string) => removeModal(id),
    reset: () => resetModals(),
    isOpen: (id: string) => isOpen(id),
    getProps: (id: string) => getProps(id)
  };
};
