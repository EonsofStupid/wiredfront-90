
import { TokenState, TokenActions, TokenStore } from '@/components/chat/shared/types/token-types';
import { TokenEnforcementMode } from '@/types/chat/enums';

export type { TokenState, TokenActions, TokenStore };
export { TokenEnforcementMode };

export type SetState<T> = (
  partial: T | Partial<T> | ((state: T) => T | Partial<T>),
  replace?: boolean
) => void;

export type GetState<T> = () => T;
